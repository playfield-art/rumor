const fs = require("fs");
const path = require("path");
const { Octokit } = require("@octokit/rest");
require("dotenv").config();
var { version } = require("../package.json");
const logger = require("./logger");

/**
 * Prepare API requests
 */

const octokit = new Octokit({ auth: process.env.GH_TOKEN });
const binDir = path.join(process.cwd(), "bin");
const tagname = `v${version}`;
const owner = "playfield-art";
const repo = "rumor";

const publish = async () => {
  // show the outer world what we are doing
  logger.info("Start publishing!");

  /**
   * The current tags for this repo
   */

  // logging
  logger.info(`Creating a tag for version ${version}...`);

  let { data: tagData } = await octokit.rest.repos.listTags({
    owner,
    repo,
  });

  // check if the current version already exists
  const tagExists = tagData.filter((t) => t.name === tagname).length > 0;

  // validate
  if (tagExists) {
    logger.info(`Tag ${version} already exists.`);
  }

  // if tag doesn't exist, create one
  if (!tagExists) {
    // get the last commit
    const lastCommitSha = (
      await octokit.rest.repos.listCommits({
        owner,
        repo,
      })
    ).data[0].sha;

    // version does not exist, create a new ref with the last commit
    await octokit.rest.git.createRef({
      owner,
      repo,
      ref: `refs/tags/${tagname}`,
      sha: lastCommitSha,
    });
  }

  /**
   * Generate the Release Notes
   */

  let releaseNotes = "";
  // if (!tagExists) {
  //   // logging
  //   logger.info("Generating release notes...");

  //   // get the tagdata with the new tag
  //   let { data: updatedTagData } = await octokit.rest.repos.listTags({
  //     owner,
  //     repo,
  //   });

  //   // get the current, requested tag
  //   const currentTag = updatedTagData.find((tag) => tag.name === tagname);
  //   // get the previous tag, so we can find the difference between the two
  //   const previousTag =
  //     updatedTagData[
  //       updatedTagData.findIndex((tag) => tag.name === tagname) + 1
  //     ];

  //   // if we found the current and previous tag
  //   if (currentTag && previousTag) {
  //     // get the commits
  //     const commits = await octokit.repos.compareCommitsWithBasehead({
  //       owner,
  //       repo,
  //       basehead: `${previousTag.name}...${currentTag.name}`,
  //     });

  //     // if we have commits, please note what has changed
  //     if (commits.data && commits.data.total_commits > 0) {
  //       releaseNotes += `# What's Changed \n${commits.data.commits
  //         .map((c) => {
  //           return `- [${c.commit.message}](${c.html_url}) by ${c.committer.login}`;
  //         })
  //         .join("\n")}`;
  //     }
  //   }
  // }

  /**
   * Create a new release
   */

  let release;
  if (!tagExists) {
    // logging
    logger.info(`Creating a release from tag...`);

    release = await octokit.rest.repos.createRelease({
      owner,
      repo,
      tag_name: tagname,
      name: tagname,
      body: releaseNotes,
      draft: false,
      prerelease: false,
      generate_release_notes: false,
    });
  } else {
    const allReleases = await octokit.rest.repos.listReleases({
      owner,
      repo,
    });
    const r = allReleases.data.filter((r) => r.tag_name === tagname).pop();
    release = await octokit.rest.repos.getRelease({
      owner,
      repo,
      release_id: r.id,
    });
  }

  /**
   * Upload the binaries
   */

  // logging
  logger.info(`Uploading binaries to release...`);

  const binariesUploadPromises = fs
    .readdirSync(binDir)
    .filter((file) => file.endsWith(".dmg"))
    .map(async (file) => {
      const binaryFile = fs.readFileSync(path.join(binDir, file));
      await octokit.rest.repos.uploadReleaseAsset({
        owner,
        repo,
        name: file,
        release_id: release.data.id,
        data: binaryFile,
      });
    });
  await Promise.allSettled(binariesUploadPromises);

  /**
   * Done
   */

  logger.info(`Version ${version} has been published!`);
  console.log("");
};

publish();
