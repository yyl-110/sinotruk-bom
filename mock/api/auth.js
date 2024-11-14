import { resolveToken } from '../utils'

const token = {
  admin: 'admin',
  editor: 'editor',
}

export default [
  {
    url: '/api/auth/login',
    method: 'post',
    response: ({ body }) => {
      if (['admin', 'editor'].includes(body?.name)) {
        return {
          success: true,
          data: {
            token: token[body.name],
          },
        }
      } else {
        return {
          success: false,
          message: '没有此用户',
        }
      }
    },
  },
  {
    url: '/api/auth/refreshToken',
    method: 'post',
    response: ({ headers }) => {
      return {
        success: true,
        data: {
          token: resolveToken(headers?.authorization),
        },
      }
    },
  },
]
