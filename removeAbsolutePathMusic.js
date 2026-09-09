import fs from "fs";

const [pathToDir] = process.argv.slice(2);
if (!pathToDir) {
	throw Error("Please specify the path!");
}
// If we're in Windows, and we feed a path like "Z:\Blah\"... the backslash at the end will attempt to escape the quote incorrectly
process.chdir(pathToDir.replace(/"$/, ""));
fs.readdirSync(".").forEach((file) => {
	let contents = fs.readFileSync(file, "utf-8");
	contents = contents.replace(/\\\\MyCloudEx2Ultra\\Public|Z:/ig, "");
	fs.writeFileSync(file, contents);
});
