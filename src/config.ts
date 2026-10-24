import os from "os";
import fs from "fs";
import path from "path";

export type Config = {
	dbUrl: string;
	currentUserName: string;
};

export function setUser(user: string) {
	const cfg = {
		db_url: "postgres://postgres:postgres@localhost:5432/gator?sslmode=disable",
		current_user_name: user
	};
	const filePath = getConfigFilePath();
	fs.writeFileSync(filePath, JSON.stringify(cfg, null, 4));
}

export function readConfig(): Config {
	const filePath = getConfigFilePath();
	const cfg_file = fs.readFileSync(filePath, { encoding: "utf-8" });
	const cfg_obj  = validateConfig(JSON.parse(cfg_file));
	return cfg_obj;
}

function getConfigFilePath(): string {
	return path.join(os.homedir(), ".gatorconfig.json");
}

function validateConfig(rawConfig: any): Config {
	if ("db_url" in rawConfig && "current_user_name" in rawConfig) {
		return { dbUrl: rawConfig.db_url, currentUserName: rawConfig.current_user_name ?? ""};
	}
	throw new Error("Cannot read config file");
}
