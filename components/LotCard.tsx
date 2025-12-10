import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ParkingLot, getEnforcementState, EnforcementState } from '../types';
import { MapPin, AlertTriangle, ShieldCheck, Ban, Clock, Navigation, Star, Timer, Tag } from 'lucide-react';

interface LotCardProps {
  lot: ParkingLot;
  isFavorite: boolean;
  onToggleFav: (id: string) => void;
}

const LotCard: React.FC<LotCardProps> = ({ lot, isFavorite, onToggleFav }) => {
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const abortButtonRef = useRef<HTMLButtonElement>(null);
  
  const status = getEnforcementState(lot);
  const mapUrl = `http://maps.apple.com/?daddr=${lot.latitude},${lot.longitude}`;

  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isMapModalOpen && e.key === 'Escape') {
        setIsMapModalOpen(false);
      }
    };

    if (isMapModalOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Trap focus or at least move focus to the first interactive element
      requestAnimationFrame(() => {
        abortButtonRef.current?.focus();
      });
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMapModalOpen]);

  const renderStatusBanner = () => {
    switch (status) {
      case EnforcementState.CLOSED:
        return (
          <div className="mb-6 p-4 rounded-r-lg border-l-4 border-gray-500 bg-gray-800/80 flex items-start gap-3">
            <Ban className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <span className="font-bold text-sm text-white block tracking-wide uppercase">Closed</span>
              <span className="text-xs text-gray-300 font-medium">Area unavailable.</span>
            </div>
          </div>
        );
      case EnforcementState.RISK:
        return (
          <div className="mb-6 p-4 rounded-r-lg border-l-4 border-amber-500 bg-amber-900/40 flex items-start gap-3">
            <Timer className="w-5 h-5 text-amber-400 flex-shrink-0 animate-pulse mt-0.5" aria-hidden="true" />
            <div>
              <span className="font-bold text-sm text-amber-100 block tracking-wide uppercase">Closing Soon</span>
              <span className="text-xs text-amber-200/90 font-medium">Enforcement imminent. Move car.</span>
            </div>
          </div>
        );
      case EnforcementState.LIFTED:
        return (
          <div className="mb-6 p-4 rounded-r-lg border-l-4 border-emerald-500 bg-emerald-900/40 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <span className="font-bold text-sm text-emerald-100 block tracking-wide uppercase">Safe Zone</span>
              <span className="text-xs text-emerald-200/90 font-medium">No decal required. Lifted.</span>
            </div>
          </div>
        );
      case EnforcementState.ENFORCED:
      default:
        return (
          <div className="mb-6 p-4 rounded-r-lg border-l-4 border-red-500 bg-red-900/40 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <span className="font-bold text-sm text-red-100 block tracking-wide uppercase">Enforced</span>
              <span className="text-xs text-red-200/90 font-medium">Ticket risk: High.</span>
            </div>
          </div>
        );
    }
  };

  const getBorderColor = () => {
    switch (status) {
      case EnforcementState.CLOSED: return 'border-gray-700 group-hover:border-gray-500';
      case EnforcementState.RISK: return 'border-amber-600/60 group-hover:border-amber-500';
      case EnforcementState.LIFTED: return 'border-emerald-600/60 group-hover:border-emerald-500';
      case EnforcementState.ENFORCED: return 'border-red-800 group-hover:border-red-600';
      default: return 'border-gray-700 group-hover:border-gray-500';
    }
  };

  const getStatusBadge = () => {
    switch (status) {
        case EnforcementState.CLOSED: 
            return (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-gray-800 border border-gray-600 shadow-sm" aria-label="Status: Closed">
                    <div className="w-2 h-2 rounded-full bg-gray-400" aria-hidden="true" />
                    <span className="text-[10px] font-bold text-gray-200 uppercase tracking-wider">CLOSED</span>
                </div>
            );
        case EnforcementState.RISK:
            return (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-900/60 border border-amber-700/60 shadow-sm" aria-label="Status: Closing Soon">
                    <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" aria-hidden="true" />
                    <span className="text-[10px] font-bold text-amber-200 uppercase tracking-wider">CLOSING</span>
                </div>
            );
        case EnforcementState.LIFTED:
            return (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-900/60 border border-emerald-700/60 shadow-sm" aria-label="Status: Lifted">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" aria-hidden="true" />
                    <span className="text-[10px] font-bold text-emerald-200 uppercase tracking-wider">LIFTED</span>
                </div>
            );
        case EnforcementState.ENFORCED:
            return (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-900/60 border border-red-700/60 shadow-sm" aria-label="Status: Enforced">
                    <div className="w-2 h-2 rounded-full bg-red-500" aria-hidden="true" />
                    <span className="text-[10px] font-bold text-red-200 uppercase tracking-wider">ENFORCED</span>
                </div>
            );
    }
  };

  return (
    <>
      <article
        className={`relative overflow-hidden rounded-xl shadow-lg border-2 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] flex flex-col group bg-zinc-900 ${getBorderColor()}`}
        aria-labelledby={`lot-title-${lot.id}`}
      >
        
        {/* Header Image */}
        <div className="h-44 bg-gray-900 relative overflow-hidden border-b border-gray-800">
          <img 
              src={lot.image} 
              alt={`View of ${lot.name}`} 
              className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/60 to-transparent" aria-hidden="true"></div>
          
          {/* Favorite Button - Z-Index 20 to sit above stretched link */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFav(lot.id);
            }}
            className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/70 backdrop-blur-md border border-gray-600 hover:bg-black/90 transition-all group/star focus:outline-none focus:ring-2 focus:ring-yellow-400"
            title={isFavorite ? "Remove from targets" : "Mark as priority target"}
            aria-label={isFavorite ? `Remove ${lot.name} from favorites` : `Add ${lot.name} to favorites`}
            aria-pressed={isFavorite}
          >
            <Star 
              className={`w-5 h-5 transition-all duration-300 ${isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 group-hover/star:text-yellow-400'}`} 
              aria-hidden="true"
            />
          </button>

          {/* Distance Badge if available */}
          {lot.distance !== undefined && (
              <div className="absolute top-3 right-14 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded border border-gray-600 flex items-center gap-1.5 h-[38px] shadow-sm">
                  <Navigation className="w-3.5 h-3.5 text-rebel-red" aria-hidden="true" />
                  <span className="text-white text-xs font-mono font-bold">{lot.distance.toFixed(1)} mi</span>
              </div>
          )}

          <div className="absolute bottom-4 left-5 right-5 pointer-events-none">
              <h3 id={`lot-title-${lot.id}`} className="text-xl font-extrabold leading-tight text-white drop-shadow-md tracking-wide pr-8">{lot.name}</h3>
              
              {/* Location Grouped in Header */}
              <div className="flex items-center gap-1.5 mt-1 text-gray-300">
                  <MapPin className="w-4 h-4 text-rebel-red flex-shrink-0" aria-hidden="true" />
                  <span className="font-medium text-sm leading-relaxed drop-shadow-md">{lot.location}</span>
              </div>
          </div>
        </div>

        <div className="p-5 flex-1 flex flex-col">
          {/* Stretched Link - Accessible Card Action */}
          <a 
            onClick={(e) => {
              e.preventDefault();
              setIsMapModalOpen(true);
            }}
            href={mapUrl}
            className="absolute inset-0 z-10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-rebel-red rounded-xl cursor-pointer"
            aria-label={`Open navigation options for ${lot.name}`}
          >
            <span className="sr-only">Open navigation options for {lot.name}</span>
          </a>

          {/* 1. Status Banner */}
          {renderStatusBanner()}

          {/* 2. Schedule */}
          <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2 text-gray-300">
                      <Clock className="w-4 h-4 text-gray-400" aria-hidden="true" />
                      <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Schedule</h3>
                  </div>
                  {getStatusBadge()}
              </div>
              
              <div className="grid grid-cols-[3.5rem_1fr] gap-y-3 font-mono text-sm">
                  <div className="text-gray-400 font-bold">Sun</div>
                  <div className={`text-right ${lot.schedule?.sun === 'Closed' ? 'text-red-400 font-bold' : 'text-white'}`}>
                      {lot.schedule?.sun}
                  </div>

                  <div className="text-gray-400 font-bold">M-F</div>
                  <div className="text-right text-white font-medium">
                      {lot.schedule?.monFri}
                  </div>

                  <div className="text-gray-400 font-bold">Sat</div>
                  <div className={`text-right ${lot.schedule?.sat === 'Closed' ? 'text-red-400 font-bold' : 'text-white'}`}>
                      {lot.schedule?.sat}
                  </div>
              </div>
          </div>

          {/* 3. Permit Requirements (Bottom) */}
          <div className="mt-auto pt-5 border-t border-gray-800">
              <div className="flex items-center gap-2 mb-3">
                  <Tag className="w-4 h-4 text-gray-400" aria-hidden="true" />
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Required Permits</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                  {lot.permitTypes.map(p => (
                      <span key={p} className="px-3 py-1 bg-zinc-800 text-gray-100 text-xs font-mono font-bold rounded border border-gray-600 shadow-sm tracking-wide">
                          {p}
                      </span>
                  ))}
              </div>
          </div>
        </div>
      </article>

      {/* Navigation Confirmation Modal */}
      {isMapModalOpen && createPortal(
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" 
          role="dialog" 
          aria-modal="true"
          aria-labelledby="modal-title"
          aria-describedby="modal-desc"
        >
            <div className="bg-[#111827] border-2 border-rebel-red rounded-xl shadow-[0_0_30px_rgba(220,38,38,0.2)] max-w-md w-full m-auto overflow-hidden relative">
                <div className="bg-rebel-red/10 p-4 border-b border-rebel-red/30 flex items-center gap-3">
                    <Navigation className="w-5 h-5 text-rebel-red" />
                    <h3 id="modal-title" className="text-white font-bold font-mono tracking-wider">INITIATE NAVIGATION?</h3>
                </div>
                <div className="p-6">
                    <p id="modal-desc" className="text-gray-300 mb-6 font-mono text-sm">
                        You are about to leave the secure grid to view <span className="text-white font-bold">{lot.name}</span> in Apple Maps.
                    </p>
                    <div className="flex gap-3 justify-end">
                        <button
                            ref={abortButtonRef}
                            onClick={(e) => { e.stopPropagation(); setIsMapModalOpen(false); }}
                            className="px-4 py-2 rounded-lg border border-gray-600 text-gray-400 hover:text-white hover:bg-gray-800 font-mono text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
                        >
                            ABORT
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                window.open(mapUrl, '_blank');
                                setIsMapModalOpen(false);
                            }}
                            className="px-4 py-2 rounded-lg bg-rebel-red text-black hover:bg-red-500 font-mono text-xs font-bold transition-colors shadow-[0_0_10px_rgba(220,38,38,0.4)] focus:outline-none focus:ring-2 focus:ring-red-400"
                        >
                            PROCEED
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default LotCard;