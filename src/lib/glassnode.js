import fetch from 'node-fetch'
import querystring from 'querystring'

const BASE_URL = 'https://api.glassnode.com/v1/metrics'

export const exchangeNetFlowVolume = async (opts = {}) => {
  const interval = opts.interval || '24h'

  let params = {
    a: 'BTC',
    i: interval,
    api_key: process.env.GLASSNODE_API_KEY,
  }
  const url = BASE_URL + '/transactions/transfers_volume_exchanges_net?' + querystring.stringify(params)
  const response = await fetch(url)

  return response.json()
}

export const puellMultiple = async (opts = {}) => {
  let params = {
    a: 'BTC',
    api_key: process.env.GLASSNODE_API_KEY
  }

  const url = BASE_URL + '/indicators/puell_multiple?' + querystring.stringify(params)
  const response = await fetch(url)

  return response.json()
}