import { createFeedFollow,
         getFeedFollowsForUser,
         type FeedFollowName
       } from "./lib/db/queries/follows";
import { readConfig } from "./config";


export async function handlerFollow(cmdName: string, ...args: string[]) {
	if (args.length !== 1) {
		throw new Error(`Usage: ${cmdName} <url>`);
	}
	const url = args[0];
  const follow: FeedFollowName = await createFeedFollow(url);
  console.log(`Created follow of ${follow.user} to ${follow.feedName}`);
}

export async function handlerFollowing(cmdName: string, ...args: string[]) {
  const userName = readConfig().currentUserName;
  const follows = await getFeedFollowsForUser(userName);
  for (let follow of follows) {
    console.log(`${follow.userName} follows ${follow.feedName}`);
  }
}

