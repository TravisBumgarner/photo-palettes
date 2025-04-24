'use client'

import useGlobalStore from '../store'
import Browse from './browse/Browse'
import Welcome from './welcome/Welcome'

const Home = () => {
  const authDetails = useGlobalStore(state => state.authDetails)

  return authDetails ? <Browse /> : <Welcome />
}

export default Home
