import { execSync } from "child_process";
import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";

const { argv } = process;
const stdio = [0, 1, 2];
const directoryPathIndex = argv.indexOf("-d");
const projectNameIndex = argv.indexOf("-n");
const projectName = argv[projectNameIndex + 1];
const projectRootDir = directoryPathIndex === -1 ? "." : argv[directoryPathIndex + 1] || ".";

if (projectNameIndex === -1 || !projectName) {
	console.error("Project name not specified.  Please add `-n ProjectNameHere` when running this command.");
	process.exit(1);
}

const projectPath = `${projectRootDir}/${projectName}`;
const specPath = `${projectRootDir}/spec`;
if (!existsSync(projectPath)) {
	mkdirSync(projectPath, {
		recursive: true,
	});
}
if (!existsSync(specPath)) {
	mkdirSync(specPath, {
		recursive: true,
	});
}

const Packages = [
	"@nestjs/common",
	"@nestjs/core",
	"@nestjs/platform-express",
	"reflect-metadata",
	"rxjs",
	"@nestjs/config",
	"@nestjs/sequelize",
	"@nestjs/swagger",
	"compression",
	"sequelize",
	"sequelize-typescript",
	"sqlite3",
	"uuidv4",
];
const PackagesDev = [
	"@nestjs/cli",
	"@nestjs/schematics",
	"@swc/cli",
	"@swc/core",
	"@types/express",
	"@types/node",
	"eslint",
	"eslint-config-prettier",
	"eslint-plugin-prettier",
	"globals",
	"prettier",
	"source-map-support",
	"ts-loader",
	"ts-node",
	"tsconfig-paths",
	"typescript",
	"typescript-eslint",
	"@incutonez/eslint-plugin",
	"@types/sequelize",
	"@typescript-eslint/eslint-plugin",
	"@typescript-eslint/parser",
	"eslint-plugin-simple-import-sort",
];
const InstallCommands = [
	`npm init --scope=@incutonez --yes`,
	`npm i ${Packages.join(" ")}`,
	`npm i -D ${PackagesDev.join(" ")}`,
];
cpSync(`${import.meta.dirname}/api`, projectPath, { force: true, recursive: true });
cpSync(`${import.meta.dirname}/spec`, specPath, { force: true, recursive: true });

execSync(InstallCommands.join(" && "), {
	stdio,
	cwd: projectPath,
});
execSync("npm i", {
	stdio,
	cwd: specPath,
});
const packageContents = JSON.parse(readFileSync(`${projectPath}/package.json`, "utf8"));
packageContents.scripts = {
	"build": "nest build",
	"start": "nest start",
	"start:dev": "nest start -w",
	"start:debug": "nest start --debug --watch",
	"start:prod": "node dist/main",
	"explode": "npx rimraf node_modules package-lock.json && npm i",
};
writeFileSync(`${projectPath}/package.json`, JSON.stringify(packageContents, null, 2));
