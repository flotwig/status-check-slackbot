import http from 'http'
import https from 'https'
import { Webhooks, EventPayloads, WebhookEvent } from '@octokit/webhooks'
import config from './config'
import { formatMessage } from './message'

const webhooks = new Webhooks({
  secret: config.secret
})

webhooks.on('status', ({ payload }: WebhookEvent<EventPayloads.WebhookPayloadStatus>) => {
  if (!config.states.includes(payload.state)) {
    return
  }

  let branchMatches = false

  for (const targetBranch of config.targetBranches) {
    if (payload.branches.map(branch => branch.name).includes(targetBranch)) {
      branchMatches = true
      break
    }
  }

  if (!branchMatches) {
    return
  }

  const message = formatMessage(payload)

  const req = https.request(config.slackWebhookUrl!, {
    method: 'POST'
  })

  req.end(JSON.stringify(message))
})

http
.createServer(webhooks.middleware)
.listen(config.port)
