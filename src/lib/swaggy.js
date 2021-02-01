import fetch from 'node-fetch'
import querystring from 'querystring'

const BASE_URL = 'https://api.swaggystocks.com/api'

export const sentiment = async (opts = {}) => {

  let params = {
    limit: opts.limit || 10
  }

  const url = BASE_URL + '/wsb/sentiment/top?' + querystring.stringify(params)
  const response = await fetch(url)

  return response.json()
}