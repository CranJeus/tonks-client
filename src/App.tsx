
import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route }
  from 'react-router-dom';
import Lobby from './pages/Lobby/Lobby';
import TonkRoom from './pages/TonkRoom/TonkRoom';
import Layout from './components/Layout/Layout';

const App: React.FC = () => {
  return (
    <Router>
      <Layout >
        <Routes>
          <Route path='/' element={<Lobby />} />
          <Route path='/Tonk' element={<TonkRoom />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
