
import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Lobby from './pages/Lobby/Lobby';
import Layout from './components/Layout/Layout';
import TonkRoom from './pages/TonkRoom/TonkRoom';
import TestRoomPage from './pages/TestRoomPage/TestRoomPage';
import { ColyseusProvider } from './components/ColyseusProvider';

const App: React.FC = () => {
  return (
    <Router>
      <ColyseusProvider>
        <Layout >
          <Routes>
            <Route path='/' element={<Lobby />} />
            <Route path='/Tonk' element={<TonkRoom />}/>
            <Route path='/test-room' element={<TestRoomPage />} />
          </Routes>
        </Layout>
      </ColyseusProvider>
    </Router>
  );
};

export default App;
