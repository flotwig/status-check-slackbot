import { Config } from './config'
import { WebhookHandler } from './webhook-handler'
import { WebhookEvent, EventPayloads } from '@octokit/webhooks'

jest.useFakeTimers('modern')

describe('WebhookHandler', function () {
  let config: Config

  beforeEach(function () {
    config = {
      port: -1,
      secret: 'foo',
      slackWebhookUrl: 'https://slack-webhook-url',
      targetBranches: ['master'],
      states: ['failure', 'error'],
      rollupMs: 60000
    }
  })

  it('posts messages on failures', function (done) {
    let calls = 0
    const handler = WebhookHandler(config, (message) => {
      calls++
      expect(message).toMatchSnapshot()
      expect(calls).toEqual(1)
      done()
    })

    const getArg = (context: string) => {
      return {
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
          context,
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
    }

    handler(getArg('first failure'))

    jest.advanceTimersByTime(30000)

    handler(getArg('second failure'))

    jest.advanceTimersByTime(35000)

    handler(getArg('final failure'))

    jest.advanceTimersByTime(61000)
  })
})
