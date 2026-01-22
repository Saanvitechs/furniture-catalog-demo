import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosInstance.interceptors.request.use(
  (config) => {
    try {
      // For demo/dummy data mode, no authentication needed
      return config
    } catch (e) {
      // ignore
    }

    return config
  },
  (error) => Promise.reject(error)
)

export default axiosInstance
