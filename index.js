require('dotenv').config()

/*
const bodyParser = require('body-parser');
const { Octokit } = require("@octokit/core");
const express = require('express');
const app = express();
const port = 6969;
const GithubWebHook = require('express-github-webhook');
const webhookHandler = GithubWebHook({ path: '/update', secret: '******' });
const { exec } = require('child_process');
const websitePath = "/home/****\/******";
const repo = "******";
const username = "******";
const password = "******";
const octokit = new Octokit({
  auth: password
})

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(webhookHandler);

webhookHandler.on('push', function(repo, data) {
  if (repo === "******") {
    exec('git pull -q -f -p ', {cwd: websitePath}, (err, stdout, stderr) => {
      console.log(data);
      if (err) console.log("Error:", err);
      console.log(stdout);
      if (stderr) console.log("Command Error:", stderr);
      await octokit.request('POST /repos/{owner}/{repo}/statuses/{sha}', {
        owner: username,
        repo: repo,
        sha: data.ref,
        state: err ? 'error' : 'success',
        target_url: '******',
        description: err ? 'The Build Failed' : 'The build succeeded!',
        context: 'continuous-integration/production'
      });
    });
  }
});

webhookHandler.on('error', function(err, req, res) {
  console.log(err);
});

app.listen(port, () => {
  console.log(`Listening for updates on port ${port}`)
})

*/

const express = require("express");
const { Octokit } = require("@octokit/core");
const githubWebhookMiddleware = require('github-webhook-middleware');
const { exec } = require('child_process');

const app = express();
const githubMiddleware = githubWebhookMiddleware({
  secret: process.env.GITHUB_SECRET | '',
  limit: process.env.GITHUB_SIZE_LIMIT | '512kb'
});
const PATH = process.env.GITHUB_WEBHOOK_PATH | '/hooks/github/';
const PORT = process.env.PORT | 6565;
const USERNAME = process.env.GITHUB_USERNAME | '';
const PASSWORD = process.env.GITHUB_PERSONAL_ACCESS_TOKEN | '';
const HOOKS = require("./hooks.json");
const OCTOKIT = new Octokit({ auth: PASSWORD });

app.post(PATH, githubMiddleware, function (req, res) {
  res.status(200).send();
  // GLOBAL PROPERTIES

  const PAYLOAD = req.body;
  const ACTION = PAYLOAD.action,
    SENDER = PAYLOAD.sender,
    REPO = PAYLOAD.repository,
    COMMIT_REF = PAYLOAD.ref;

  // Check for hooks

  for (let i = 0; i < HOOKS.length; i++) {
    const HOOK = HOOKS[i];
    if (!(HOOK.owner === '*' || HOOK.owner === REPO.owner.login)) continue;
    if (!(HOOK.repo === '*' || HOOK.repo === REPO.name)) continue;

    let action = HOOK.actions[ACTION];
    if (action) {
      const cmd = action.cmd, dir = action.dir;

      exec(cmd, { cwd: dir }, (err, stdout, stderr) => {

      });
    }
  }

  // On Completion return commit status using octokit
  await OCTOKIT.request('POST /repos/{owner}/{repo}/statuses/{sha}', {
    owner: REPO.owner.login,
    repo: REPO.name,
    sha: COMMIT_REF,
    state: err ? 'error' : 'success',
    target_url: '',
    description: err ? 'The Build Failed' : 'The build succeeded!',
    context: 'continuous-integration/production'
  });
});

app.listen(PORT, () => {
  console.log(`Listening for hooks at '${PATH}' on port ${PORT}`);
})
