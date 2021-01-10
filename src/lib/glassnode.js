import fetch from 'node-fetch'
import querystring from 'querystring'

const API_KEY = process.env.GLASSNODE_API_KEY
const BASE_URL = 'https://api.glassnode.com/v1/metrics'

export const exchangeNetFlowVolume = async (opts = {}) => {

  const interval = opts.interval || '24h'

  let params = {
    a: 'BTC',
    i: interval,
    api_key: API_KEY,
  }

  const url = BASE_URL + '/transactions/transfers_volume_exchanges_net' + querystring.stringify(params)
  const response = await fetch(url)

  return response.json
}