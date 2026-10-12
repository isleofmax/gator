import { setUser } from "./config";
import { createUser } from "./lib/db/queries/users";

export async function handlerRegister(cmdName: string, ...args: string[]) {
	if (args.length !== 1) {
		throw new Error(`Usage: ${cmdName} <username>`);
	}
	const user = args[0];
	try {
		await createUser(user);
	} catch(err) {
		throw new Error(`User ${user} already exists`);
	}
	setUser(user);
	console.log(`Created user ${user}`);
}
