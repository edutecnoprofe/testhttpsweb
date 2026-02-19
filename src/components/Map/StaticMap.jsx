import React, { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { mapDefinitions } from '../../data/maps';
import './StaticMap.css';

const StaticMap = ({ dayId, mapId, title, isEmbedded = false }) => {
    const [hasError, setHasError] = useState(false);

    let mapKey = mapId || (dayId ? `day-${dayId}` : null);
    const mapDef = mapDefinitions[mapKey];

    // Generate grid of 3x3 tiles
    const tiles = [];
    if (mapKey && !hasError) {
        for (let y = 0; y < 3; y++) {
            for (let x = 0; x < 3; x++) {
                tiles.push(`${import.meta.env.BASE_URL}assets/maps/${mapKey}_${y}_${x}.png`);
            }
        }
    }

    const getGoogleMapsUrl = () => {
        if (!mapDef) {
            return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(title + ' Roma')}`;
        }

        if (mapDef.type === 'route' && mapDef.points) {
            const start = mapDef.points[0];
            const end = mapDef.points[mapDef.points.length - 1];
            return `https://www.google.com/maps/dir/?api=1&origin=${start.lat},${start.lon}&destination=${end.lat},${end.lon}&travelmode=walking`;
        } else {
            return `https://www.google.com/maps/search/?api=1&query=${mapDef.lat},${mapDef.lon}`;
        }
    };

    return (
        <div className={`static-map-container ${isEmbedded ? 'embedded' : ''}`}>
            <h3 className="static-map-title">{isEmbedded ? `Trayecto: ${title}` : `Ruta: ${title}`}</h3>

            <a
                href={getGoogleMapsUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="static-map-link"
            >
                <div className="static-map-wrapper tile-grid-container">
                    {!hasError ? (
                        <div className="static-map-grid">
                            {tiles.map((tileSrc, index) => (
                                <img
                                    key={index}
                                    src={tileSrc}
                                    alt={`Trozo de mapa ${index}`}
                                    className="static-map-tile"
                                    loading="lazy"
                                    onError={() => setHasError(true)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="static-map-placeholder">
                            <div className="placeholder-content">
                                <span className="placeholder-icon">🗺️</span>
                                <span>{isEmbedded ? 'Mapa de Tramo' : 'Mapa General'}</span>
                                <small className="placeholder-sub">Ver en Google Maps</small>
                            </div>
                        </div>
                    )}

                    {/* Badge */}
                    <div className="map-badge">
                        Offline Ready
                    </div>

                    {/* Overlay interaction hint */}
                    <div className="map-interaction-overlay">
                        <ExternalLink size={24} />
                        <span>Abrir Ruta</span>
                    </div>
                </div>
            </a>

            {!isEmbedded && (
                <p className="static-map-note">
                    * Toca el mapa para ver la ruta detallada en Google Maps
                </p>
            )}
        </div>
    );
};

export default StaticMap;
