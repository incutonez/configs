// Run with `npx tsx scaffold.ts -n nameHere -t (vue or react) -d path/to/dir`
import { execSync } from "child_process";
import { cpSync, readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from "fs";
import {readPackage, release, releasePackages, writePackage} from "./shared";

const { argv } = process;
const stdio = [0, 1, 2];
const directoryPathIndex = argv.indexOf("-d");
const projectNameIndex = argv.indexOf("-n");
const projectName = argv[argv.indexOf("-n") + 1];
const workspaceNameIndex = argv.indexOf("-w");
const workspaceName = argv[workspaceNameIndex + 1] === "False" ? undefined : argv[workspaceNameIndex + 1];
const projectRootDir = directoryPathIndex === -1 ? "." : argv[directoryPathIndex + 1] || ".";
const projectType = argv[argv.indexOf("-t") + 1];
const AllowedTypes = ["vue", "react"];

function makePackageItem(items: string[]) {
	return items.reduce((output, item) => {
		output[item] = "latest";
		return output;
	}, {} as Record<string, any>);
}

if (projectNameIndex === -1 || !projectName) {
	console.error("Project name not specified.  Please add `-n ProjectNameHere` when running this command.");
	process.exit(1);
}
if (AllowedTypes.indexOf(projectType) === -1) {
	console.error("Project type not allowed.  Please add `-t (vue or react)` when running this command.");
	process.exit(1);
}

const Packages = [
	"@material-symbols/svg-400",
];
const PackagesDev = [
	"@incutonez/eslint-plugin",
	"@stylistic/eslint-plugin-ts",
	"globals",
	"@typescript-eslint/eslint-plugin",
	"@typescript-eslint/parser",
	"tailwindcss",
	"eslint-plugin-simple-import-sort",
	"@tailwindcss/vite",
	"typescript-eslint",
	"@eslint/js",
	"eslint",
	...releasePackages,
	// This is needed for vite, so we can import path
	"@types/node",
];
if (projectType === "vue") {
	PackagesDev.push("eslint-plugin-vue", "vite-svg-loader");
}
else if (projectType === "react") {
	PackagesDev.push("eslint-plugin-react", "vite-plugin-svgr");
}
const projectDir = `${projectRootDir}/${projectName}`;
if (!existsSync(projectDir)) {
	mkdirSync(projectDir, {
		recursive: true,
	});
}
const PostInstallCommands = [
	"npm i",
	// This locks down versions instead of using "latest"
	"npm upgrade -S"
];
if (!workspaceName) {
	PostInstallCommands.unshift("git init");
	PostInstallCommands.push(
		"npx husky init",
		"npm run prepare",
	);
	PackagesDev.push(
		"husky",
		"lint-staged",
	);
}
execSync(`npm create vite@latest ${projectName} -- --template ${projectType}-ts`, {
	// We need to specify std in, out, and err, so we get the appropriate options when this command runs
	stdio,
	cwd: projectRootDir,
});
cpSync(`${import.meta.dirname}/${projectType}`, projectDir, { force: true, recursive: true });
rmSync(`${projectDir}/public`, { force: true, recursive: true });
rmSync(`${projectDir}/src/assets`, { force: true, recursive: true });
// Just easier to remove the dir entirely and remake it after
rmSync(`${projectDir}/src/components`, { force: true, recursive: true });
mkdirSync(`${projectDir}/src/components`);
const tsConfigContents = JSON.parse(readFileSync(`${projectDir}/tsconfig.app.json`, "utf8").replace(/\/\*[^\n]+\n\s+/g, ""));
const packageContents = readPackage(projectDir);
tsConfigContents.compilerOptions.paths = {
	"@/*": ["./src/*"],
};
const name = workspaceName ? `${workspaceName}-ui` : projectName;
packageContents.name = `@incutonez/${name}`;
packageContents.version = "0.0.1";
packageContents.scripts.explode = "npm cache clean --force && npx rimraf package-lock.json **/node_modules --glob && npm i";
packageContents.scripts.lint = "npx eslint --fix";
packageContents.release = release;
if (workspaceName) {
	packageContents.scripts["update:deps"] = "node ./updateDependencies.js"
	packageContents.scripts["update:versions"] = "node ./updateVersions.js"
	packageContents["lint-staged"] = {
		"*.{js,mjs,cjs,jsx,ts,tsx,vue}": [
			"npx eslint --fix",
		],
	};
}
packageContents.dependencies = {
	...packageContents.dependencies ?? {},
	...makePackageItem(Packages)
};
packageContents.devDependencies = {
	...packageContents.devDependencies ?? {},
	...makePackageItem(PackagesDev)
};
writeFileSync(`${projectDir}/tsconfig.app.json`, JSON.stringify(tsConfigContents, null, 2));
writePackage(projectDir, packageContents);
if (!workspaceName) {
	execSync(PostInstallCommands.join(" && "), {
		stdio,
		cwd: projectDir,
	});
	cpSync(`${import.meta.dirname}/.github`, `${projectDir}/.github`, { force: true, recursive: true });
	cpSync(`${import.meta.dirname}/updateDependencies.js`, `${projectDir}/updateDependencies.js`, { force: true });
	cpSync(`${import.meta.dirname}/updateVersions.js`, `${projectDir}/updateVersions.js`, { force: true });
	// Need to do this after husky has run the prepare command
	cpSync(`${import.meta.dirname}/.husky`, `${projectDir}/.husky`, { force: true, recursive: true });
}
