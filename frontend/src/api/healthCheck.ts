import config from '../config'

const healthCheck = async () => {
  try {
    const response = await fetch(`${config.apiUrl}/`, {
      method: 'GET',
    })

    return response.status === 200
  } catch {
    return false
  }
}

export default healthCheck
