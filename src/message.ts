import { EventPayloads } from '@octokit/webhooks'

export function formatMessage(payload: EventPayloads.WebhookPayloadStatus) {
  const { commit, target_url, description, state, repository, branches, context } = payload

  // @ts-ignore
  const avatar_url = payload.avatar_url

  return {
    "blocks": [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": `:x: A status check has failed in \`${branches.map(branch => branch.name).join(', ')}\`!\n\n*Commit message*: ${commit.commit.message}`
        }
      },
      {
        "type": "section",
        "fields": [
          {
            "type": "mrkdwn",
            "text": `*Job*: ${target_url ? `<${target_url}|${context}>` : context}`
          },
          ...(description ? [{
            "type": "mrkdwn",
            "text": `*Message*: ${target_url ? `<${target_url}|${description}>` : description}`
          }] : []),
          {
            "type": "mrkdwn",
            "text": `*State*: \`${state}\``
          },
          {
            "type": "mrkdwn",
            "text": `*Commit*: <https://github.com/${repository.full_name}/commit/${commit.sha}|\`${commit.sha.slice(0, 16)}\`...> `
          },
        ]
      },
      {
        "type": "context",
        "elements": [
          ...(avatar_url ? [{
            "type": "image",
            "image_url": avatar_url,
            "alt_text": "Status Check Avatar"
          }] : []),
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
