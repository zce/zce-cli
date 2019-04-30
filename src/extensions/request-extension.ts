import { http, GluegunToolbox } from 'gluegun'

const api = http.create({
  baseURL: 'https://api.github.com',
  params: {
    client_id: '0cb723972877555ffb54',
    client_secret: 'ad0638a75ee90bb86c8b551f5f42f3a044725f38'
  },
  timeout: 20000
})

module.exports = async (toolbox: GluegunToolbox) => {
  toolbox.request = (endpoint: string, params?: {}) => {
    return api.get(endpoint, params)
  }
}
