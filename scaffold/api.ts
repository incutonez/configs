import { execSync } from "child_process";
import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";

const { argv } = process;
const stdio = [0, 1, 2];
const directoryPathIndex = argv.indexOf("-d");
const projectNameIndex = argv.indexOf("-n");
const workspaceIndex = argv.indexOf("-w");
const isNonWorkspace = workspaceIndex === -1 || argv[workspaceIndex + 1] === "False";
const projectName = argv[projectNameIndex + 1];
const projectRootDir = directoryPathIndex === -1 ? "." : argv[directoryPathIndex + 1] || ".";
const PostInstallCommands = ["npm i"]

function makePackageItem(items: string[]) {
	return items.reduce((output, item) => {
		output[item] = "latest"
		return output;
	}, {} as Record<string, any>)
}

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

execSync("npm init --scope=@incutonez --yes", {
	stdio,
	cwd: projectPath,
});
execSync("npm init --scope=@incutonez --yes", {
	stdio,
	cwd: specPath,
});
cpSync(`${import.meta.dirname}/api`, projectPath, { force: true, recursive: true });
cpSync(`${import.meta.dirname}/spec`, specPath, { force: true, recursive: true });
const apiPackage = JSON.parse(readFileSync(`${projectPath}/package.json`, "utf8"));
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
]

apiPackage.scripts = {
	"build": "nest build",
	"start": "nest start",
	"start:dev": "nest start -w",
	"start:debug": "nest start --debug --watch",
	"start:prod": "node dist/main",
	"explode": "npx rimraf node_modules package-lock.json && npm i",
};
if (isNonWorkspace) {
	cpSync(`${import.meta.dirname}/.github`, `${projectPath}/.github`, { force: true, recursive: true });
	cpSync(`${import.meta.dirname}/updateDependencies.js`, `${projectPath}/updateDependencies.js`, { force: true });
	cpSync(`${import.meta.dirname}/updateVersions.js`, `${projectPath}/updateVersions.js`, { force: true });
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
	]),
};
apiPackage.devDependencies = {
	...apiPackage.devDependencies ?? {},
	...makePackageItem(PackagesDev)
};

if (isNonWorkspace) {
	apiPackage["lint-staged"] = {
		"*.{js,mjs,cjs,jsx,ts,tsx,vue}": [
			"npx eslint --fix",
		],
	};
	apiPackage.release = {
		"branches": [
			"main"
		],
		"plugins": [
			[
				"@semantic-release/commit-analyzer",
				{
					"preset": "conventionalcommits"
				}
			],
			[
				"@semantic-release/release-notes-generator",
				{
					"preset": "conventionalcommits"
				}
			],
			"@semantic-release/changelog",
			[
				"@semantic-release/npm",
				{
					"npmPublish": false
				}
			],
			"@semantic-release/git",
			"@semantic-release/github"
		]
	};
}
writeFileSync(`${projectPath}/package.json`, JSON.stringify(apiPackage, null, 2));
if (isNonWorkspace) {
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
