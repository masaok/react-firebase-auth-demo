import React from 'react'
import './App.css'

import Application from './Components/Application'
import UserProvider from './providers/UserProvider'

const App = () => {
  return (
    <UserProvider>
      <Application />
    </UserProvider>
  )
}

export default App
