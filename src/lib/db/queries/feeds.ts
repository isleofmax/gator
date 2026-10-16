import { db } from "..";
import { eq } from "drizzle-orm";
import { feeds, users } from "../schema";

export async function createFeed(userName: string, title: string, url: string) {
  const user = await users.getUser(userName);
  if (!user) {
    throw new Error(`Cannot find user ${userName}`);
  }

	const [result] = await db.insert(feeds).values({ name: title, url: usr, userId: user.id }).returning();
	return result;
}
