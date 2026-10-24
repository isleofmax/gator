import { type CommandsRegistry, registerCommand, runCommand } from "./commands.ts";
import { handlerLogin, handlerRegister, handlerGetUsers } from "./users.ts";
import { handlerReset } from "./reset.ts";
import { handlerAgg } from "./aggregate.ts";
import { handlerAddFeed, handlerFeeds } from "./rssfeed.ts";
import { handlerFollow, handlerFollowing, handlerRemoveFollow } from "./follows.ts";
import { argv, exit } from "node:process";
import { middlewareLoggedIn } from "./middleware.ts";

async function main() {
	const command = argv.slice(2);
	if (command.length < 1) {
		console.log("please give a command");
		exit(1);
	}

	const cmdName = command[0];
	const cmdArgs = command.slice(1);
	const registry: CommandsRegistry = {};

	registerCommand(registry, "login", handlerLogin);
	registerCommand(registry, "register", handlerRegister);
	registerCommand(registry, "reset", handlerReset);
	registerCommand(registry, "users", handlerGetUsers);
	registerCommand(registry, "agg", handlerAgg);
	registerCommand(registry, "addfeed", middlewareLoggedIn(handlerAddFeed));
	registerCommand(registry, "feeds", handlerFeeds);
	registerCommand(registry, "follow", middlewareLoggedIn(handlerFollow));
	registerCommand(registry, "following",  middlewareLoggedIn(handlerFollowing));
	registerCommand(registry, "unfollow",  middlewareLoggedIn(handlerRemoveFollow));

	try {
		await runCommand(registry, cmdName, ...cmdArgs);
	} catch(err) {
		if (err instanceof Error) {
			console.error(`Error: ${err.message}`);
		} else {
			console.error(`Error executing command ${cmdName}`);
		}
		exit(1);
	}
	exit(0);
}

main();
