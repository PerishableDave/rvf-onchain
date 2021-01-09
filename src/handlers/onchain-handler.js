import { exchangeNetFlowVolume } from '../lib/glassnode.js'
import technicalindicators from 'technicalindicators'

const { SMA } = technicalindicators

export const exchangeFlow = async (payload) => {
  const { shortcut, ack, respond } = payload

  try {
    await ack()

    const data = await exchangeNetFlowVolume()

    const values = data.map((row) => {return point.v})
    const twentyDaySMA = values.slice(values.length - 21, values.length - 1)
    const fiftyDaySMA = values.slice(values.length - 51, values.length - 1)
    const twohundredDaySMA = values.slice(values.length - 201, values.length - 1)
    const today = values[values.length - 1]

    respond({
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
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
        }
      ]
    })
  } catch (e) {
    console.error(e)
  }
}