import { setUser } from "./config.ts";
import { delUsers } from "./lib/db/queries/users.ts";

export async function handlerReset(cmdName: string, ...args: string[]) {
	await delUsers();
	console.log("User table deleted");
}
