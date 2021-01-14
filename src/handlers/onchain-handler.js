import { exchangeNetFlowVolume, puellMultiple } from '../lib/glassnode.js'
import technicalindicators from 'technicalindicators'

const { SMA } = technicalindicators

export const exchangeFlow = async ({ ack, client, payload, context }) => {

  try {
    await ack()

    const data = await exchangeNetFlowVolume()

    const values = data.map((row) => {return row.v})
    const twentyDaySMA = SMA.calculate({ period: 20, values: values.slice(values.length - 20, values.length) })[0]
    const fiftyDaySMA = SMA.calculate({ period: 50, values: values.slice(values.length - 50, values.length) })[0]
    const twohundredDaySMA = SMA.calculate({ period: 200, values: values.slice(values.length - 200, values.length)})[0]
    const today = values[values.length - 1]

    const puellData = await puellMultiple()

    const puellValues = puellData.map((row) => { return row.v })
    const puellTwentyDaySMA = SMA.calculate({period: 20, values: puellValues.slice(puellValues.length - 20, puellValues.length)})[0]
    const puellToday = puellValues[puellValues.length - 1]

    const result = await client.chat.postMessage({
      token: context.botToken,
      channel: payload.channel_id,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "*Exchange Net Flow Volume*"
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
          type: "section",
          text: {
            type: "mrkdwn",
            text: "*Puell Multiple*\nNote: > 4 sell signal."
          }
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `*Today*\n${puellToday}`
            },{
              type: "mrkdwn",
              text: `*20 SMA*\n${puellTwentyDaySMA}`
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