import { XMLParser } from "fast-xml-parser";
import { getUserByName } from "./lib/db/queries/users.ts";
import { createFeed, getFeeds } from "./lib/db/queries/feeds.ts";
import { createFeedFollow } from "./lib/db/queries/follows.ts";
import { readConfig } from "./config.ts";
import type { Feed, User } from "./lib/db/schema.ts";

export type RSSFeed = {
	channel: {
		title: string;
		link: string;
		description: string;
		item: RSSItem[];
	};
};

export type RSSItem = {
	title: string;
	link: string;
	description: string;
	pubDate: string;
};

export async function fetchFeed(feedURL: string) {
	
  const response = await fetch(feedURL, {
    headers: {
      "User-Agent": "gator"
    }
  });
  if (!response.ok) {
    throw new Error(`Error fetching ${feedURL}`);
  }

  const result = await response.text();
  const parser = new XMLParser({
    processEntities: false
  });

  const xmlObj = parser.parse(result);
  
  if (!xmlObj.rss.channel) {
    throw new Error("Error parsing data: channel tag not found");
  }

  if (!xmlObj.rss.channel.title ||
      !xmlObj.rss.channel.link  ||
      !xmlObj.rss.channel.description) {
    throw new Error("Error parsing data: title or link or description tag not found");
  }

  const title = xmlObj.rss.channel.title;
  const link = xmlObj.rss.channel.link;
  const description = xmlObj.rss.channel.description;

  let items: RSSItem[] = [];
  if (Array.isArray(xmlObj.rss.channel.item)) {
    for (let item of xmlObj.rss.channel.item) {
      if (!item.title   ||
          !item.link    ||
          !item.pubDate ||
          !item.description) {
        continue;
      }
      items.push({
        title: item.title,
        link: item.link,
        description: item.description,
        pubDate: item.pubDate
      });
    }
  }

  const rss: RSSFeed = {
    channel: {
      title: title,
      link: link,
      description: description,
      item: items
    }
  }

  return rss;
}

export async function handlerAddFeed(cmdName: string, user: User, ...args: string[]) {
	if (args.length !== 2) {
		throw new Error(`Usage: ${cmdName} <name> <url>`);
	}
	const name = args.shift();
	const url  = args.shift();
  if (!name || !url) {
		throw new Error(`Usage: ${cmdName} <name> <url>`);
  }
  const feed = await createFeed(user.name, name, url);
  await createFeedFollow(url);
  if (!feed) {
    throw new Error(`Failed to create feed`);
  }
  printFeed(user, feed);
}

export async function handlerFeeds(cmdName: string, ...args: string[]) {
  if (args.length !== 0) {
    throw new Error(`Usage: ${cmdName}`);
  }
	const currentUser = readConfig().currentUserName;
  const user = await getUserByName(currentUser);
  if (!user) {
    throw new Error(`User ${user} not found`);
  }

  const feeds = await getFeeds();
  if (feeds.length === 0) {
    console.log("No feeeds found!");
    return;
  }
  for (let feed of feeds) {
    console.log(`Feed: ${feed.feedName} - url: ${feed.feedUrl} - user: ${feed.userName}`);
  }
}

function printFeed(user: User, feed: Feed) {
  console.log(`Added the feed ${feed.name} with user ${user.name}`);
}

