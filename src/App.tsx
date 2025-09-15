import { useEffect } from 'react';

import { useStore } from '@store';
import { useShallow } from 'zustand/react/shallow';
import { Routes, Route } from 'react-router-dom';
import Navbar from '@components/Navbar';
import ToastContainer from '@components/ToastContainer';
import HomePage from '@pages/HomePage';
import WeatherPage from '@pages/WeatherPage';
import { useUserLocation } from '@hooks/useUserLocation';

function App() {
  const { loadCities, loadFavorites, loadNotes, cleanExpiredToasts } = useStore(
    useShallow((s) => ({
      loadCities: s.loadCities,
      loadFavorites: s.loadFavorites,
      loadNotes: s.loadNotes,
      cleanExpiredToasts: s.cleanExpiredToasts,
    }))
  );

  useEffect(() => {
    loadCities();
    loadFavorites();
    loadNotes();
    cleanExpiredToasts();
  }, [cleanExpiredToasts, loadCities, loadFavorites, loadNotes]);

  useUserLocation();

  return (
    <div className="3xl:w-[50%] h-full 3xl:mx-auto bg-light font-rubik">
      <div className="flex min-h-screen p-5 relative">
        <Navbar />
        <ToastContainer />

        <div className="flex-1 md:ml-5 pb-30 md:pb-0">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/weather" element={<WeatherPage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
