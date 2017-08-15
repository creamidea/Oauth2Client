const { URL } = require('url')
const Oauth2Client = require('../index')
jest.mock('request')

const config = {
  baseUrl: 'http://github.com',
  oauthPath: '/oauth/authorize',
  tokenPath: '/oauth/token',
  apiPath: '/api/v3',
  scope: 'api',
  appId: 'ce5f50ebf689b22436ae694aaf',
  appSecret: 'f08b1096054aa30a9a1ac4878c230',
  redirectURI: 'http://localhost:8080/oauth/authorized'
}
const oauth2Client = new Oauth2Client(config)
const code = 'asdf09qwkk234hjk123'

describe('test url', () => {
  it('oauthURI', () => {
    const oUrl = new URL(oauth2Client.oauthURI)

    expect(oUrl.pathname).toBe(config.oauthPath)
    expect(oUrl.searchParams.get('client_id')).toBe(config.appId)
    expect(oUrl.searchParams.get('redirect_uri')).toBe(config.redirectURI)
    expect(oUrl.searchParams.get('scope')).toBe(config.scope)
    expect(oUrl.searchParams.get('response_type')).toBe('code')
  })

  it('tokenURI', () => {
    const oUrl = new URL(oauth2Client.tokenURI)

    expect(oUrl.pathname).toBe(config.tokenPath)
  })
})

describe('test redirect', () => {
  const redirect = jest.fn()
  oauth2Client.redirectToAuthorizedURI({ redirect })
  expect(redirect).toBeCalled()
})

describe('test request token', () => {
  it('should return an object if success', async () => {
    const data = await oauth2Client.requestToken(code)
    expect(data).toBeInstanceOf(Object)
  })
  it('should throw error if error is not null', async () => {
    try {
      await oauth2Client.requestToken(code)
    } catch (err) {
      expect(err).toBeInstanceOf(Error)
    }
  })
  it('should throw error if statusCode > 299', async () => {
    try {
      await oauth2Client.requestToken(code)
    } catch (err) {
      expect(err.statusCode).toBe(500)
    }
  })
})
