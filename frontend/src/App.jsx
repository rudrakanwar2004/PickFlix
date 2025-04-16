import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './css/App.css';
import Favourites from './pages/Favourites';
import HomePage from './pages/HomePage';
import NavBar from './components/NavBar';
import Welcome from './components/welcome';
import { MovieProvider } from './contexts/MovieContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import { Navigate } from 'react-router-dom';
import AccountInfo from "./components/AccountInfo";


function Logout() {
  localStorage.clear()
  return <Navigate to="/login" />
}

function RegisterAndLogout() {
  localStorage.clear()
  return <Register />
}

function App() {
  return (
    <MovieProvider>
      <Routes>
        <Route path="/" element={<Welcome />} />
        
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <>
                <NavBar />
                <HomePage />
              </>
            </ProtectedRoute>
          }
        />

        <Route
          path="/favourites"
          element={
            <ProtectedRoute>
              <>
                <NavBar />
                <Favourites />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <>
                <NavBar />
                <AccountInfo />
              </>
            </ProtectedRoute>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<RegisterAndLogout />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </MovieProvider>
  );
}

export default App;
