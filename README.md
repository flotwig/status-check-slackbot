# status-check-slackbot

This is a Slackbot designed to share failing GitHub status checks with a Slack channel.

| ![Example of the Slack message.](https://i.imgur.com/iuiByxX.png) |
| --- |
| Example of a Slack message generated on a failure. |

## Configuration

Configuration takes place via environment variables:

* `SLACK_WEBHOOK_URL` (required) - Slack Incoming Webhook URL to use for this bot.
* `SECRET` (required) - GitHub webhook secret, created when you set up the GitHub `status` webhook.
* `TARGET_BRANCHES` (default: `master`) - Only failures from these branches will be reported to slack. Comma-separated.
* `STATES` (default: `failure,error`) - Comma-separated list of states to consider "failures".
* `PORT` (default: `3000`) - Port to listen for HTTP requests on.

Once the service is running, configure a GitHub webhook to send `status` payloads to it, using `application/json` encoding and the `SECRET` you configured earlier.
