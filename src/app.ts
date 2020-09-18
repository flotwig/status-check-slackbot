import { Config } from "./config"
import { Webhooks } from '@octokit/webhooks'
import { WebhookHandler } from "./webhook-handler"
import https from 'https'

export const App = (config: Config) => {
  const webhooks = new Webhooks({
    secret: config.secret
  })

  const webhookHandler = WebhookHandler(config, (message) => {
    const req = https.request(config.slackWebhookUrl, {
      method: 'POST'
    })

    req.end(JSON.stringify(message))
  })

  webhooks.on('status', webhookHandler)

  return webhooks.middleware
}
