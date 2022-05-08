require('dotenv').config()

import express from "express";
import { Octokit } from "@octokit/core";
import githubWebhookMiddleware from 'github-webhook-middleware';
import { exec } from 'child_process';

const app = express();
const port = process.env.PORT | 6565;
const githubMiddleware = githubWebhookMiddleware({
    secret: process.env.GITHUB_SECRET | '',
    limit: process.env.GITHUB_SIZE_LIMIT | '512kb'
});

app.post('/hooks/github/', githubMiddleware, function(req, res) {
    // exec('git pull -q -f -p ', {cwd: websitePath}

    // On Completion return commit status using octokit

    await octokit.request('POST /repos/{owner}/{repo}/statuses/{sha}', {
        owner: username,
        repo: repo,
        sha: data.ref,
        state: err ? 'error' : 'success',
        target_url: '',
        description: err ? 'The Build Failed' : 'The build succeeded!',
        context: 'continuous-integration/production'
      });

});

app.listen(port, () => {

})
