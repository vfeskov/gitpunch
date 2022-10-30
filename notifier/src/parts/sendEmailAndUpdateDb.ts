import { UserModel } from "gitpunch-lib/db/User.js";
import log from "gitpunch-lib/log.js";
import {
  ONLY_UPDATE_ALERTED,
  SEND_EMAIL_AND_UPDATE_ALERTED,
} from "./constants.js";
import Email from "./email.js";
import { ActionableUser, Alerted } from "./interfaces";
const { assign, keys } = Object;

export default function sendEmailAndUpdateDb(users: ActionableUser[]) {
  return Promise.all(
    users.map(async (user) => {
      try {
        await sendEmail(user);
        await updateDb(user);
      } catch (error) {
        const { _id, email } = user;
        log("alertAndUpdateDbError", { _id, email, error: error.stack });
      }
    })
  );
}

const MAJOR = /^v?\d+(\.0)?(\.0)?$/;
const MINOR = /^v?\d+(\.\d+)?(\.0)?$/;
const PATCH = /^v?\d+(\.\d+)?(\.\d+)?$/;
export async function sendEmail(user: ActionableUser): Promise<any> {
  const {
    email,
    mutedRepos = [],
    majors = [],
    minors = [],
    patches = [],
    actionableRepos,
  } = user;
  const repos = actionableRepos[SEND_EMAIL_AND_UPDATE_ALERTED].filter(
    ({ repo }) => !mutedRepos.includes(repo)
  )
    .map(({ repo, tags }) => {
      if (majors.includes(repo)) {
        tags = filteredTags(tags, MAJOR);
      } else if (minors.includes(repo)) {
        tags = filteredTags(tags, MINOR);
      } else if (patches.includes(repo)) {
        tags = filteredTags(tags, PATCH);
      }
      return { repo, tags };
    })
    .filter(({ tags }) => tags.length);
  if (!repos.length) {
    return;
  }
  return new Email(email, repos).send();
}

function filteredTags(tags, pattern) {
  return tags.filter(({ name }) => pattern.test(name));
}

export async function updateDb(user: ActionableUser): Promise<any> {
  const { _id, email, alerted, actionableRepos } = user;
  const $set: any = {};
  const repos = [
    ...actionableRepos[SEND_EMAIL_AND_UPDATE_ALERTED],
    ...actionableRepos[ONLY_UPDATE_ALERTED],
  ];
  const newAlerted = repos.reduce((newAlerted, { repo, tags }) => {
    newAlerted[repo] = tags[0].name;
    return newAlerted;
  }, {}) as Alerted;
  assign(alerted, newAlerted);
  const alertedAsArray = keys(alerted).map((repo) => [repo, alerted[repo]]);
  $set.alerted = alertedAsArray;
  log("updateDb", { _id, email, $set });
  return UserModel.updateOne({ _id }, { $set });
}
