import { sentiment } from '../lib/swaggy.js'

export const swaggy = async ({ ack, client, payload, context }) => {
  try {
    await ack()

    const tickerCounts = await sentiment()

    const tickerMarkdown = '## Top 10\n' + tickerCounts.map((tickerCount, index) => {
      return `${index + 1}. ${tickerCount.ticker} ${tickerCount.count_ticker}`
    }).join('\n')

    const result = await client.chat.postMessage({
      token: context.botToken,
      channel: payload.channel_id,
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: "Swaggy Sentiment"
          },
        }, {
          type: "section",
          text: {
            type: "mrkdwn",
            text: tickerMarkdown
          }
        }
      ]
    })
  } catch (e) {
    console.log(e)
  }
}