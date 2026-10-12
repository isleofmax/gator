import { setUser } from "./config";

export async function handlerLogin(cmdName: string, ...args: string[]) {
	if (args.length !== 1) {
		throw new Error(`Usage: ${cmdName} <username>`);
	}
	const user = args[0];
	setUser(user);
	console.log(`Set user to ${user}`);
}
