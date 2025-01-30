// Run with `npx tsx scaffold.ts -n nameHere -t (vue or react) -d path/to/dir`
import { execSync } from "child_process";
import { cpSync, readFileSync, writeFileSync, mkdirSync, rmSync, copyFileSync } from "fs";

const { argv } = process;
const stdio = [0, 1, 2];
const directoryPathIndex = argv.indexOf('-d');
const projectNameIndex = argv.indexOf('-n');
const projectRootDir = directoryPathIndex === -1 ? '.' : argv[directoryPathIndex + 1] || ".";
const projectName = argv[argv.indexOf('-n') + 1];
const projectType = argv[argv.indexOf('-t') + 1];
const AllowedTypes = ["vue", "react"];

if (projectNameIndex === -1 || !projectName) {
    console.error('Project name not specified.  Please add `-n ProjectNameHere` when running this command.')
    process.exit(1);
}
if (AllowedTypes.indexOf(projectType) === -1) {
    console.error('Project type not allowed.  Please add `-t (vue or react)` when running this command.')
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
    "postcss",
    "autoprefixer",
    "eslint-plugin-simple-import-sort",
    "@tailwindcss/postcss",
    "typescript-eslint",
    "@eslint/js",
    "eslint",
    "husky",
    "lint-staged",
    "semantic-release",
    "@semantic-release/exec",
    "@semantic-release/git",
    // This is needed for vite, so we can import path
    "@types/node"
];
if (projectType === 'vue') {
    PackagesDev.push("eslint-plugin-vue", "vite-svg-loader");
}
else if (projectType === 'react') {
    PackagesDev.push("eslint-plugin-react", "vite-plugin-svgr");
}
const projectDir = `${projectRootDir}/${projectName}`;
const PostInstallCommands = [
    // Make sure we've got an initial repo, so husky prepare works properly
    "git init",
    "npm i",
    `npm i ${Packages.join(' ')}`,
    `npm i -D ${PackagesDev.join(' ')}`,
    "npx husky init",
    "npm run prepare"
]
execSync(`npm create vite@latest ${projectName} -- --template ${projectType}-ts`, {
    // We need to specify std in, out, and err, so we get the appropriate options when this command runs
    stdio,
    cwd: projectRootDir
});
execSync(PostInstallCommands.join(' && '), {
    stdio,
    cwd: projectDir
});
cpSync(`${import.meta.dirname}/.github`, `${projectDir}/.github`, { force: true, recursive: true });
cpSync(`${import.meta.dirname}/.husky`, `${projectDir}/.husky`, { force: true, recursive: true });
cpSync(`${import.meta.dirname}/${projectType}`, projectDir, { force: true, recursive: true });
copyFileSync(`${import.meta.dirname}/postcss.config.js`, `${projectDir}/postcss.config.js`);
rmSync(`${projectDir}/public`, { force: true, recursive: true });
rmSync(`${projectDir}/src/assets`, { force: true, recursive: true });
// Just easier to remove the dir entirely and remake it after
rmSync(`${projectDir}/src/components`, { force: true, recursive: true });
mkdirSync(`${projectDir}/src/components`);
const tsConfigContents = JSON.parse(readFileSync(`${projectDir}/tsconfig.app.json`, 'utf8').replace(/\/\*[^\n]+\n\s+/g, ''))
const packageContents = JSON.parse(readFileSync(`${projectDir}/package.json`, 'utf8'))
tsConfigContents.compilerOptions.paths = {
    "@/*": ["./src/*"]
};
packageContents.name = `@incutonez/${packageContents.name}`;
packageContents.version = "0.0.1";
packageContents["lint-staged"] = {
    "*.{js,mjs,cjs,jsx,ts,tsx,vue}": [
        "npx eslint --fix"
    ]
}
packageContents.release = {
    "branches": [
        "main"
    ],
    "plugins": [
        "@semantic-release/commit-analyzer",
        "@semantic-release/release-notes-generator",
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
writeFileSync(`${projectDir}/tsconfig.app.json`, JSON.stringify(tsConfigContents, null, 2));
writeFileSync(`${projectDir}/package.json`, JSON.stringify(packageContents, null, 2));
