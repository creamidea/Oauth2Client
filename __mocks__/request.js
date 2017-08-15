const request = jest.genMockFromModule('request')

request.post = jest.fn()
  .mockImplementationOnce((opt, cb) => {
    cb(null, {
      statusCode: 200
    }, '{"access_token": 100}')
  })
  .mockImplementationOnce((opt, cb) => {
    cb(new Error('error'))
  })
  .mockImplementationOnce((opt, cb) => {
    cb(null, {
      statusCode: 500
    }, '{"message": "Error"}')
  })

module.exports = request
