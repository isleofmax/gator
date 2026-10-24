import { db } from "../index.ts";
import { eq } from "drizzle-orm";
import { feeds, users, feedFollow } from "../schema.ts";
import { getUserByName } from "./users.ts";
import { readConfig } from "../../../config.ts";

export type FeedFollowName = {
  user: string;
  feedName: string;
};

export async function createFeedFollow(url: string) {
  const userName = readConfig().currentUserName;
  const user = await getUserByName(userName);
  const [feed] = await db.select({
    id: feeds.id,
    name: feeds.name
  }).from(feeds).where(eq(feeds.url, url));
	await db.insert(feedFollow).values({ userId: user.id, feedId: feed.id });
  const followName: FeedFollowName = {
    user: user.name,
    feedName: feed.name
  };
  return followName;
}

export async function getFeedFollowsForUser(userName: string) {
	const results = await db.select({
    ffId: feedFollow.id,
    ffCreated: feedFollow.createdAt,
    ffUpdated: feedFollow.updatedAt,
    feedName: feeds.name,
    userName: users.name
  })
  .from(feedFollow)
  .innerJoin(feeds, eq(feedFollow.feedId, feeds.id))
  .innerJoin(users, eq(feedFollow.userId, users.id))
  .where(eq(users.name, userName));

  return results;
}
