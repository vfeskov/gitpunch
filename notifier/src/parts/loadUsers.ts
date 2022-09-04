import log from "gitpunch-lib/log.js";
import { UserModel } from "gitpunch-lib/db/index.js";
import { DBUser } from "./interfaces";

export default async function loadUsers(): Promise<DBUser[]> {
  const query: any = {
    watching: true,
    $or: [
      {
        $or: [{ frequency: { $exists: false } }, { frequency: "realtime" }],
      },
    ],
  };

  const date = new Date();
  if (date.getUTCMinutes() === 0) {
    query.$or.push({
      frequency: "daily",
      checkAt: 7,
    });
  }

  const users = await UserModel.find(query).then((users) =>
    users.map((user) => ({
      _id: user._id,
      email: user.email,
      mutedRepos: user.mutedRepos,
      accessToken: user.accessToken,
      majors: user.majors,
      minors: user.minors,
      patches: user.patches,
      repos: user.repos,
      alerted: (user.alerted || []).reduce((alerted, [repo, tag]) => {
        alerted[repo] = tag;
        return alerted;
      }, {}),
    }))
  );
  log("dbUsers", { count: users.length });
  return users;
}
