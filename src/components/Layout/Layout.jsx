import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Map } from 'lucide-react';
import './Layout.css';

const Layout = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const isHome = location.pathname === '/';

    return (
        <div className="layout">
            <header className="header">
                {!isHome && (
                    <button className="back-button" onClick={() => navigate(-1)} aria-label="Volver">
                        <ArrowLeft size={24} />
                    </button>
                )}
                <h1 className="header-title">
                    {isHome ? 'Roma 2026' : 'Itinerario'}
                </h1>
                {/* Placeholder for map toggle or settings if needed */}
                <div className="header-action">

                </div>
            </header>
            <main className="main-content">
                {children}
            </main>
        </div>
    );
};

export default Layout;
