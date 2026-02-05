import React, { useState, useEffect, useRef } from 'react';
import Map, { Marker, Popup, NavigationControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import './WaterMap.css';


// Usamos tu token real de Mapbox
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
const WaterMap = ({ projects, onProjectSelect, selectedId }) => {
    const mapRef = useRef();
    const [popupInfo, setPopupInfo] = useState(null);
    const [viewState, setViewState] = useState({
        longitude: -102.55,
        latitude: 23.63,
        zoom: 4.5
    });

    // EFECTO DE SINCRONÍA: Vuela al marcador cuando se selecciona en la tabla
    useEffect(() => {
        if (selectedId && projects.length > 0) {
            const selected = projects.find(p => p.id === selectedId);
            // Validamos que existan lat y lng directamente en el objeto
            if (selected && selected.lat && selected.lng) {
                mapRef.current?.flyTo({
                    center: [selected.lng, selected.lat],
                    duration: 2000,
                    zoom: 12
                });
            }
        }
    }, [selectedId, projects]);

    const handleMarkerClick = (rancho) => {
        setPopupInfo(rancho);
        if (onProjectSelect) onProjectSelect(rancho);
    };

    return (
        <div className="w-full h-full min-h-[550px] rounded-xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-900">
            <Map
                {...viewState}
                ref={mapRef}
                onMove={evt => setViewState(evt.viewState)}
                mapStyle="mapbox://styles/mapbox/navigation-night-v1"
                mapboxAccessToken={MAPBOX_TOKEN}
            >
                <NavigationControl position="top-right" />

                {projects.map((rancho) => {
                    // EXTRACCIÓN SEGURA: Usamos lat/lng directos de la tabla de Supabase
                    const lng = parseFloat(rancho.lng);
                    const lat = parseFloat(rancho.lat);

                    if (isNaN(lng) || isNaN(lat)) return null;

                    const isSelected = selectedId === rancho.id;
                    const pinColor = rancho.status === 'Available' ? '#F97316' : '#3B82F6';

                    return (
                        <React.Fragment key={rancho.id}>
                            {/* EFECTO GLOW PARA RIESGO ALTO */}
                            {rancho.risk_score > 80 && (
                                <Marker longitude={lng} latitude={lat}>
                                    <div className="w-12 h-12 bg-red-600/20 rounded-full animate-ping border border-red-500/50" />
                                </Marker>
                            )}

                            {/* MARCADOR PRINCIPAL */}
                            <Marker
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
                        </React.Fragment>
                    );
                })}

                {popupInfo && (
                    <Popup
                        anchor="top"
                        longitude={parseFloat(popupInfo.lng)}
                        latitude={parseFloat(popupInfo.lat)}
                        onClose={() => setPopupInfo(null)}
                        className="z-50"
                        closeButton={false}
                    >
                        {/* CONTENEDOR PRINCIPAL: Color acorde a tu Dashboard (Slate 950 / Cyan) */}
                        <div className="p-0 bg-[#0B1120]/95 backdrop-blur-md text-white rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.5)] min-w-[310px] border border-cyan-500/30 overflow-hidden font-sans ring-1 ring-white/10">

                            {/* 1. HEADER: Con acento Cian Neón */}
                            <div className="bg-gradient-to-r from-[#0B1120] via-[#111827] to-[#0B1120] px-4 py-3 flex justify-between items-center border-b border-cyan-500/20">
                                <div>
                                    <h3 className="font-black text-sm uppercase tracking-wider text-cyan-400">{popupInfo.name}</h3>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_8px_#22d3ee]" />
                                        <p className="text-[9px] text-slate-400 font-bold tracking-widest uppercase">Sistema Monitoreado</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setPopupInfo(null)}
                                    className="text-slate-500 hover:text-cyan-400 transition-colors p-1"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                </button>
                            </div>

                            <div className="p-4 space-y-4">
                                {/* 2. DASHBOARD DE MÉTRICAS: Colores de tus gráficas */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-slate-900/50 p-2.5 rounded-lg border border-slate-800">
                                        <p className="text-[8px] text-cyan-500 font-black uppercase tracking-tighter">Agua Recuperada</p>
                                        <p className="text-base font-black text-white">{popupInfo.water_savings_m3} <span className="text-[10px] text-slate-500 font-normal">m³</span></p>
                                    </div>
                                    <div className="bg-slate-900/50 p-2.5 rounded-lg border border-slate-800">
                                        <p className="text-[8px] text-rose-500 font-black uppercase tracking-tighter">Estrés Hídrico</p>
                                        <p className={`text-base font-black ${popupInfo.risk_score > 70 ? 'text-rose-500' : 'text-emerald-400'}`}>
                                            {popupInfo.risk_score}%
                                        </p>
                                    </div>
                                </div>

                                {/* 3. INSIGHT DE INTELIGENCIA ARTIFICIAL: Estilo "Cyber" */}
                                <div className="bg-cyan-500/5 border border-cyan-500/20 p-3 rounded-lg relative overflow-hidden group">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <div className="bg-cyan-500/20 p-1 rounded">
                                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="3"><path d="M12 2a10 10 0 1 0 10 10H12V2z"></path></svg>
                                        </div>
                                        <span className="text-[10px] font-black text-cyan-500/80 uppercase tracking-widest">IA Nexus Insight</span>
                                    </div>
                                    <p className="text-[11px] leading-relaxed text-slate-300 font-medium italic relative z-10">
                                        "{popupInfo.ai_description || 'Analizando impacto hídrico mediante modelos predictivos...'}"
                                    </p>
                                    {/* Brillo de fondo */}
                                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none" />
                                </div>

                                {/* 4. FOOTER: Costo y CTA */}
                                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                                    <div>
                                        <p className="text-[8px] text-slate-500 uppercase font-bold tracking-widest">Costo Unitario</p>
                                        <p className="text-lg font-black text-white leading-tight">${popupInfo.price_per_credit} <span className="text-[10px] text-slate-500 font-normal uppercase">USD</span></p>
                                    </div>
                                    <button className="bg-cyan-600 hover:bg-cyan-500 text-[#0B1120] text-[11px] font-black py-2.5 px-6 rounded-lg shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all transform active:scale-95 flex items-center gap-2 uppercase">
                                        <span>Adquirir</span>
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><polyline points="9 18 15 12 9 6"></polyline></svg>
                                    </button>
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