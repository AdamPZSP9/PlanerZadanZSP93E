import { useState } from 'react'
import Router from './navigation/router.jsx'
import TopBar from './navigation/TopBar/topbar.jsx'

function App() {
  return (
    <>
      <TopBar/>
      <Router/>
    </>
  )
}

export default App
