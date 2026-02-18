import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import DayDetail from './pages/DayDetail';
import GlobalStyles from './styles/global.css?inline'; // Not strictly needed if imported in main.jsx but good for context

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/day/:dayId" element={<DayDetail />} />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;
