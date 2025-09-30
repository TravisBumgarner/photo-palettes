import config from '../config'

const healthCheck = async () => {
  const response = await fetch(`${config.apiUrl}/`, {
    method: 'GET',
  })

  return response.status === 200
}

export default healthCheck
