import { execSync } from "child_process";
import { cpSync, existsSync, mkdirSync } from "fs";

const { argv } = process;
const stdio = [0, 1, 2];
const uiFrameworkIndex = argv.indexOf("-ui");
const uiFramework = uiFrameworkIndex === -1 ? "vue" : argv[uiFrameworkIndex + 1];
const projectName = argv[argv.indexOf("-n") + 1];
const directoryPathIndex = argv.indexOf("-d");
const projectRootDir = directoryPathIndex === -1 ? "." : argv[directoryPathIndex + 1] || ".";
const projectDir = `${projectRootDir}/${projectName}`;
const packagesDir = `${projectDir}/packages`;

if (!existsSync(packagesDir)) {
	mkdirSync(packagesDir, {
		recursive: true,
	});
}
execSync(`npx tsx ${import.meta.dirname}/ui.ts -n "ui" -w "True" -t "${uiFramework}"`, {
	stdio,
	cwd: packagesDir,
});
execSync(`npx tsx ${import.meta.dirname}/api.ts -n "api" -w "True"`, {
	stdio,
	cwd: packagesDir,
});
cpSync(`${import.meta.dirname}/workspace.package.json`, `${projectDir}/package.json`, {
	force: true,
	recursive: true,
});
cpSync(`${import.meta.dirname}/.github`, `${projectDir}/.github`, { force: true, recursive: true });
cpSync(`${import.meta.dirname}/.husky`, `${projectDir}/.husky`, { force: true, recursive: true });
execSync("npm i", {
	stdio,
	cwd: projectDir,
});
execSync(`cd ${projectDir}`, {
	stdio,
});
