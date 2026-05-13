import { BrowserRouter } from 'react-router-dom'
import Router from './navigation/router.jsx'
import TopBar from './navigation/TopBar/topbar.jsx'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <TopBar/>
      <Router/>
    </BrowserRouter>
  )
}

export default App
