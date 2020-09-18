import nock from 'nock'
import { App } from './app'
import { Config } from './config'
import { WebhookHandler } from './webhook-handler'
import { WebhookEvent, EventPayloads } from '@octokit/webhooks'

describe('WebhookHandler', function () {
  let config: Config

  beforeEach(function () {
    nock.disableNetConnect()

    config = {
      port: -1,
      secret: 'foo',
      slackWebhookUrl: 'https://slack-webhook-url',
      targetBranches: ['master'],
      states: ['failure', 'error']
    }
  })

  it('posts messages on failures', function (done) {
    const handler = WebhookHandler(config, (message) => {
      expect(message).toMatchSnapshot()
      done()
    })

    const arg = {
      payload: {
        commit: {
          sha: '1234567890abcdef1234567890',
          commit: {
            message: 'commit message',
          },
          author: {
            avatar_url: 'https://author-avatar-url',
            login: 'author-login'
          }
        },
        avatar_url: 'https://avatar-url',
        target_url: 'https://url-to-job',
        context: 'job context',
        description: 'job description',
        state: 'failure',
        branches: [
          { name: 'master' }
        ],
        repository: {
          full_name: 'owner/repo'
        },
      }
    } as unknown as WebhookEvent<EventPayloads.WebhookPayloadStatus>

    handler(arg)
  })
})
