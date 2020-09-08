const config = {
  port: Number(process.env.PORT) || 3000,
  secret: process.env.SECRET,
  slackWebhookUrl: process.env.SLACK_WEBHOOK_URL,
  targetBranches: (process.env.TARGET_BRANCHES || 'master').split(','),
  states: (process.env.STATES || 'failure,error').split(',')
}

if (!config.secret) {
  throw new Error('The SECRET environment variable is required.')
}

if (!config.slackWebhookUrl) {
  throw new Error('The SLACK_WEBHOOK_URL environment variable is required.')
}

export default config
