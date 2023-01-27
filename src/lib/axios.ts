import axios from 'axios'
import { parseCookies } from 'nookies'

const { 'token-teste': token } = parseCookies()

export const api = axios.create({
  baseURL: "http://localhost:3000"
})

if (token) {
  api.defaults.headers['Authorization'] = `Bearer ${token}`
}