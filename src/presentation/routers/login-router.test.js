const LoginRouter = require('../routers/login-router')
const MissingParamError = require('../routers/helpers/missing-param-error')

// factore design pattern
const makeSut = () => {
  // Mock class to test login router
  class AuthUserCaseSpy {
    auth (email, password) {
      this.email = email
      this.password = password
    }
  }
  const authUseCaseSpy = new AuthUserCaseSpy()
  // dependency injection
  const sut = new LoginRouter(authUseCaseSpy)
  return {
    sut,
    authUseCaseSpy
  }
}
describe('Login Router', () => {
  test('should return 400 if no email is provided', () => {
    //  sut: system under test
    const { sut } = makeSut()
    const httpResquest = {
      body: {
        password: 'password'
      }
    }
    const httpResponse = sut.route(httpResquest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('should return 400 if no password is provided', () => {
    const { sut } = makeSut()
    const httpResquest = {
      body: {
        email: 'email'
      }
    }
    const httpResponse = sut.route(httpResquest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('should return 500 if no httpRequest is provided', () => {
    const { sut } = makeSut()
    const httpResponse = sut.route()

    expect(httpResponse.statusCode).toBe(500)
  })

  test('should return 500 if no httpRequest body has no body', () => {
    const { sut } = makeSut()
    const httpRequest = {}
    const httpResponse = sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
  })

  // test component integration
  test('should call AuthUserCase with correct params', () => {
    const { sut, authUseCaseSpy } = makeSut()
    const httpRequest = {
      body: {
        email: 'email',
        password: 'password'
      }
    }
    sut.route(httpRequest)

    expect(authUseCaseSpy.email).toBe(httpRequest.body.email)
    expect(authUseCaseSpy.password).toBe(httpRequest.body.password)
  })
})
