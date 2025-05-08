import { readFileSync, writeFileSync } from "fs";

export const release = {
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

export const releasePackages = [
    "@semantic-release/changelog",
    "@semantic-release/exec",
    "@semantic-release/git",
    "conventional-changelog-conventionalcommits",
    "semantic-release",
];

export function readPackage(path: string) {
    return JSON.parse(readFileSync(`${path}/package.json`, "utf8"));
}

export function writePackage(path: string, contents: unknown) {
    writeFileSync(`${path}/package.json`, JSON.stringify(contents, null, 2));
}