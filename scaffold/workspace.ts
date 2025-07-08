import { execSync } from "child_process";
import { cpSync, existsSync, mkdirSync } from "fs";
import {readPackage, release, writePackage} from "./shared";

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
execSync(`npx tsx ${import.meta.dirname}/ui.ts -n "ui" -w "${projectName}" -t "${uiFramework}"`, {
	stdio,
	cwd: packagesDir,
});
execSync(`npx tsx ${import.meta.dirname}/api.ts -n "api" -w "${projectName}"`, {
	stdio,
	cwd: packagesDir,
});
cpSync(`${import.meta.dirname}/workspace.package.json`, `${projectDir}/package.json`, {
	force: true,
	recursive: true,
});
const workspacePackage = readPackage(projectDir);
workspacePackage.name = `@incutonez/${projectName}`;
workspacePackage.release = release;
// This allows us to use a dry run to capture the next package version, so we can update our individual packages directly
workspacePackage.release.plugins.unshift([
	"@semantic-release/exec",
	{
		"verifyReleaseCmd": "echo \"NEXT_RELEASE_VERSION=${nextRelease.version}\" >> $GITHUB_ENV"
	}
]);
writePackage(projectDir, workspacePackage);
cpSync(`${import.meta.dirname}/updateDependencies.js`, `${projectDir}/updateDependencies.js`, { force: true });
cpSync(`${import.meta.dirname}/updateVersions.js`, `${projectDir}/updateVersions.js`, { force: true });
cpSync(`${import.meta.dirname}/.github`, `${projectDir}/.github`, { force: true, recursive: true });
cpSync(`${import.meta.dirname}/.husky`, `${projectDir}/.husky`, { force: true, recursive: true });
execSync("npm i", {
	stdio,
	cwd: projectDir,
});
// This locks down versions instead of using "latest"
execSync("npm upgrade -S", {
	stdio,
	cwd: projectDir,
});
execSync(`cd ${projectDir}`, {
	stdio,
});