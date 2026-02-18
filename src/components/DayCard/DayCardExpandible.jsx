import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, MapPin, Clock, AlertCircle, X } from 'lucide-react';
import { parseDayContent, getDayDocumentName } from '../../utils/dayContentParser';
import AudioPlayer from '../AudioPlayer/AudioPlayer';
import './DayCardExpandible.css';

const audioGuidesMap = [
    { keywords: ['panteón', 'panteon'], audioId: 'panteon' },
    { keywords: ['trevi'], audioId: 'fontana-trevi' },
    { keywords: ['coliseo'], audioId: 'coliseo' },
    { keywords: ['bocca della verità', 'boca de la verdad', 'boca de la verita'], audioId: 'boca-verdad' },
    { keywords: ['il gesù', 'iglesia del gesú', 'iglesia del gesu'], audioId: 'iglesia-gesu' },
    { keywords: ['san ignacio'], audioId: 'san-ignacio' },
    { keywords: ['moises', 'moisés'], audioId: 'moises' },
    { keywords: ['ojo de la cerradura', 'cerradura'], audioId: 'ojo-cerradura' },
    { keywords: ['gianicolo'], audioId: 'gianicolo' },
    { keywords: ['coppedè', 'coppede'], audioId: 'barrio-coppede' },
    { keywords: ['teatro de marcelo'], audioId: 'teatro-marcelo' },
    { keywords: ['isla tiberina'], audioId: 'isla-tiberina' }
];

const getAudioGuideId = (text) => {
    if (!text) return null;
    const lowerText = text.toLowerCase();
    const guide = audioGuidesMap.find(g =>
        g.keywords.some(k => lowerText.includes(k))
    );
    return guide ? guide.audioId : null;
};

const DayCardExpandible = ({ day }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [dayContent, setDayContent] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const toggleExpand = async () => {
        if (!isExpanded && !dayContent) {
            await loadDayDocument();
        }
        setIsExpanded(!isExpanded);
    };

    const loadDayDocument = async () => {
        setLoading(true);
        setError(null);

        try {
            const fileName = getDayDocumentName(day.id);
            if (!fileName) {
                throw new Error(`No se encontró documento para el día: ${day.id}`);
            }

            // Intentar cargar el archivo markdown desde la carpeta docs
            const response = await fetch(`/docs/${fileName}.md`);
            if (!response.ok) {
                throw new Error(`No se pudo cargar el documento: ${fileName}.md`);
            }

            const markdownText = await response.text();
            const parsedContent = parseDayContent(markdownText);
            setDayContent(parsedContent);
        } catch (err) {
            console.error('Error cargando documento:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const renderContentSection = (section, index) => {
        if (!section.content.trim()) return null;

        const audioId = getAudioGuideId(section.title);

        return (
            <div key={index} className="content-section">
                <h3 className="section-title">
                    {section.level === 2 ? '📋' : '📌'} {section.title}
                </h3>
                {audioId && <AudioPlayer audioId={audioId} />}
                <div className="section-content">
                    {section.content.split('\n\n').map((paragraph, idx) => (
                        <p key={idx} className="section-paragraph">
                            {paragraph}
                        </p>
                    ))}
                </div>
            </div>
        );
    };


    return (
        <div className={`day-card-expandible ${isExpanded ? 'expanded' : ''}`}>
            <div
                className="day-card-header"
                onClick={toggleExpand}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && toggleExpand()}
            >
                <div className="day-card-content">
                    <span className="day-card-date">{day.date}</span>
                    <h2 className="day-card-title">{day.title}</h2>
                    <p className="day-card-summary">{day.summary}</p>
                </div>
                <div className="day-card-arrow">
                    {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                </div>
            </div>

            {isExpanded && (
                <div className="day-card-expanded-content">
                    {loading ? (
                        <div className="loading-indicator">
                            <div className="spinner"></div>
                            <p>Cargando información detallada...</p>
                        </div>
                    ) : error ? (
                        <div className="error-message">
                            <AlertCircle size={20} />
                            <p>Error al cargar la información: {error}</p>
                            <button
                                className="retry-button"
                                onClick={loadDayDocument}
                            >
                                Reintentar
                            </button>
                        </div>
                    ) : dayContent ? (
                        <div className="expanded-details">
                            {dayContent.mainTitle && (
                                <div className="day-main-title">
                                    <h3>{dayContent.mainTitle}</h3>
                                    {dayContent.subtitle && (
                                        <p className="day-subtitle">{dayContent.subtitle}</p>
                                    )}
                                </div>
                            )}

                            {dayContent.improvedSummary && (
                                <div className="improved-summary">
                                    <strong>Resumen mejorado:</strong> {dayContent.improvedSummary}
                                </div>
                            )}

                            {dayContent.sections && dayContent.sections.length > 0 ? (
                                <div className="content-sections">
                                    {dayContent.sections.map((section, index) => renderContentSection(section, index))}
                                </div>
                            ) : (
                                <div className="no-content">
                                    <p>No hay información adicional disponible para este día.</p>
                                </div>
                            )}

                            {day.activities && day.activities.length > 0 && (
                                <div className="day-activities">
                                    <h3 className="activities-title">📅 Actividades programadas:</h3>
                                    <div className="activities-list">
                                        {day.activities.map((activity, idx) => (
                                            <div key={idx} className="activity-item">
                                                <div className="activity-header">
                                                    <span className="activity-time">
                                                        <Clock size={12} />
                                                        {activity.time}
                                                    </span>
                                                    {activity.type === 'visit' && <span className="activity-badge">Visita</span>}
                                                    {activity.type === 'food' && <span className="activity-badge food">Comida</span>}
                                                    {activity.type === 'transport' && <span className="activity-badge transport">Transporte</span>}
                                                    {activity.type === 'walk' && <span className="activity-badge walk">Paseo</span>}
                                                    {activity.type === 'relax' && <span className="activity-badge relax">Descanso</span>}
                                                </div>
                                                <h4 className="activity-location">{activity.location}</h4>
                                                {getAudioGuideId(activity.location) && (
                                                    <AudioPlayer audioId={getAudioGuideId(activity.location)} />
                                                )}
                                                <p className="activity-description">{activity.description}</p>
                                                {activity.tips && (
                                                    <div className="activity-tips">
                                                        <AlertCircle size={12} />
                                                        <span>{activity.tips}</span>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="no-content">
                            <p>No se pudo cargar la información adicional.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default DayCardExpandible;