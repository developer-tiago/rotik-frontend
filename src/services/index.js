import axios from 'axios'

const instance = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
      'Content-type': 'application/json'
    },
    withCredentials: true,
    withXSRFToken: true,
  });

export default instance;