import { setUser, readConfig } from "./config";
import { getUser, getUsers, createUser } from "./lib/db/queries/users";

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

export async function handlerGetUsers(cmdName: string, ...args: string[]) {
	const users = await getUsers();
	if (users.length === 0) {
		console.log("Users table is empty");
		return;
	}
	console.log("List of users:")
	users.forEach((user) => {
		console.log(user.name);
	});
	const currentUser = readConfig().currentUserName;
	console.log(`${currentUser} (current)`);
}


