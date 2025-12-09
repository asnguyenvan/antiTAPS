import React from 'react';
import { ParkingLot, getEnforcementState, EnforcementState } from '../types';
import { MapPin, AlertTriangle, ShieldCheck, Ban, Clock, Navigation, Star, Timer } from 'lucide-react';

interface LotCardProps {
  lot: ParkingLot;
  isFavorite: boolean;
  onToggleFav: (id: string) => void;
}

const LotCard: React.FC<LotCardProps> = ({ lot, isFavorite, onToggleFav }) => {
  const status = getEnforcementState(lot);

  const renderStatusBanner = () => {
    switch (status) {
      case EnforcementState.CLOSED:
        return (
          <div className="mb-6 p-4 rounded-r-lg border-l-4 border-gray-500 bg-gray-800/80 flex items-start gap-3">
            <Ban className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-sm text-white block tracking-wide uppercase">Closed</span>
              <span className="text-xs text-gray-300 font-medium">Area unavailable.</span>
            </div>
          </div>
        );
      case EnforcementState.RISK:
        return (
          <div className="mb-6 p-4 rounded-r-lg border-l-4 border-amber-500 bg-amber-900/40 flex items-start gap-3">
            <Timer className="w-5 h-5 text-amber-400 flex-shrink-0 animate-pulse mt-0.5" />
            <div>
              <span className="font-bold text-sm text-amber-100 block tracking-wide uppercase">Closing Soon</span>
              <span className="text-xs text-amber-200/90 font-medium">Enforcement imminent. Move car.</span>
            </div>
          </div>
        );
      case EnforcementState.LIFTED:
        return (
          <div className="mb-6 p-4 rounded-r-lg border-l-4 border-emerald-500 bg-emerald-900/40 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
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
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
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
      case EnforcementState.CLOSED: return 'border-gray-700 hover:border-gray-500';
      case EnforcementState.RISK: return 'border-amber-600/60 hover:border-amber-500';
      case EnforcementState.LIFTED: return 'border-emerald-600/60 hover:border-emerald-500';
      case EnforcementState.ENFORCED: return 'border-red-800 hover:border-red-600';
      default: return 'border-gray-700 hover:border-gray-500';
    }
  };

  const getStatusBadge = () => {
    switch (status) {
        case EnforcementState.CLOSED: 
            return (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-gray-800 border border-gray-600 shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-gray-400" />
                    <span className="text-[10px] font-bold text-gray-200 uppercase tracking-wider">CLOSED</span>
                </div>
            );
        case EnforcementState.RISK:
            return (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-900/60 border border-amber-700/60 shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    <span className="text-[10px] font-bold text-amber-200 uppercase tracking-wider">CLOSING</span>
                </div>
            );
        case EnforcementState.LIFTED:
            return (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-900/60 border border-emerald-700/60 shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-[10px] font-bold text-emerald-200 uppercase tracking-wider">LIFTED</span>
                </div>
            );
        case EnforcementState.ENFORCED:
            return (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-900/60 border border-red-700/60 shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <span className="text-[10px] font-bold text-red-200 uppercase tracking-wider">ENFORCED</span>
                </div>
            );
    }
  };

  return (
    <div className={`relative overflow-hidden rounded-xl shadow-lg border-2 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] flex flex-col group bg-zinc-900 ${getBorderColor()}`}>
      
      {/* Header Image */}
      <div className="h-40 bg-gray-900 relative overflow-hidden border-b border-gray-800">
        <img 
            src={lot.image} 
            alt={`${lot.name} - Parking Lot`} 
            className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent"></div>
        
        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFav(lot.id);
          }}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/70 backdrop-blur-md border border-gray-600 hover:bg-black/90 transition-all group/star"
          title={isFavorite ? "Remove from targets" : "Mark as priority target"}
        >
          <Star 
            className={`w-5 h-5 transition-all duration-300 ${isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 group-hover/star:text-yellow-400'}`} 
          />
        </button>

        {/* Distance Badge if available */}
        {lot.distance !== undefined && (
             <div className="absolute top-3 right-14 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded border border-gray-600 flex items-center gap-1.5 h-[38px] shadow-sm">
                 <Navigation className="w-3.5 h-3.5 text-rebel-red" />
                 <span className="text-white text-xs font-mono font-bold">{lot.distance.toFixed(1)} mi</span>
             </div>
        )}

        <div className="absolute bottom-4 left-5 right-5">
            <h3 className="text-xl font-extrabold leading-tight text-white drop-shadow-md tracking-wide pr-8">{lot.name}</h3>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        {/* Meta Info */}
        <div className="space-y-4 mb-6">
            <div className="flex items-start gap-3 text-gray-200">
                <MapPin className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <span className="font-medium text-sm leading-relaxed">{lot.location}</span>
            </div>

            <div className="flex flex-wrap gap-2">
                {lot.permitTypes.map(p => (
                    <span key={p} className="px-3 py-1 bg-zinc-800 text-gray-100 text-xs font-mono font-bold rounded border border-gray-600 shadow-sm tracking-wide">
                        {p}
                    </span>
                ))}
            </div>
        </div>

        {/* Status Banner */}
        {renderStatusBanner()}

        {/* Apple Maps Style Hours Section */}
        <div className="mt-auto pt-5 border-t border-gray-800">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2 text-gray-300">
                    <Clock className="w-4 h-4 text-gray-400" />
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
      </div>
    </div>
  );
};

export default LotCard;