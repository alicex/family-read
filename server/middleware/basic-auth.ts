export default defineEventHandler((event) => {
  const path = getRequestURL(event).pathname

  // 登録画面と登録APIを保護
  const protectedPaths = ['/', '/api/create']

  if (!protectedPaths.includes(path)) {
    return
  }

  const config = useRuntimeConfig()

  if (!config.basicAuthUser || !config.basicAuthPassword) {
    return
  }

  const authorization = getHeader(event, 'authorization')

  if (!authorization?.startsWith('Basic ')) {
    setHeader(event, 'WWW-Authenticate', 'Basic realm="Family Reader"')

    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  const encoded = authorization.replace('Basic ', '')
  const decoded = Buffer.from(encoded, 'base64').toString('utf-8')

  const [user, password] = decoded.split(':')

  if (
    user !== config.basicAuthUser ||
    password !== config.basicAuthPassword
  ) {
    setHeader(event, 'WWW-Authenticate', 'Basic realm="Family Reader"')

    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }
})