# Oauth2Client
A simple oauth2 client

# Usage
```javascript
const Oauth2Client = require('Oauth2Client')

const oauth2Client = new Oauth2Client({
  baseUrl,
  oauthPath,
  tokenPath,
  redirectURI,
  appId,
  appSecret
})

// and then you can use it like the code below
app.use(async (ctx, next) => {
  ...
  // here assume that is the code
  if (ctx.query.code) {
    const body = oauth2Client.requestToken(code)
    ctx.session.accessToken = body.access_token
    // if calling requestToken is failed,
    // it will throw the ERROR. You can catch it.
  }
  ...

  if (!ctx.session.accessToken) {
    oauth2Client.redirectToAuthorizedURI(ctx)
    ...
  }
  ...
})
```
