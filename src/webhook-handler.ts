import { EventPayloads, WebhookEvent } from '@octokit/webhooks'
import { formatMessage } from './message'
import { Config } from './config'

type ActiveCommits = { [commitSha: string]: ActiveCommit }

type ActiveCommit = {
  timeout: NodeJS.Timeout
  payloads: EventPayloads.WebhookPayloadStatus[]
}

export const WebhookHandler = ({ states, targetBranches, rollupMs }: Config, send: (message: any) => void) => {
  const activeCommits: ActiveCommits = {}

  const addPayload = (payload: EventPayloads.WebhookPayloadStatus) => {
    const existingActiveCommit = activeCommits[payload.sha]
    const timeout = setTimeout(Sender(payload.sha), rollupMs)

    if (existingActiveCommit) {
      clearTimeout(existingActiveCommit.timeout)
      existingActiveCommit.timeout = timeout
      existingActiveCommit.payloads.push(payload)
      return
    }

    activeCommits[payload.sha] = {
      timeout,
      payloads: [payload]
    }
  }

  const Sender = (sha: string) => () => {
    const { payloads } = activeCommits[sha]
    delete activeCommits[sha]

    const message = formatMessage(payloads)

    send(message)
  }

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

    addPayload(payload)
  }
}
