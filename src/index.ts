import { setUser, readConfig } from "./config";

function main() {
	setUser("Massimo");
	const cfg = readConfig();
	if (cfg === undefined) {
		console.log("config file not read");
		return;
	}
	console.log(cfg);
}

main();
