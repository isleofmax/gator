import { db } from "../index.ts";
import { eq, sql } from "drizzle-orm";
import { feeds, users } from "../schema.ts";
import { getUserByName } from "./users.ts";

export async function createFeed(userName: string, title: string, url: string) {
  const user = await getUserByName(userName);
  if (!user) {
    throw new Error(`Cannot find user ${userName}`);
  }

	const [result] = await db.insert(feeds).values({ name: title, url: url, userId: user.id }).returning();
	return result;
}

export async function getFeeds() {
	const results = await db.select({
    feedName: feeds.name,
    feedUrl: feeds.url,
    userName: users.name
  }).from(feeds).innerJoin(users, eq(feeds.userId, users.id));
  return results;
}

export async function getFeedByUrl(url: string) {
	const [result] = await db.select({
    feedId: feeds.id,
  }).from(feeds).where(eq(feeds.url, url));

  return result;
}

export async function markFeedFetched(id: string) {
  const now = Date.now();
  await db.update(feeds).set({ updatedAt: new Date(now), lastFetchedAt: new Date(now) }).where(eq(feeds.id, id));
}

export async function getNextFeedToFetch() {
}
