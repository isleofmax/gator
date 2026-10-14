import { setUser } from "./config";
import { getUser } from "./lib/db/queries/users";

export async function handlerLogin(cmdName: string, ...args: string[]) {
	if (args.length !== 1) {
		throw new Error(`Usage: ${cmdName} <username>`);
	}
	const user = args[0];
	const existUser = await getUser(user);
	if (!existUser) {
		throw new Error(`Unknownd user: ${cmdName}`);
	}
	setUser(user);
	console.log(`Set user to ${user}`);
}
