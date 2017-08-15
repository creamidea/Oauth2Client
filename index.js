const url = require('url')
const request = require('request')

const { URL } = url

class Oauth2Client {
  /**
   * 初始化
   * @param {object} params
   * @prop {string} baseUrl
   * @prop {string} oauthPath
   * @prop {string} tokenPath
   * @prop {string} redirectURI
   * @prop {string} appId
   * @prop {string} appSecret
   */
  constructor (params) {
    // if (!opt.appId) throw new Error('APP_ID can\'t be undefined')
    // if (!opt.appSecret) throw new Error('APP_SECRET can\'t be undefined')
    // if (!opt.redirectURI) throw new Error('REDIRECT_URI can\'t be undefined')
    this.params = params
  }

  get oauthURI () {
    const { appId, scope, redirectURI, oauthPath, baseUrl } = this.params
    const url = new URL(oauthPath, baseUrl)
    const search = `?client_id=${appId}&redirect_uri=${redirectURI}&scope=${scope}&response_type=code`
    return `${url}${search}`
  }

  get tokenURI () {
    const { tokenPath, baseUrl } = this.params
    return (new URL(tokenPath, baseUrl)).toString()
  }

  // get the code from the server
  redirectToAuthorizedURI (ctx) {
    return ctx.redirect(this.oauthURI)
  }

  // get the token from the server
  requestToken (code) {
    const { appId, appSecret, redirectURI } = this.params
    return new Promise((resolve, reject) => {
      request.post({
        url: this.tokenURI,
        form: {
          client_id: appId,
          client_secret: appSecret,
          code: code,
          grant_type: 'authorization_code',
          redirect_uri: redirectURI
        }
      }, (err, res, body) => {
        if (err || res.statusCode > 299) {
          reject(err || res)
        } else {
          // statusCode: 200 or 201
          resolve(JSON.parse(body))
        }
      })
    })
  }
}

module.exports = Oauth2Client
