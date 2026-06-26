import axios from 'axios'

const apiBaseURL = process.env.REACT_APP_API_URL

if (apiBaseURL) {
  axios.defaults.baseURL = apiBaseURL.replace(/\/$/, '')
}
