import axios from 'axios'

export const URL = process.env.VUE_APP_SERVER_HOST

export const apiClient = axios.create({
  baseURL: URL,
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'content-type': 'application/json',
  },
})
