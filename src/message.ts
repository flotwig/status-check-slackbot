import { EventPayloads } from '@octokit/webhooks'

export function formatMessage(payloads: EventPayloads.WebhookPayloadStatus[]) {
  const { commit, repository, branches } = payloads[0]

  const failuresMd = payloads.map(({ target_url, context, description, state }) => {
    const contextLink = target_url ? `<${target_url}|${context}>` : context
    const descriptionText = description ? ` (${description})` : ''
    return `• ${contextLink}${descriptionText} (${state})`
  }).join('\n')

  return {
    "blocks": [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": `:x: Status checks have failed in \`${branches.map(branch => branch.name).join(', ')}\`!\n*Commit*: <https://github.com/${repository.full_name}/commit/${commit.sha}|\`${commit.sha}\`...>\n*Commit message*: ${commit.commit.message}\nFailing jobs:\n${failuresMd}`
        }
      },
      {
        "type": "context",
        "elements": [
          {
            "type": "image",
            "image_url": commit.author.avatar_url,
            "alt_text": "Author Avatar"
          },
          {
            "type": "mrkdwn",
            "text": `*Commit Author*: \`${commit.author.login}\``
          },
        ]
      }
    ]
  }
}
