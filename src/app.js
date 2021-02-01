import bolt from '@slack/bolt'
import dotenv from 'dotenv'

import { exchangeFlow } from './handlers/onchain-handler.js'
import { swaggy } from './handlers/swaggy-handler.js'

dotenv.config()

const app = new bolt.App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_BOT_TOKEN,
})

app.command('/onchain', exchangeFlow)
app.command('/wsb', swaggy)

;(async () => {
  await app.start(process.env.PORT || 3000)

  console.log('⚡️ Bolt app is running!')
})()
