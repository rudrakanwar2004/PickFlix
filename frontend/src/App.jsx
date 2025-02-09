import './css/App.css';
import Favourites from './pages/Favourites';
import HomePage from './pages/HomePage';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import { MovieProvider } from './contexts/MovieContext';
import Welcome from './components/welcome';  // Import Welcome component

function App() {
  return (
    <div>
      <MovieProvider>
        {/* Render NavBar conditionally */}
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/home" element={<><NavBar /><HomePage /></>} />
          <Route path="/favourites" element={<><NavBar /><Favourites /></>} />
        </Routes>
      </MovieProvider>
    </div>
  );
}

export default App;
