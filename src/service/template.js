import { apiClient } from '@/service/index'

export default {
  autocomplete(data) {
    return apiClient.get('/elasticsearch/address-autocomplete', {
      params: {
        q: data,
      },
    })
  },
}
