'use client'

import useGlobalStore from '../store'
import Browse from './browse/Browse'
import Welcome from './welcome/Welcome'

const Home = () => {
  const authId = useGlobalStore(state => state.authId)

  return authId ? <Browse /> : <Welcome />
}

export default Home
