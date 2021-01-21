import { exchangeNetFlowVolume, puellMultiple, marketToRealizedValue } from '../lib/glassnode.js'
import technicalindicators from 'technicalindicators'
import { trunc } from '../lib/math.js'

const { SMA } = technicalindicators

export const exchangeFlow = async ({ ack, client, payload, context }) => {

  try {
    await ack()

    const data = await exchangeNetFlowVolume()

    const values = data.map((row) => {return row.v})
    const twentyDaySMA = trunc(SMA.calculate({ period: 20, values: values.slice(values.length - 20, values.length) })[0])
    const fiftyDaySMA = trunc(SMA.calculate({ period: 50, values: values.slice(values.length - 50, values.length) })[0])
    const twohundredDaySMA = trunc(SMA.calculate({ period: 200, values: values.slice(values.length - 200, values.length)})[0])
    const today = trunc(values[values.length - 1])

    const puellData = await puellMultiple()

    const puellValues = puellData.map((row) => { return row.v })
    const puellTwentyDaySMA = trunc(SMA.calculate({period: 20, values: puellValues.slice(puellValues.length - 20, puellValues.length)})[0])
    const puellToday = trunc(puellValues[puellValues.length - 1])

    const mvrvData = await marketToRealizedValue()
    const mvrvValues = mvrvData.map((row) => {return row.v})
    const mvrvTwentyDay = trunc(SMA.calculate({period: 20, values: mvrvValues.slice(mvrvValues.length - 20, mvrvValues.length)})[0])
    const mvrvToday = trunc(mvrvValues[mvrvValues.length - 1])

    const result = await client.chat.postMessage({
      token: context.botToken,
      channel: payload.channel_id,
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: "Exchange Net Flow Volume"
          }
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `*Today*\n${today}`
            },{
              type: "mrkdwn",
              text: `*20 SMA*\n${twentyDaySMA}`
            },{
              type: "mrkdwn",
              text: `*50 SMA*\n${fiftyDaySMA}`
            },{
              type: "mrkdwn",
              text: `*200 SMA*\n${twohundredDaySMA}`
            },
          ]
        },
        {
          type: "header",
          text: {
            type: "plain_text",
            text: "Puell Multiple"
          }
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `*Today* (Sell > 4)\n${puellToday}`
            },{
              type: "mrkdwn",
              text: `*20 SMA*\n${puellTwentyDaySMA}`
            }
          ]
        },
        {
          type: "header",
          text: {
            type: "plain_text",
            text: "MVRV Z-Score"
          }
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `*Today* (Sell > 6)\n${mvrvToday}`
            },{
              type: "mrkdwn",
              text: `*20 SMA*\n${mvrvTwentyDay}`
            }
          ]
        }
      ]
    })
    console.log(result)
  } catch (e) {
    console.error(e)
  }
}