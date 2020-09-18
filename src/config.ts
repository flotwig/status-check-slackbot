export type Config = {
  port: number
  secret: string
  slackWebhookUrl: string
  targetBranches: string[]
  states: string[]
}

const ensureEnvVar = (name: string): string => {
  const v = process.env[name]

  if (!v) {
    throw new Error(`The ${name} environment variable is required.`)
  }

  return v
}

export const config: Config = {
  port: Number(process.env.PORT) || 3000,
  secret: ensureEnvVar('SECRET'),
  slackWebhookUrl: ensureEnvVar('SLACK_WEBHOOK_URL'),
  targetBranches: (process.env.TARGET_BRANCHES || 'master').split(','),
  states: (process.env.STATES || 'failure,error').split(',')
}
