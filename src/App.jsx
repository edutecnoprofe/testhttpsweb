import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import DayDetail from './pages/DayDetail';

function App() {
    return (
        <Router>
            <div id="error-log" style={{ display: 'none', position: 'fixed', top: 0, zIndex: 9999, background: 'red', color: 'white', padding: '10px' }}></div>
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/day/:dayId" element={<DayDetail />} />
                    <Route path="*" element={<Home />} />
                </Routes>
            </Layout>
        </Router>
    );
}

// Global error catcher for mobile debugging
window.onerror = function (msg, url, line) {
    const log = document.getElementById('error-log');
    if (log) {
        log.style.display = 'block';
        log.innerHTML = `Err: ${msg} <br/> Line: ${line}`;
    }
    return false;
};

export default App;
