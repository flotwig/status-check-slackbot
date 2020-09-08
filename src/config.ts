export default {
  port: Number(process.env.PORT) || 3000,
  secret: process.env.SECRET,
  slackWebhookUrl: process.env.SLACK_WEBHOOK_URL,
  targetBranches: (process.env.TARGET_BRANCHES || 'master').split(','),
  states: (process.env.STATES || 'failure,error').split(',')
}
