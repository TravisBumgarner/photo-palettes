'use client'

import useGlobalStore from '../../store'
import { EPermissionLevel } from '../../types'

const Profile = () => {
  const appUserDetails = useGlobalStore(state => state.appUserDetails)
  const authId = useGlobalStore(state => state.authId)

  if (!appUserDetails || !authId) {
    return <div>Not logged in</div>
  }

  return (
    <div>
      <h1>Profile</h1>
      <p>Display Name: {appUserDetails.displayName}</p>
      <p>Email: {appUserDetails.email}</p>
      <p>User ID: {appUserDetails.id}</p>
      <p>Permission Level: {EPermissionLevel[appUserDetails.permissionLevel]}</p>
      <p>Auth ID: {authId}</p>
    </div>
  )
}

export default Profile
