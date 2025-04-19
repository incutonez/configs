import fs from "fs";
import path from "path";

const [pathToDir] = process.argv.slice(2);
const GuidRegex = /_[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}|\[Explicit\]|\s+$/ig;
if (!pathToDir) {
	throw Error("Please specify the path!");
}
// If we're in Windows, and we feed a path like "Z:\Blah\"... the backslash at the end will attempt to escape the quote incorrectly
process.chdir(pathToDir.replace(/"$/, ""));
fs.readdirSync(".").forEach((file) => {
	const { name, ext } = path.parse(file);
	if (GuidRegex.test(name)) {
		fs.renameSync(file, name.replace(GuidRegex, "") + ext);
	}
});
