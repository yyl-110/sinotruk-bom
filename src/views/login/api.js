import { post } from '@/utils/request'

export default {
  login: (data) => post('/auth/login', data, { noNeedToken: true }),
}
