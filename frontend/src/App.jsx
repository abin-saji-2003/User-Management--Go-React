import React from 'react'
import {BrowserRouter , Routes , Route} from "react-router-dom"
import Home from './pages/Home'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import AdminPanel from './pages/AdminPanel'
import AdminLogin from './pages/AdminLogin'
import './index.css';
import Profile from './pages/UserProfile'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<SignUp/>}/>
        <Route path='/admin_panel' element={<AdminPanel/>}/>
        <Route path='/admin_login' element={<AdminLogin/>}/>
        <Route path='/profile' element={<Profile/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
