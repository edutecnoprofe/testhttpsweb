import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { MapPin, Clock, AlertCircle, ChevronDown, ChevronRight, ExternalLink, Volume2 } from 'lucide-react';
import itinerary from '../data/itinerary.json';
import AudioPlayer from '../components/AudioPlayer/AudioPlayer';
import ImagePlaceholder from '../components/Placeholder/ImagePlaceholder';
import StaticMap from '../components/Map/StaticMap';
import { parseDayContent, getDayDocumentName } from '../utils/dayContentParser';
import './DayDetail.css';

/* ─── Audio guide mapping ─────────────────────────────────────────── */
const audioGuidesMap = [
    { keywords: ['panteón', 'panteon', 'agripa'], audioId: 'panteon' },
    { keywords: ['trevi'], audioId: 'fontana-trevi' },
    { keywords: ['coliseo', 'colosseo'], audioId: 'coliseo' },
    { keywords: ['bocca della verità', 'boca de la verdad', 'bocca'], audioId: 'boca-verdad' },
    { keywords: ['il gesù', 'iglesia del gesú', 'gesù', 'gesu'], audioId: 'iglesia-gesu' },
    { keywords: ['san ignacio'], audioId: 'san-ignacio' },
    { keywords: ['moises', 'moisés', 'vincoli'], audioId: 'moises' },
    { keywords: ['ojo de la cerradura', 'cerradura', 'aventino'], audioId: 'ojo-cerradura' },
    { keywords: ['gianicolo'], audioId: 'gianicolo' },
    { keywords: ['coppedè', 'coppede'], audioId: 'barrio-coppede' },
    { keywords: ['teatro de marcelo', 'teatro marcelo'], audioId: 'teatro-marcelo' },
    { keywords: ['isla tiberina', 'tiberina'], audioId: 'isla-tiberina' },
];

const getAudioId = (text) => {
    if (!text) return null;
    const lower = text.toLowerCase();
    const match = audioGuidesMap.find(g => g.keywords.some(k => lower.includes(k)));
    return match ? match.audioId : null;
};

/* ─── Activity type helpers ───────────────────────────────────────── */
const TYPE_META = {
    visit: { emoji: '🏛️', label: 'Visita', color: 'type-visit' },
    food: { emoji: '🍽️', label: 'Comida', color: 'type-food' },
    transport: { emoji: '🚇', label: 'Transporte', color: 'type-transport' },
    walk: { emoji: '👣', label: 'Paseo', color: 'type-walk' },
    relax: { emoji: '🌳', label: 'Descanso', color: 'type-relax' },
};

const getMeta = (type) => TYPE_META[type] || { emoji: '📍', label: type, color: 'type-visit' };

const assignAudioIds = (activities) => {
    if (!activities || !Array.isArray(activities)) return new Map();
    const claimed = new Map();
    const result = new Map();

    const sorted = [
        ...activities.filter(a => a?.type === 'visit'),
        ...activities.filter(a => a?.type !== 'visit'),
    ];

    for (const activity of sorted) {
        if (!activity) continue;
        const audioId = getAudioId(activity.location) || getAudioId(activity.description);
        if (audioId && !claimed.has(audioId)) {
            claimed.set(audioId, activity.id);
            result.set(activity.id, audioId);
        }
    }
    return result;
};

/* ─── Single expandable activity card ────────────────────────────── */
const ActivityCard = ({ activity, sectionContent, audioId }) => {
    const [open, setOpen] = useState(false);
    if (!activity) return null;

    const meta = getMeta(activity.type);

    return (
        <div className={`activity-card ${open ? 'activity-card--open' : ''}`}>
            {/* ── Header (always visible) ── */}
            <button
                type="button"
                className="activity-card__header"
                onClick={() => setOpen(!open)}
                aria-expanded={open}
            >
                <span className={`activity-card__dot ${meta.color}`}>{meta.emoji}</span>
                <div className="activity-card__header-text">
                    <span className="activity-card__time">
                        <Clock size={12} />
                        {activity.time || '--:--'}
                    </span>
                    <span className="activity-card__location">{activity.location || 'Ubicación'}</span>
                </div>
                <span className={`activity-card__badge ${meta.color}`}>{meta.label}</span>
                <span className="activity-card__chevron">
                    {open ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                </span>
            </button>

            {/* ── Expanded body ── */}
            {open && (
                <div className="activity-card__body">
                    {activity.description && (
                        <p className="activity-card__description">{activity.description}</p>
                    )}

                    {sectionContent && typeof sectionContent === 'string' && (
                        <div className="activity-card__extra">
                            {sectionContent.split('\n\n').map((para, i) => (
                                <p key={i}>{para.trim()}</p>
                            ))}
                        </div>
                    )}

                    {activity.tips && (
                        <div className="activity-card__tips">
                            <AlertCircle size={14} />
                            <span>{activity.tips}</span>
                        </div>
                    )}

                    {audioId && <AudioPlayer audioId={audioId} />}

                    {activity.imageId && (
                        <ImagePlaceholder
                            imageId={activity.imageId}
                            altText={`Imagen de ${activity.location}`}
                        />
                    )}

                    {activity.mapId && (
                        <StaticMap mapId={activity.mapId} title={activity.location} isEmbedded />
                    )}

                    {activity.googleMapsLink && (
                        <a
                            href={activity.googleMapsLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="activity-card__maps-link"
                        >
                            <MapPin size={14} />
                            Ver en Google Maps
                            <ExternalLink size={12} />
                        </a>
                    )}
                </div>
            )}
        </div>
    );
};

/* ─── Main DayDetail page ─────────────────────────────────────────── */
const DayDetail = () => {
    const { dayId } = useParams();
    const day = itinerary.days.find(d => d.id === dayId);
    const [dayContent, setDayContent] = useState(null);

    useEffect(() => {
        if (!day) return;
        const fileName = getDayDocumentName(day.id);
        if (!fileName) return;

        fetch(`${import.meta.env.BASE_URL}docs/${fileName}.md`)
            .then(r => r.ok ? r.text() : Promise.reject())
            .then(md => setDayContent(parseDayContent(md)))
            .catch(() => { }); // silently ignore if doc not available
    }, [day]);

    if (!day) return <Navigate to="/" replace />;

    /* Map section titles from the .md to activity locations */
    const getSectionForActivity = (activity) => {
        if (!dayContent?.sections) return null;
        const loc = activity.location.toLowerCase();
        const match = dayContent.sections.find(s =>
            s.title.toLowerCase().includes(loc.split(' ')[0]) ||
            loc.includes(s.title.toLowerCase().split(' ')[0])
        );
        return match ? match.content : null;
    };

    const audioIdMap = assignAudioIds(day.activities);

    return (
        <div className="day-detail-container">
            {/* ── Day header ── */}
            <div className="day-header">
                <span className="day-date">{day.date}</span>
                <h1 className="day-title">{day.title}</h1>
                <p className="day-summary">
                    {dayContent?.improvedSummary || day.summary}
                </p>
            </div>

            {/* ── Day map ── */}
            <StaticMap dayId={day.id} title={day.title} />

            {/* ── Activity cards ── */}
            <div className="activities-stack">
                {day.activities.map((activity) => (
                    <ActivityCard
                        key={activity.id}
                        activity={activity}
                        sectionContent={getSectionForActivity(activity)}
                        audioId={audioIdMap.get(activity.id) || null}
                    />
                ))}
            </div>
        </div>
    );
};

export default DayDetail;
