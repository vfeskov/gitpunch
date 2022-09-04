import { ActionableUser } from "./interfaces";
import { fetchAtom, trackFetchErrors } from "gitpunch-lib/githubAtom.js";
import { SEND_EMAIL_AND_UPDATE_ALERTED } from "./constants.js";

let { MAX_RELEASE_NOTES_TO_FETCH = 1000 } = process.env;

export default async function fetchReleaseNotes(users: ActionableUser[]) {
  const repos = users.map(
    (u) => u.actionableRepos[SEND_EMAIL_AND_UPDATE_ALERTED]
  );
  const reposToFetch = [
    ...new Set(
      repos.reduce(
        (res, userRepos) => [
          ...res,
          ...userRepos.filter((r) => r.tags.length).map((r) => r.repo),
        ],
        [] as string[]
      )
    ),
  ];

  const errors = trackFetchErrors();
  const notesArray = [];
  for (let repo of reposToFetch.slice(0, +MAX_RELEASE_NOTES_TO_FETCH)) {
    try {
      const url = `https://github.com/${repo}/releases.atom`;
      const releases = await fetchAtom(url, true);
      const map = releases.reduce(
        (res, { name, entry }) => ({ ...res, [name]: entry }),
        {}
      );
      notesArray.push({ repo, releases: map });
    } catch (error) {
      errors.push(repo, error);
    }
  }
  errors.log("fetchReleaseNotesErrors");

  const notes = notesArray.reduce(
    (res, { repo, releases }) => ({ ...res, [repo]: releases }),
    {}
  );

  repos.forEach((userRepos) =>
    userRepos.forEach(({ repo, tags }) =>
      tags.forEach(
        (tag) =>
          (tag.entry = notes[repo]
            ? notes[repo][tag.name] || ""
            : `<a href="https://github.com/${repo}/releases/tag/${tag.name}">Release notes</a>`)
      )
    )
  );
  return users;
}
