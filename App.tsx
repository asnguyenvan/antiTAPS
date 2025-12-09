import React, { useState, useMemo, useEffect, useRef } from 'react';
import { INITIAL_LOTS } from './constants';
import { ParkingLot, PermitType, isLotLifted } from './types';
import LotCard from './components/LotCard';
import { Filter, Search, Skull, Clock, Siren, Zap, Navigation, Star, ChevronDown } from 'lucide-react';

const App: React.FC = () => {
  const [lots] = useState<ParkingLot[]>(INITIAL_LOTS);
  const [filterType, setFilterType] = useState<PermitType>(PermitType.ANY);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [sortByDistance, setSortByDistance] = useState(false);
  
  // Custom Dropdown State
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  // Favorites State
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('antitaps_favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Save favorites when changed
  useEffect(() => {
    localStorage.setItem('antitaps_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Click outside listener for dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 3959; // Radius of the earth in miles
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in miles
  };

  const handleNearMeClick = () => {
    if (sortByDistance) {
      setSortByDistance(false);
      return;
    }

    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setSortByDistance(true);
      },
      (error) => {
        console.error("Error getting location", error);
        alert("Unable to retrieve your location. Check permissions.");
      }
    );
  };

  const filteredLots = useMemo(() => {
    let processedLots = lots.map(lot => {
       // Calculate distance if user location is known
       if (userLocation) {
         return {
           ...lot,
           distance: calculateDistance(userLocation.lat, userLocation.lng, lot.latitude, lot.longitude)
         };
       }
       return lot;
    });

    // Filter
    processedLots = processedLots.filter(lot => {
      // Favorites Only Filter
      if (showFavoritesOnly && !favorites.includes(lot.id)) {
        return false;
      }

      let matchesType = false;
      if (filterType === PermitType.ANY) {
        matchesType = true;
      } else if (filterType === PermitType.NO_DECAL) {
        matchesType = isLotLifted(lot);
      } else {
        matchesType = lot.permitTypes.includes(filterType);
      }

      const matchesSearch = lot.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            lot.location.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesType && matchesSearch;
    });

    // Sort
    processedLots.sort((a, b) => {
      // 1. Sort by Favorites (Favorites always first)
      const aFav = favorites.includes(a.id);
      const bFav = favorites.includes(b.id);
      
      if (aFav && !bFav) return -1;
      if (!aFav && bFav) return 1;

      // 2. Sort by Distance (if active)
      if (sortByDistance && userLocation) {
        return (a.distance || 9999) - (b.distance || 9999);
      }
      
      // 3. Default alphabetical
      return 0; 
    });

    return processedLots;
  }, [lots, filterType, searchQuery, userLocation, sortByDistance, favorites, showFavoritesOnly]);

  return (
    <div className="min-h-screen bg-rebel-dark pb-20 font-sans text-gray-200">
      {/* Navbar */}
      <nav className="sticky top-0 z-30 bg-black/90 border-b border-rebel-red backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-rebel-red p-1.5 rounded-md shadow-[0_0_15px_rgba(220,38,38,0.5)]">
                <Skull className="w-6 h-6 text-black" />
              </div>
              <span className="text-white font-bold text-xl tracking-tighter uppercase font-mono">anti<span className="text-rebel-red">TAPS</span></span>
            </div>
            {/* Simple Time Display */}
            <div className="hidden md:block text-gray-400 text-xs font-mono">
               SYS_TIME: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <div className="relative z-20 bg-gradient-to-r from-black to-gray-900 rounded-xl p-8 text-white border border-gray-800 shadow-2xl mb-8 group">
             {/* Abstract Decor - Clipped in separate container */}
             <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
                 <div className="absolute top-0 right-0 -mt-10 -mr-10 w-60 h-60 bg-rebel-red opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-opacity duration-700"></div>
             </div>
             
             <div className="relative z-10">
                 <h1 className="text-4xl font-black mb-2 tracking-tight uppercase">Fight the System</h1>
                 <p className="text-gray-400 mb-8 max-w-2xl font-mono text-sm">
                   <span className="text-rebel-red">&gt;&gt;</span> Real-time enforcement intel. Avoid tickets. Reclaim your campus parking.
                 </p>
                 
                 <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input 
                        type="text" 
                        placeholder="Search target sector..." 
                        className="w-full pl-10 pr-4 py-3 rounded-lg text-white bg-gray-800 border border-gray-700 focus:outline-none focus:border-rebel-red focus:ring-1 focus:ring-rebel-red transition-all placeholder-gray-600 font-mono text-sm"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                      />
                    </div>
                    
                    <div className="flex gap-3 overflow-visible pb-1 sm:pb-0">
                        {/* Custom Dropdown */}
                        <div className="relative min-w-[180px] flex-1 sm:flex-none" ref={filterRef}>
                          <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className={`w-full pl-10 pr-4 py-3 rounded-lg text-white bg-gray-800 border transition-all duration-200 flex items-center justify-between
                              ${isFilterOpen ? 'border-rebel-red ring-1 ring-rebel-red bg-gray-800' : 'border-gray-700 hover:border-gray-600 hover:bg-gray-700/50'}`}
                          >
                            <div className="flex items-center gap-2 overflow-hidden">
                              <Filter className="w-4 h-4 text-gray-500 absolute left-3" />
                              <span className="font-mono text-sm truncate">{filterType === PermitType.ANY ? 'All Permits' : filterType}</span>
                            </div>
                            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 flex-shrink-0 ${isFilterOpen ? 'rotate-180' : ''}`} />
                          </button>

                          {isFilterOpen && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-[#111827] border border-gray-700 rounded-lg shadow-2xl z-[100] overflow-hidden py-1 max-h-80 overflow-y-auto">
                              {Object.values(PermitType).map((t) => (
                                <button
                                  key={t}
                                  onClick={() => {
                                    setFilterType(t);
                                    setIsFilterOpen(false);
                                  }}
                                  className={`w-full text-left px-4 py-2.5 text-sm font-mono transition-colors flex items-center justify-between group
                                    ${filterType === t ? 'text-white bg-rebel-red/10 border-l-2 border-rebel-red' : 'text-gray-400 hover:bg-gray-800 hover:text-white border-l-2 border-transparent'}`}
                                >
                                  <span className="truncate">{t === PermitType.ANY ? 'All Permits' : t}</span>
                                  {filterType === t && <div className="w-1.5 h-1.5 rounded-full bg-rebel-red shadow-[0_0_5px_rgba(220,38,38,0.8)] flex-shrink-0" />}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Near Me Toggle */}
                        <button 
                            onClick={handleNearMeClick}
                            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-mono text-sm font-bold transition-all border
                            ${sortByDistance 
                                ? 'bg-rebel-red text-white border-rebel-red shadow-[0_0_10px_rgba(220,38,38,0.5)]' 
                                : 'bg-gray-800 text-gray-300 border-gray-700 hover:border-gray-500'}`}
                        >
                            <Navigation className={`w-4 h-4 ${sortByDistance ? 'fill-current' : ''}`} />
                            <span className="whitespace-nowrap hidden sm:inline">{sortByDistance ? 'Near Me' : 'Find Near Me'}</span>
                            <span className="sm:hidden"><Navigation className="w-4 h-4"/></span>
                        </button>

                        {/* Favorites Toggle */}
                        <button 
                            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-mono text-sm font-bold transition-all border
                            ${showFavoritesOnly 
                                ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/50 shadow-[0_0_10px_rgba(234,179,8,0.2)]' 
                                : 'bg-gray-800 text-gray-300 border-gray-700 hover:border-gray-500 hover:text-white'}`}
                            title="Show Priorities Only"
                        >
                            <Star className={`w-4 h-4 ${showFavoritesOnly ? 'fill-current' : ''}`} />
                        </button>
                    </div>
                 </div>
             </div>
        </div>

        {/* Tactical Intel / Tips Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            <div className="bg-black border border-gray-800 p-5 rounded-xl shadow-lg hover:border-gray-700 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                    <Clock className="w-5 h-5 text-rebel-red" />
                    <h3 className="font-bold text-white uppercase tracking-wider text-sm">The 4:30 Lift</h3>
                </div>
                <p className="text-gray-400 text-xs leading-relaxed font-mono">
                    Most Red/Orange restrictions lift at <span className="text-white font-bold">4:30 PM</span>. If you arrive at 4:20 PM, wait. TAPS patrols heavily right before the buzzer to catch early arrivals.
                </p>
            </div>
            
            <div className="bg-black border border-gray-800 p-5 rounded-xl shadow-lg hover:border-gray-700 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                    <Siren className="w-5 h-5 text-rebel-red" />
                    <h3 className="font-bold text-white uppercase tracking-wider text-sm">The Weekend Trap</h3>
                </div>
                <p className="text-gray-400 text-xs leading-relaxed font-mono">
                    Most lots are lifted on weekends, but <span className="text-white font-bold">Garage 5</span> is CLOSED. Also, "Service Drives" and "Brown" lots are enforced 24/7, even on Sundays.
                </p>
            </div>

            <div className="bg-black border border-gray-800 p-5 rounded-xl shadow-lg hover:border-gray-700 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                    <Zap className="w-5 h-5 text-rebel-red" />
                    <h3 className="font-bold text-white uppercase tracking-wider text-sm">Flashers = Targets</h3>
                </div>
                <p className="text-gray-400 text-xs leading-relaxed font-mono">
                    Hazard lights are not a "pause button." They act as a beacon for TAPS. Never leave your car unattended in a fire lane or bus loop, even for "just a minute."
                </p>
            </div>
        </div>

        {/* Lots Grid */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-3 uppercase tracking-wider">
            {showFavoritesOnly ? 'Priority Targets' : filterType === PermitType.ANY ? 'Surveillance List' : filterType === PermitType.NO_DECAL ? 'Safe Zones' : `${filterType} Sectors`}
            <span className="text-xs font-mono text-gray-900 bg-rebel-red px-2 py-0.5 rounded font-bold">
                {filteredLots.length}
            </span>
          </h2>
        </div>

        {filteredLots.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredLots.map(lot => (
              <LotCard 
                key={lot.id} 
                lot={lot} 
                isFavorite={favorites.includes(lot.id)}
                onToggleFav={toggleFavorite}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-900/50 rounded-2xl border border-dashed border-gray-800">
            <p className="text-gray-500 text-lg font-mono">No targets found matching criteria.</p>
            <button 
              onClick={() => {setFilterType(PermitType.ANY); setSearchInput(''); setSearchQuery(''); setSortByDistance(false); setShowFavoritesOnly(false);}}
              className="mt-4 text-rebel-red hover:text-white transition-colors font-medium uppercase text-sm tracking-widest border-b border-rebel-red pb-1"
            >
              Reset Filters
            </button>
          </div>
        )}
      </main>

    </div>
  );
};

export default App;