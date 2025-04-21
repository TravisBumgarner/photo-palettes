'use client'

import useGlobalStore from '../store'
import Browse from './browse/Browse'
import Welcome from './welcome/Welcome'

const Home = () => {
  const user = useGlobalStore(state => state.user)

  return user ? <Browse /> : <Welcome />
}

export default Home
