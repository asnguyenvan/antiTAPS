import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ParkingLot, getEnforcementState, EnforcementState } from '../types';
import { MapPin, AlertTriangle, ShieldCheck, Ban, Clock, Navigation, Star, Timer, Tag, Trophy } from 'lucide-react';

interface LotCardProps {
  lot: ParkingLot;
  isFavorite: boolean;
  onToggleFav: (id: string) => void;
  simulatedDate?: Date;
}

const LotCard: React.FC<LotCardProps> = ({ lot, isFavorite, onToggleFav, simulatedDate }) => {
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const abortButtonRef = useRef<HTMLButtonElement>(null);
  const proceedButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Use the simulated date if provided, otherwise default to "now" is handled inside the function
  const now = simulatedDate || new Date();
  const currentDay = now.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
  const isWeekday = currentDay >= 1 && currentDay <= 5;

  const status = getEnforcementState(lot, simulatedDate);
  const mapUrl = `http://maps.apple.com/?daddr=${lot.latitude},${lot.longitude}`;

  const handleOpenModal = (e: React.MouseEvent) => {
    e.preventDefault();
    triggerRef.current = e.currentTarget as HTMLElement;
    setIsMapModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsMapModalOpen(false);
    // Restore focus to the trigger element
    triggerRef.current?.focus();
  };

  // Handle Focus Trap and Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isMapModalOpen) return;

      if (e.key === 'Escape') {
        handleCloseModal();
      }

      if (e.key === 'Tab') {
        const focusableElements = modalRef.current?.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (!focusableElements) return;

        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    if (isMapModalOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Trap focus
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
              <span className="text-xs text-amber-200 font-medium">Enforcement imminent. Move car.</span>
            </div>
          </div>
        );
      case EnforcementState.LIFTED:
        return (
          <div className="mb-6 p-4 rounded-r-lg border-l-4 border-emerald-500 bg-emerald-900/40 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <span className="font-bold text-sm text-emerald-100 block tracking-wide uppercase">Safe Zone</span>
              <span className="text-xs text-emerald-200 font-medium">No decal required. Lifted.</span>
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
              <span className="text-xs text-red-200 font-medium">Ticket risk: High.</span>
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
            onClick={handleOpenModal}
            href={mapUrl}
            className="absolute inset-0 z-10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-rebel-red rounded-xl cursor-pointer"
            aria-label={`Open navigation options for ${lot.name}`}
          >
            <span className="sr-only">Open navigation options for {lot.name}</span>
          </a>

          {/* 1. Status Banner */}
          {renderStatusBanner()}

          {/* 2. Schedule (Re-designed for scannability) */}
          <div className="mb-6 relative z-20">
              <div className="w-full flex justify-between items-center mb-2 p-1 -ml-1">
                  <div className="flex items-center gap-2 text-gray-300">
                      <Clock className="w-4 h-4 text-gray-400" aria-hidden="true" />
                      <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Weekly Schedule</h3>
                  </div>
                  <div className="flex items-center gap-2">
                      {getStatusBadge()}
                  </div>
              </div>
              
              <div className="bg-gray-800/40 rounded-lg overflow-hidden border border-gray-700/50 backdrop-blur-sm">
                  {/* Mon-Fri */}
                  <div className={`flex justify-between items-center px-4 py-2.5 border-b border-gray-700/30 ${isWeekday ? 'bg-rebel-red/10' : 'bg-transparent'}`}>
                      <div className="flex items-center gap-2.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${isWeekday ? 'bg-rebel-red shadow-[0_0_5px_rgba(220,38,38,0.8)]' : 'bg-gray-600'}`}></span>
                          <span className={`text-xs font-bold uppercase tracking-wider ${isWeekday ? 'text-white' : 'text-gray-400'}`}>Mon - Fri</span>
                      </div>
                      <span className={`text-xs font-mono font-medium ${isWeekday ? 'text-white' : 'text-gray-400'}`}>{lot.schedule?.monFri}</span>
                  </div>

                  {/* Saturday */}
                  <div className={`flex justify-between items-center px-4 py-2.5 border-b border-gray-700/30 ${currentDay === 6 ? 'bg-rebel-red/10' : 'bg-transparent'}`}>
                      <div className="flex items-center gap-2.5">
                           <span className={`w-1.5 h-1.5 rounded-full ${currentDay === 6 ? 'bg-rebel-red shadow-[0_0_5px_rgba(220,38,38,0.8)]' : 'bg-gray-600'}`}></span>
                          <span className={`text-xs font-bold uppercase tracking-wider ${currentDay === 6 ? 'text-white' : 'text-gray-400'}`}>Saturday</span>
                      </div>
                      <span className={`text-xs font-mono font-medium ${lot.schedule?.sat === 'Closed' ? 'text-red-400 font-bold' : (currentDay === 6 ? 'text-white' : 'text-gray-400')}`}>
                          {lot.schedule?.sat}
                      </span>
                  </div>

                  {/* Sunday */}
                  <div className={`flex justify-between items-center px-4 py-2.5 ${currentDay === 0 ? 'bg-rebel-red/10' : 'bg-transparent'}`}>
                      <div className="flex items-center gap-2.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${currentDay === 0 ? 'bg-rebel-red shadow-[0_0_5px_rgba(220,38,38,0.8)]' : 'bg-gray-600'}`}></span>
                          <span className={`text-xs font-bold uppercase tracking-wider ${currentDay === 0 ? 'text-white' : 'text-gray-400'}`}>Sunday</span>
                      </div>
                      <span className={`text-xs font-mono font-medium ${lot.schedule?.sun === 'Closed' ? 'text-red-400 font-bold' : (currentDay === 0 ? 'text-white' : 'text-gray-400')}`}>
                          {lot.schedule?.sun}
                      </span>
                  </div>
              </div>

              {/* Game Day Info Alert */}
              {lot.gameDayInfo && (
                <div className="mt-3 p-2.5 rounded bg-amber-900/20 border border-amber-700/30 flex items-start gap-2.5">
                    <Trophy className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div className="space-y-1">
                        <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider block">Game Day Protocol</span>
                        <p className="text-[11px] text-gray-300 leading-snug font-mono">
                            {lot.gameDayInfo}
                        </p>
                    </div>
                </div>
              )}

              {/* Holiday Note */}
              <div className="mt-2 text-[10px] text-gray-500 italic text-center px-2">
                 * Holidays typically follow Sunday enforcement.
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
            <div 
                ref={modalRef}
                className="bg-[#111827] border-2 border-rebel-red rounded-xl shadow-[0_0_30px_rgba(220,38,38,0.2)] max-w-md w-full m-auto overflow-hidden relative"
            >
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
                            onClick={(e) => { e.stopPropagation(); handleCloseModal(); }}
                            className="px-4 py-2 rounded-lg border border-gray-600 text-gray-400 hover:text-white hover:bg-gray-800 font-mono text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
                        >
                            ABORT
                        </button>
                        <button
                            ref={proceedButtonRef}
                            onClick={(e) => {
                                e.stopPropagation();
                                window.open(mapUrl, '_blank');
                                handleCloseModal();
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