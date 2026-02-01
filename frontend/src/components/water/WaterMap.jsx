import React, { useState, useEffect, useRef } from 'react';
import Map, { Marker, Popup, NavigationControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Usamos tu token real que me pasaste
const MAPBOX_TOKEN = 'pk.eyJ1IjoiYXJ0dXJvLXVsaXNlczUxMzYiLCJhIjoiY21sMzN4NjR6MHEyNTNtcHl4NW1kbm8yaiJ9.XmuQzLJzWpfGgNJEe-zEJQ';

const WaterMap = ({ projects, onProjectSelect, selectedId }) => {
    const mapRef = useRef();
    const [popupInfo, setPopupInfo] = useState(null);
    const [viewState, setViewState] = useState({
        longitude: -102.55,
        latitude: 23.63,
        zoom: 4.5
    });

    // EFECTO DE SINCRONÍA: Si seleccionas en la tabla, el mapa vuela al rancho
    useEffect(() => {
        if (selectedId && projects.length > 0) {
            const selected = projects.find(p => p.id === selectedId);
            if (selected?.coordinates) {
                mapRef.current?.flyTo({
                    center: [selected.coordinates.lng, selected.coordinates.lat],
                    duration: 2000,
                    zoom: 12
                });
            }
        }
    }, [selectedId, projects]);

    const handleMarkerClick = (rancho) => {
        setPopupInfo(rancho);
        onProjectSelect(rancho); // Avisa al Index para actualizar gráficas
    };

    return (
        <div className="w-full h-full min-h-[550px] rounded-xl overflow-hidden shadow-2xl border border-slate-800">
            <Map
                {...viewState}
                ref={mapRef}
                onMove={evt => setViewState(evt.viewState)}
                mapStyle="mapbox://styles/mapbox/navigation-night-v1"
                mapboxAccessToken={MAPBOX_TOKEN}
            >
                <NavigationControl position="top-right" />

                {/* FACTOR WOW: Resplandor de Riesgo dinámico */}
                {projects.map((rancho) => {
                    const { lng, lat } = rancho.coordinates;
                    // Usamos el risk_score que viene de Supabase
                    if (rancho.risk_score > 80) {
                        return (
                            <Marker key={`glow-${rancho.id}`} longitude={lng} latitude={lat}>
                                <div className="w-12 h-12 bg-red-600/20 rounded-full animate-ping border border-red-500/50" />
                            </Marker>
                        );
                    }
                    return null;
                })}

                {/* MARCADORES DINÁMICOS */}
                {projects.map((rancho) => {
                    const { lng, lat } = rancho.coordinates;
                    const isSelected = selectedId === rancho.id;
                    const pinColor = rancho.status === 'Available' ? '#F97316' : '#3B82F6';

                    return (
                        <Marker
                            key={rancho.id}
                            longitude={lng}
                            latitude={lat}
                            onClick={e => {
                                e.originalEvent.stopPropagation();
                                handleMarkerClick(rancho);
                            }}
                        >
                            <div className={`cursor-pointer transition-all drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] ${isSelected ? 'scale-150' : 'hover:scale-125'}`}>
                                <svg width="28" height="28" viewBox="0 0 24 24" fill={pinColor}>
                                    <path d="M12 0c-4.198 0-8 3.403-8 7.602 0 4.198 3.469 9.21 8 16.398 4.531-7.188 8-12.2 8-16.398 0-4.199-3.801-7.602-8-7.602zm0 11c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z" />
                                </svg>
                            </div>
                        </Marker>
                    );
                })}

                {popupInfo && (
                    <Popup
                        anchor="top"
                        longitude={popupInfo.coordinates.lng}
                        latitude={popupInfo.coordinates.lat}
                        onClose={() => setPopupInfo(null)}
                        className="z-50"
                    >
                        <div className="p-3 bg-white text-slate-900 rounded shadow-xl min-w-[200px] font-sans">
                            <h3 className="font-bold text-sm border-b pb-1 mb-2">{popupInfo.name}</h3>
                            <div className="space-y-1 text-[10px]">
                                <p>💧 **Ahorro:** {popupInfo.waterSaved}</p>
                                <p>🌱 **Mitigación CO₂:** {popupInfo.co2Avoided}</p>
                                <div className="mt-2 bg-blue-50 p-1 rounded border border-blue-100">
                                    <p className="text-blue-800 font-bold text-center">
                                        Comisión: $ $$(popupInfo.price_per_credit * 0.15).toFixed(2)$$ USD
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Popup>
                )}
            </Map>
        </div>
    );
};

export default WaterMap;