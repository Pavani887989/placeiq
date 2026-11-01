import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing.jsx'
import Login from './pages/Login.jsx'
import Layout from './components/Layout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Applications from './pages/Applications.jsx'
import Soon from './pages/Soon.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/resume" element={<Soon title="Resume Analyzer" />} />
        <Route path="/match" element={<Soon title="Job Match" />} />
        <Route path="/interviews" element={<Soon title="Interviews" />} />
        <Route path="/insights" element={<Soon title="Insights" />} />
      </Route>
    </Routes>
  )
}