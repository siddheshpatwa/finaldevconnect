import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Login from './Login.jsx'
// import Login from './Login'
import Register from './Register.jsx'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProfilePage from './ProfilePage.jsx'
import CreateProfile from './CreateProfile'
import EditProfile from './EditProfile'
import CreatePost from './CreatePost'
import EditPost from './EditPost'
import ViewPost from './ViewPost'
import AdminPage from './components /pages/Admin/AdminPage'
import PublicProfilePage from './PublicProfilePage'
import Dashboard from './components /pages/dashboard/Dashboard'
import { ThemeProvider } from './Context/ThemeContext'
import AdminLogin from './components /pages/Admin/AdminLogin'
import EditPostAdmin from './EditPostAdmin'


createRoot(document.getElementById('root')).render(
  <StrictMode>
            <ThemeProvider>
        <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<ProfilePage />} />
         <Route path="/login" element={<Login />} />
        <Route path="/create-profile" element={<CreateProfile />} />
         <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/create-post" element={<CreatePost/>} />
        <Route path="/edit-post/:id" element={<EditPost />} />
        <Route path="/view-post/:id" element={<ViewPost />} />
        <Route path="/public-profile/:userId" element={<PublicProfilePage />} />
        <Route path="/" element={<Dashboard/>} />
        <Route path="/Admin" element={<AdminPage/>} />
        <Route path="/AdminLogin" element={<AdminLogin />} />
        <Route path="/edit-post-admin/:postId" element={<EditPostAdmin/>} />
      </Routes>
    </Router>
</ThemeProvider>

  </StrictMode>,
)
