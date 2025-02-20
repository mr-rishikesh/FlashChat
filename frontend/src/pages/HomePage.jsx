import React from 'react'
import { useAuthStore } from '../store/useAuthStore.js'

const HomePage = () => {
  const {logout} = useAuthStore();
  
  return (
    <div onClick={logout}>
      Home
    </div>
  )
}

export default HomePage
