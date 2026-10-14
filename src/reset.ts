import { setUser } from "./config";
import { delUsers } from "./lib/db/queries/users";

export async function handlerReset(cmdName: string, ...args: string[]) {
	await delUsers();
	console.log("User table deleted");
}
