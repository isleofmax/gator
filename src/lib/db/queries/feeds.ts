import { db } from "..";
import { eq } from "drizzle-orm";
import { feeds } from "../schema";
import { getUserByName } from "./users";

export async function createFeed(userName: string, title: string, url: string) {
  const user = await getUserByName(userName);
  if (!user) {
    throw new Error(`Cannot find user ${userName}`);
  }

	const [result] = await db.insert(feeds).values({ name: title, url: url, userId: user.id }).returning();
	return result;
}
