
module.exports = function ExpressRouterAdapter (router) {
  return async (req, res) => {
    const httpRequest = {
      body: req.body
    }
    const httpResponse = await router(httpRequest)
    res.status(httpResponse.statusCode).json(httpResponse.body)
  }
}