import {execSync} from "child_process";
import {cpSync, existsSync, mkdirSync} from "fs";
import {readPackage, release, releasePackages, writePackage} from "./shared";

const {argv} = process;
const stdio = [0, 1, 2];
const directoryPathIndex = argv.indexOf("-d");
const packageNameIndex = argv.indexOf("-n");
const packageName = argv[packageNameIndex + 1];
const workspaceNameIndex = argv.indexOf("-w");
const workspaceName = argv[workspaceNameIndex + 1] === "False" ? undefined : argv[workspaceNameIndex + 1];
const projectRootDir = directoryPathIndex === -1 ? "." : argv[directoryPathIndex + 1] || ".";
const PostInstallCommands = ["npm i", "npm upgrade -S"]

function makePackageItem(items: string[]) {
	return items.reduce((output, item) => {
		output[item] = "latest"
		return output;
	}, {} as Record<string, any>)
}

if (packageNameIndex === -1 || !packageName) {
	console.error("Project name not specified.  Please add `-n ProjectNameHere` when running this command.");
	process.exit(1);
}

const projectPath = `${projectRootDir}/${packageName}`;
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

execSync("npm init --scope=@incutonez --yes", {
	stdio,
	cwd: projectPath,
});
execSync("npm init --scope=@incutonez --yes", {
	stdio,
	cwd: specPath,
});
cpSync(`${import.meta.dirname}/api`, projectPath, {force: true, recursive: true});
cpSync(`${import.meta.dirname}/spec`, specPath, {force: true, recursive: true});
const apiPackage = readPackage(projectPath);
const specPackage = readPackage(specPath);
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
	"@types/compression",
	"@typescript-eslint/eslint-plugin",
	"@typescript-eslint/parser",
	"@stylistic/eslint-plugin-ts",
	"eslint-plugin-simple-import-sort",
	...releasePackages,
];
apiPackage.release = release;
for (const pkg of releasePackages) {
	specPackage.devDependencies = {};
	specPackage.devDependencies[pkg] = "latest";
}
specPackage.release = release;
specPackage.name = `@incutonez/${workspaceName || packageName}-spec`;

apiPackage.scripts = {
	"build": "nest build",
	"explode": "npm cache clean --force && npx rimraf package-lock.json **/node_modules --glob && npm i",
	"lint": "npx eslint --fix",
	"start": "nest start",
	"start:dev": "nest start -w",
	"start:debug": "nest start --debug --watch",
	"start:prod": "node dist/main",
};
if (!workspaceName) {
	cpSync(`${import.meta.dirname}/.github`, `${projectPath}/.github`, {force: true, recursive: true});
	cpSync(`${import.meta.dirname}/updateDependencies.js`, `${projectPath}/updateDependencies.js`, {force: true});
	cpSync(`${import.meta.dirname}/updateVersions.js`, `${projectPath}/updateVersions.js`, {force: true});
	apiPackage.scripts["update:deps"] = "node ./updateDependencies.js"
	apiPackage.scripts["update:versions"] = "node ./updateVersions.js"
	PostInstallCommands.unshift("git init");
	PostInstallCommands.push(
		"npx husky init",
		"npm run prepare",
	);
	PackagesDev.push(
		"husky",
		"lint-staged",
		"semantic-release",
		"@semantic-release/changelog",
		"conventional-changelog-conventionalcommits",
		"@semantic-release/exec",
		"@semantic-release/git",
	);
}

apiPackage.dependencies = {
	...apiPackage.dependencies ?? {},
	...makePackageItem([
		"@nestjs/common",
		"@nestjs/core",
		"@nestjs/platform-express",
		"@sequelize/core",
		"@sequelize/sqlite3",
		"class-transformer",
		"class-validator",
		"compression",
		"reflect-metadata",
		"rxjs",
		"@nestjs/config",
		"@nestjs/swagger",
		"compression",
		"uuidv4",
	]),
};
apiPackage.devDependencies = {
	...apiPackage.devDependencies ?? {},
	...makePackageItem(PackagesDev)
};
const apiName = workspaceName ? `${workspaceName}-api` : `${packageName}-api`;
apiPackage.name = `@incutonez/${apiName}`;

if (workspaceName) {
	apiPackage["lint-staged"] = {
		"*.{js,mjs,cjs,jsx,ts,tsx,vue}": [
			"npx eslint --fix",
		],
	};
}
writePackage(projectPath, apiPackage);
writePackage(`${projectRootDir}/spec`, specPackage);
if (!workspaceName) {
	execSync(PostInstallCommands.join(" && "), {
		stdio,
		cwd: projectPath,
	})
	execSync("npm i", {
		stdio,
		cwd: specPath,
	})
	// Need to do this after husky has run the prepare command
	cpSync(`${import.meta.dirname}/.husky`, `${projectPath}/.husky`, { force: true, recursive: true });
}
