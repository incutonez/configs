import { execSync } from "child_process";
import { existsSync, readdirSync, writeFileSync } from "fs";
import { readFileSync } from "node:fs";

const stdio = [0, 1, 2];
const nextReleaseVersion = process.env.NEXT_RELEASE_VERSION;
// We're in a workspace
if (existsSync("packages/") && nextReleaseVersion) {
	readdirSync("packages/").forEach((packageName) => {
		const path = `packages/${packageName}/package.json`;
		const packageJSON = JSON.parse(readFileSync(path, "utf8"));
		packageJSON.version = nextReleaseVersion;
		writeFileSync(path, JSON.stringify(packageJSON, null, 2));
	}, {
		stdio,
	});
	execSync("git add .");
}
/* If we're in a workspace, we update the workspace's package instead calling this command against each individual one
 * Reason being, we don't want multiple tags that are the same thing, and we don't want CHANGELOGs that are the same */
execSync("npx semantic-release --deps.bump=inherit", {
	stdio,
});
