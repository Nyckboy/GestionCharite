import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import Login from './pages/auth/Login';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public / Auth Routes */}
        <Route path="/login" element={<Login />} />
        
        {/* We will add Register here next */}
        {/* <Route path="/register" element={<Register />} /> */}

        {/* Default redirect to login for now */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;