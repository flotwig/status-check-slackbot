import { EventPayloads, WebhookEvent } from '@octokit/webhooks'
import { formatMessage } from './message'
import { Config } from './config'

export const WebhookHandler = ({ states, targetBranches }: Config, send: (message: any) => void) => {
  return ({ payload }: WebhookEvent<EventPayloads.WebhookPayloadStatus>) => {
    if (!states.includes(payload.state)) {
      return
    }

    let branchMatches = false

    for (const targetBranch of targetBranches) {
      if (payload.branches.map(branch => branch.name).includes(targetBranch)) {
        branchMatches = true
        break
      }
    }

    if (!branchMatches) {
      return
    }

    const message = formatMessage(payload)

    send(message)
  }
}
