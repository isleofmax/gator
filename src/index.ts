import { type CommandsRegistry, registerCommand, runCommand} from "./commands";
import { handlerLogin, handlerRegister, handlerGetUsers } from "./users";
import { handlerReset } from "./reset";
import { handlerAgg } from "./aggregate";
import { handlerAddFeed, handlerFeeds } from "./rssfeed";
import { handlerFollow, handlerFollowing } from "./follows";
import { argv, exit } from "node:process";

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
	registerCommand(registry, "addfeed", handlerAddFeed);
	registerCommand(registry, "feeds", handlerFeeds);
	registerCommand(registry, "follow", handlerFollow);
	registerCommand(registry, "following", handlerFollowing);

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
