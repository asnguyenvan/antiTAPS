import React, { useState, useMemo, useEffect, useRef } from 'react';
import { INITIAL_LOTS } from './constants';
import { ParkingLot, PermitType, isLotLifted } from './types';
import LotCard from './components/LotCard';
import { Filter, Search, Skull, Clock, Zap, Navigation, Star, ChevronDown, ChevronLeft, ChevronRight, CalendarClock, Calendar, Trophy, ShieldCheck, AlertTriangle, CircleDashed } from 'lucide-react';

const App: React.FC = () => {
  const [lots] = useState<ParkingLot[]>(INITIAL_LOTS);
  const [filterType, setFilterType] = useState<PermitType>(PermitType.ANY);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'LIFTED' | 'ENFORCED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [sortByDistance, setSortByDistance] = useState(false);
  
  // Custom Dropdown State
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isStatusFilterOpen, setIsStatusFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const statusFilterRef = useRef<HTMLDivElement>(null);

  // Time Travel / Simulation State
  const [isSimulationMode, setIsSimulationMode] = useState(false);
  const [simDate, setSimDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [simTime, setSimTime] = useState(() => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  });

  // Custom Pickers State
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [calendarViewDate, setCalendarViewDate] = useState(new Date());
  
  const datePickerRef = useRef<HTMLDivElement>(null);
  const timePickerRef = useRef<HTMLDivElement>(null);

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

  // Handle Escape key to close dropdowns
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (isFilterOpen) setIsFilterOpen(false);
        if (isStatusFilterOpen) setIsStatusFilterOpen(false);
        if (showDatePicker) setShowDatePicker(false);
        if (showTimePicker) setShowTimePicker(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFilterOpen, isStatusFilterOpen, showDatePicker, showTimePicker]);

  // Click outside listener for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      if (filterRef.current && !filterRef.current.contains(target)) {
        setIsFilterOpen(false);
      }
      if (statusFilterRef.current && !statusFilterRef.current.contains(target)) {
        setIsStatusFilterOpen(false);
      }
      if (datePickerRef.current && !datePickerRef.current.contains(target)) {
        setShowDatePicker(false);
      }
      if (timePickerRef.current && !timePickerRef.current.contains(target)) {
        setShowTimePicker(false);
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

  // Helper to format 24h string "HH:MM" to 12h "H:MM AM/PM"
  const formatTime12Hour = (time24: string) => {
    if (!time24) return '';
    const [hoursStr, minutesStr] = time24.split(':');
    const hours = parseInt(hoursStr, 10);
    const suffix = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    return `${hours12}:${minutesStr} ${suffix}`;
  };

  // Construct the target date object based on simulation mode
  const targetDate = useMemo(() => {
    if (!isSimulationMode) return new Date();
    try {
      return new Date(`${simDate}T${simTime}`);
    } catch (e) {
      return new Date();
    }
  }, [isSimulationMode, simDate, simTime]);

  // Logic for sorting permit dropdown options
  const sortedPermitTypes = useMemo(() => {
    const all = Object.values(PermitType);
    const others = all.filter(t => t !== PermitType.ANY && t !== PermitType.NO_DECAL);
    
    // Base order: All Permits, then the rest (excluding No Decal)
    const baseOrder = [PermitType.ANY, ...others];
    
    // If current filter is in the list, move it to the top.
    // Ensure we don't duplicate it if it's already at the top (e.g. if ANY is selected).
    if (filterType === baseOrder[0]) {
        return baseOrder;
    }
    
    return [filterType, ...baseOrder.filter(t => t !== filterType)];
  }, [filterType]);

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

      // Status Filter
      let matchesStatus = true;
      if (statusFilter !== 'ALL') {
          const isLifted = isLotLifted(lot, targetDate);
          if (statusFilter === 'LIFTED') matchesStatus = isLifted;
          if (statusFilter === 'ENFORCED') matchesStatus = !isLifted;
      }

      let matchesType = false;
      if (filterType === PermitType.ANY) {
        matchesType = true;
      } else if (filterType === PermitType.NO_DECAL) {
        // Pass the target simulation date here
        matchesType = isLotLifted(lot, targetDate);
      } else {
        matchesType = lot.permitTypes.includes(filterType);
      }

      const matchesSearch = lot.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            lot.location.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesType && matchesSearch && matchesStatus;
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
  }, [lots, filterType, statusFilter, searchQuery, userLocation, sortByDistance, favorites, showFavoritesOnly, targetDate]);

  // Calendar Helpers
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const handleDateSelect = (day: number) => {
    const year = calendarViewDate.getFullYear();
    const month = calendarViewDate.getMonth();
    // Month is 0-indexed, but ISO string expects 01-12
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSimDate(dateStr);
    setShowDatePicker(false);
  };

  const handleMonthChange = (delta: number) => {
    const newDate = new Date(calendarViewDate);
    newDate.setMonth(newDate.getMonth() + delta);
    setCalendarViewDate(newDate);
  };

  // Time Picker Helpers
  const generateTimeOptions = () => {
    const hours = Array.from({ length: 12 }, (_, i) => i + 1);
    const minutes = Array.from({ length: 12 }, (_, i) => i * 5); // 0, 5, 10...
    const periods = ['AM', 'PM'];
    return { hours, minutes, periods };
  };

  const handleTimeSelect = (type: 'hour' | 'minute' | 'period', value: number | string) => {
    const [currentHStr, currentMStr] = simTime.split(':');
    let h = parseInt(currentHStr, 10);
    let m = parseInt(currentMStr, 10);
    
    // Determine current period
    let isPM = h >= 12;
    if (h === 24) isPM = false; // Should not happen in standard 0-23

    let h12 = h % 12;
    if (h12 === 0) h12 = 12;

    if (type === 'hour') {
      h12 = value as number;
    } else if (type === 'minute') {
      m = value as number;
    } else if (type === 'period') {
      const newPeriod = value as string;
      if (newPeriod === 'AM' && isPM) isPM = false;
      if (newPeriod === 'PM' && !isPM) isPM = true;
    }

    // Convert back to 24h
    let newH = h12;
    if (isPM && h12 !== 12) newH = h12 + 12;
    if (!isPM && h12 === 12) newH = 0;

    setSimTime(`${String(newH).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
  };

  const { hours, minutes, periods } = generateTimeOptions();
  const [currentHStr, currentMStr] = simTime.split(':');
  const currentH = parseInt(currentHStr, 10);
  const currentM = parseInt(currentMStr, 10);
  const currentPeriod = currentH >= 12 ? 'PM' : 'AM';
  let currentH12 = currentH % 12;
  if (currentH12 === 0) currentH12 = 12;

  // Title helper
  const getListTitle = () => {
    if (showFavoritesOnly) return 'Priority Targets';
    
    let base = filterType === PermitType.ANY ? 'Surveillance List' 
             : filterType === PermitType.NO_DECAL ? 'Safe Zones' 
             : `${filterType} Sectors`;

    if (statusFilter === 'LIFTED' && filterType !== PermitType.NO_DECAL) base += ' (Lifted)';
    if (statusFilter === 'ENFORCED') base += ' (Enforced)';
    
    return base;
  };

  return (
    <div className="min-h-screen bg-rebel-dark pb-20 font-sans text-gray-200">
      {/* Navbar */}
      <nav className="sticky top-0 z-30 bg-black/90 border-b border-rebel-red backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-rebel-red rounded-lg p-1 -ml-1 transition-opacity hover:opacity-80"
              aria-label="Scroll to top"
            >
              <div className="bg-rebel-red p-1.5 rounded-md shadow-[0_0_15px_rgba(220,38,38,0.5)]">
                <Skull className="w-6 h-6 text-black" aria-hidden="true" />
              </div>
              <span className="text-white font-bold text-xl tracking-tighter uppercase font-mono">anti<span className="text-rebel-red">TAPS</span></span>
            </button>
            {/* Simple Time Display */}
            <div className="hidden md:block text-gray-400 text-xs font-mono" aria-label="System Time">
               SYS_TIME: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" role="main">
        
        {/* Header Section */}
        <div className="relative z-20 bg-gradient-to-r from-black to-gray-900 rounded-xl p-8 text-white border border-gray-800 shadow-2xl mb-8 group">
             {/* Abstract Decor - Clipped in separate container */}
             <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none" aria-hidden="true">
                 <div className="absolute top-0 right-0 -mt-10 -mr-10 w-60 h-60 bg-rebel-red opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-opacity duration-700"></div>
             </div>
             
             <div className="relative z-10">
                 <h1 className="text-4xl font-black mb-2 tracking-tight uppercase">Fight the System</h1>
                 <p className="text-gray-300 mb-8 max-w-2xl font-mono text-sm">
                   <span className="text-rebel-red" aria-hidden="true">&gt;&gt;</span> Real-time enforcement intel. Avoid tickets. Reclaim your campus parking.
                 </p>
                 
                 <div className="flex flex-col gap-4">
                    {/* Top Row: Search only */}
                    <div className="relative w-full">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
                      <input 
                        type="text" 
                        placeholder="Search target sector..." 
                        aria-label="Search target sector"
                        className="w-full pl-10 pr-4 py-3 rounded-lg text-white bg-gray-800 border border-gray-700 focus:outline-none focus:border-rebel-red focus:ring-1 focus:ring-rebel-red transition-all placeholder-gray-400 font-mono text-sm"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                      />
                    </div>
                    
                    {/* Bottom Row: Filters and Toggles */}
                    <div className="flex flex-wrap gap-3">
                        {/* Permit Filter */}
                        <div className="relative min-w-[180px] flex-1 sm:flex-none" ref={filterRef}>
                          <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            aria-haspopup="true"
                            aria-expanded={isFilterOpen}
                            aria-label="Filter by permit type"
                            className={`w-full pl-10 pr-4 py-3 rounded-lg text-white bg-gray-800 border transition-all duration-200 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-rebel-red
                              ${isFilterOpen ? 'border-rebel-red ring-1 ring-rebel-red bg-[#111827]' : 'border-gray-700 hover:border-gray-600 hover:bg-gray-700/50'}`}
                          >
                            <div className="flex items-center gap-2 overflow-hidden">
                              <Filter className="w-4 h-4 text-gray-400 absolute left-3" aria-hidden="true" />
                              <span className="font-mono text-sm truncate">{filterType === PermitType.ANY ? 'All Permits' : filterType}</span>
                            </div>
                            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0 ${isFilterOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                          </button>

                          {isFilterOpen && (
                            <div 
                              className="absolute top-full left-0 right-0 mt-2 bg-[#111827] border border-gray-700 rounded-lg shadow-2xl z-[100] overflow-hidden py-1 max-h-80 overflow-y-auto"
                              role="menu"
                            >
                              {sortedPermitTypes.map((t) => (
                                <button
                                  key={t}
                                  role="menuitem"
                                  onClick={() => {
                                    setFilterType(t);
                                    setSearchInput(''); // Clear search input
                                    setSearchQuery(''); // Clear actual search query
                                    setIsFilterOpen(false);
                                  }}
                                  className={`w-full text-left px-4 py-2.5 text-sm font-mono transition-colors flex items-center justify-between group focus:outline-none focus:bg-gray-800
                                    ${filterType === t ? 'text-white bg-rebel-red/10 border-l-2 border-rebel-red' : 'text-gray-300 hover:bg-gray-800 hover:text-white border-l-2 border-transparent'}`}
                                >
                                  <span className="truncate">{t === PermitType.ANY ? 'All Permits' : t}</span>
                                  {filterType === t && <div className="w-1.5 h-1.5 rounded-full bg-rebel-red shadow-[0_0_5px_rgba(220,38,38,0.8)] flex-shrink-0" />}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                         {/* Status Filter (New) */}
                         <div className="relative min-w-[160px] flex-1 sm:flex-none" ref={statusFilterRef}>
                          <button
                            onClick={() => setIsStatusFilterOpen(!isStatusFilterOpen)}
                            aria-haspopup="true"
                            aria-expanded={isStatusFilterOpen}
                            aria-label="Filter by enforcement status"
                            className={`w-full pl-10 pr-4 py-3 rounded-lg text-white bg-gray-800 border transition-all duration-200 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-rebel-red
                              ${isStatusFilterOpen ? 'border-rebel-red ring-1 ring-rebel-red bg-[#111827]' : 'border-gray-700 hover:border-gray-600 hover:bg-gray-700/50'}`}
                          >
                            <div className="flex items-center gap-2 overflow-hidden">
                              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                {statusFilter === 'ALL' && <CircleDashed className="w-4 h-4 text-gray-400" />}
                                {statusFilter === 'LIFTED' && <ShieldCheck className="w-4 h-4 text-emerald-400" />}
                                {statusFilter === 'ENFORCED' && <AlertTriangle className="w-4 h-4 text-rebel-red" />}
                              </div>
                              <span className="font-mono text-sm truncate">
                                {statusFilter === 'ALL' ? 'Any Status' : statusFilter === 'LIFTED' ? 'Safe Zones' : 'Enforced'}
                              </span>
                            </div>
                            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0 ${isStatusFilterOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                          </button>

                          {isStatusFilterOpen && (
                            <div 
                              className="absolute top-full left-0 right-0 mt-2 bg-[#111827] border border-gray-700 rounded-lg shadow-2xl z-[100] overflow-hidden py-1"
                              role="menu"
                            >
                                <button
                                  role="menuitem"
                                  onClick={() => { setStatusFilter('ALL'); setIsStatusFilterOpen(false); }}
                                  className={`w-full text-left px-4 py-2.5 text-sm font-mono transition-colors flex items-center justify-between group focus:outline-none focus:bg-gray-800
                                    ${statusFilter === 'ALL' ? 'text-white bg-gray-800 border-l-2 border-gray-400' : 'text-gray-300 hover:bg-gray-800 hover:text-white border-l-2 border-transparent'}`}
                                >
                                  <div className="flex items-center gap-2"><CircleDashed className="w-4 h-4" /> Any Status</div>
                                </button>
                                <button
                                  role="menuitem"
                                  onClick={() => { setStatusFilter('LIFTED'); setIsStatusFilterOpen(false); }}
                                  className={`w-full text-left px-4 py-2.5 text-sm font-mono transition-colors flex items-center justify-between group focus:outline-none focus:bg-gray-800
                                    ${statusFilter === 'LIFTED' ? 'text-white bg-emerald-900/30 border-l-2 border-emerald-500' : 'text-gray-300 hover:bg-gray-800 hover:text-white border-l-2 border-transparent'}`}
                                >
                                  <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-400" /> Safe Zones</div>
                                </button>
                                <button
                                  role="menuitem"
                                  onClick={() => { setStatusFilter('ENFORCED'); setIsStatusFilterOpen(false); }}
                                  className={`w-full text-left px-4 py-2.5 text-sm font-mono transition-colors flex items-center justify-between group focus:outline-none focus:bg-gray-800
                                    ${statusFilter === 'ENFORCED' ? 'text-white bg-rebel-red/10 border-l-2 border-rebel-red' : 'text-gray-300 hover:bg-gray-800 hover:text-white border-l-2 border-transparent'}`}
                                >
                                  <div className="flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-rebel-red" /> Enforced</div>
                                </button>
                            </div>
                          )}
                        </div>

                        {/* Recon Mode (Future Intel) Button */}
                        <button
                          onClick={() => setIsSimulationMode(!isSimulationMode)}
                          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-mono text-sm font-bold transition-all border focus:outline-none focus:ring-2 focus:ring-rebel-red flex-1 sm:flex-none
                            ${isSimulationMode 
                              ? 'bg-indigo-900/60 text-indigo-200 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.3)]' 
                              : 'bg-gray-800 text-gray-300 border-gray-700 hover:border-gray-500 hover:text-white'}`}
                        >
                           <CalendarClock className="w-5 h-5" />
                           <span className="whitespace-nowrap">Future Intel</span>
                        </button>

                        {/* Near Me Toggle */}
                        <button 
                            onClick={handleNearMeClick}
                            aria-pressed={sortByDistance}
                            aria-label="Find parking near my location"
                            className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-3 rounded-lg font-mono text-sm font-bold transition-all border focus:outline-none focus:ring-2 focus:ring-rebel-red flex-1 sm:flex-none
                            ${sortByDistance 
                                ? 'bg-rebel-red text-white border-rebel-red shadow-[0_0_10px_rgba(220,38,38,0.5)]' 
                                : 'bg-gray-800 text-gray-300 border-gray-700 hover:border-gray-500'}`}
                        >
                            <Navigation className={`w-4 h-4 ${sortByDistance ? 'fill-current' : ''}`} aria-hidden="true" />
                            <span className="whitespace-nowrap hidden sm:inline">{sortByDistance ? 'Near Me' : 'Find Near Me'}</span>
                        </button>

                        {/* Favorites Toggle */}
                        <button 
                            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                            aria-pressed={showFavoritesOnly}
                            aria-label={showFavoritesOnly ? "Show all lots" : "Show priority targets only"}
                            className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-3 rounded-lg font-mono text-sm font-bold transition-all border focus:outline-none focus:ring-2 focus:ring-rebel-red flex-none
                            ${showFavoritesOnly 
                                ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/50 shadow-[0_0_10px_rgba(234,179,8,0.2)]' 
                                : 'bg-gray-800 text-gray-300 border-gray-700 hover:border-gray-500 hover:text-white'}`}
                            title="Show Priorities Only"
                        >
                            <Star className={`w-4 h-4 ${showFavoritesOnly ? 'fill-current' : ''}`} aria-hidden="true" />
                        </button>
                    </div>

                    {/* Simulation Inputs (Conditional) */}
                    {isSimulationMode && (
                       <div className="mt-2 p-4 bg-indigo-950/40 border border-indigo-500/30 rounded-lg animate-in fade-in slide-in-from-top-2">
                          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
                              <div className="flex flex-col sm:flex-row flex-1 gap-3">
                                  
                                  {/* DATE PICKER */}
                                  <div className="relative flex-1" ref={datePickerRef}>
                                    <button 
                                      onClick={() => {
                                        setCalendarViewDate(new Date(simDate));
                                        setShowDatePicker(!showDatePicker);
                                        setShowTimePicker(false);
                                      }}
                                      className="w-full flex items-center gap-3 bg-black/40 rounded-lg px-4 py-3 border border-indigo-500/30 hover:border-indigo-500/60 transition-colors h-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                      <Calendar className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                                      <div className="flex flex-col min-w-0 text-left">
                                        <span className="text-[10px] text-indigo-200/80 font-bold leading-none mb-1">TARGET DATE</span>
                                        <span className="text-white text-sm font-mono font-bold leading-none truncate">{simDate}</span>
                                      </div>
                                    </button>

                                    {/* Custom Date Dropdown */}
                                    {showDatePicker && (
                                      <div 
                                        className="absolute top-full left-0 w-full mt-2 bg-[#111827] border border-gray-700 rounded-lg shadow-2xl z-[60] p-4"
                                        role="dialog"
                                        aria-label="Calendar Date Picker"
                                        aria-modal="true"
                                      >
                                         <div className="flex items-center justify-between mb-4">
                                            <button onClick={() => handleMonthChange(-1)} className="p-1 hover:bg-gray-800 rounded text-gray-400 hover:text-white" aria-label="Previous Month"><ChevronLeft className="w-4 h-4" /></button>
                                            <span className="font-bold text-white text-sm flex-1 text-center" role="heading" aria-level={2}>
                                                {calendarViewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                                            </span>
                                            <button onClick={() => handleMonthChange(1)} className="p-1 hover:bg-gray-800 rounded text-gray-400 hover:text-white" aria-label="Next Month"><ChevronRight className="w-4 h-4" /></button>
                                         </div>
                                         <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
                                            {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => <span key={d} className="text-gray-500 font-bold" aria-label={d}>{d}</span>)}
                                         </div>
                                         <div className="grid grid-cols-7 gap-1 text-center">
                                            {Array.from({ length: getFirstDayOfMonth(calendarViewDate) }).map((_, i) => <div key={`empty-${i}`} />)}
                                            {Array.from({ length: getDaysInMonth(calendarViewDate) }).map((_, i) => {
                                                const day = i + 1;
                                                const year = calendarViewDate.getFullYear();
                                                const month = calendarViewDate.getMonth();
                                                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                                const isSelected = simDate === dateStr;
                                                return (
                                                    <button 
                                                        key={day} 
                                                        onClick={() => handleDateSelect(day)}
                                                        className={`w-8 h-8 rounded flex items-center justify-center text-sm font-mono transition-colors mx-auto
                                                            ${isSelected ? 'bg-indigo-600 text-white font-bold shadow-sm' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
                                                        aria-label={`${day} ${calendarViewDate.toLocaleString('default', { month: 'long' })}`}
                                                        aria-pressed={isSelected}
                                                    >
                                                        {day}
                                                    </button>
                                                );
                                            })}
                                         </div>
                                      </div>
                                    )}
                                  </div>

                                  {/* TIME PICKER */}
                                  <div className="relative flex-1" ref={timePickerRef}>
                                    <button 
                                      onClick={() => {
                                        setShowTimePicker(!showTimePicker);
                                        setShowDatePicker(false);
                                      }}
                                      className="w-full flex items-center gap-3 bg-black/40 rounded-lg px-4 py-3 border border-indigo-500/30 hover:border-indigo-500/60 transition-colors h-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                      <Clock className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                                      <div className="flex flex-col min-w-0 text-left">
                                        <span className="text-[10px] text-indigo-200/80 font-bold leading-none mb-1">TARGET TIME</span>
                                        <span className="text-white text-sm font-mono font-bold leading-none truncate">{formatTime12Hour(simTime)}</span>
                                      </div>
                                    </button>

                                    {/* Custom Time Dropdown */}
                                    {showTimePicker && (
                                        <div 
                                          className="absolute top-full left-0 w-full mt-2 bg-[#111827] border border-gray-700 rounded-lg shadow-2xl z-[60] overflow-hidden flex h-60"
                                          role="dialog"
                                          aria-label="Time Picker"
                                          aria-modal="true"
                                        >
                                            {/* Hours */}
                                            <div className="w-1/3 overflow-y-auto border-r border-gray-700/50 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                                                <div className="p-2 text-center text-[10px] text-gray-500 font-bold uppercase sticky top-0 bg-[#111827] z-10 border-b border-gray-800">Hour</div>
                                                {hours.map(h => (
                                                    <button 
                                                        key={h}
                                                        onClick={() => handleTimeSelect('hour', h)}
                                                        className={`w-full py-2 text-sm font-mono text-center hover:bg-gray-800 transition-colors ${currentH12 === h ? 'bg-indigo-900/40 text-indigo-300 font-bold' : 'text-gray-300'}`}
                                                    >
                                                        {h}
                                                    </button>
                                                ))}
                                            </div>
                                            {/* Minutes */}
                                            <div className="w-1/3 overflow-y-auto border-r border-gray-700/50 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                                                <div className="p-2 text-center text-[10px] text-gray-500 font-bold uppercase sticky top-0 bg-[#111827] z-10 border-b border-gray-800">Minute</div>
                                                {minutes.map(m => (
                                                    <button 
                                                        key={m}
                                                        onClick={() => handleTimeSelect('minute', m)}
                                                        className={`w-full py-2 text-sm font-mono text-center hover:bg-gray-800 transition-colors ${currentM === m ? 'bg-indigo-900/40 text-indigo-300 font-bold' : 'text-gray-300'}`}
                                                    >
                                                        {String(m).padStart(2, '0')}
                                                    </button>
                                                ))}
                                            </div>
                                            {/* AM/PM */}
                                            <div className="w-1/3 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                                                <div className="p-2 text-center text-[10px] text-gray-500 font-bold uppercase sticky top-0 bg-[#111827] z-10 border-b border-gray-800">Period</div>
                                                {periods.map(p => (
                                                    <button 
                                                        key={p}
                                                        onClick={() => handleTimeSelect('period', p)}
                                                        className={`w-full py-2 text-sm font-mono text-center hover:bg-gray-800 transition-colors ${currentPeriod === p ? 'bg-indigo-900/40 text-indigo-300 font-bold' : 'text-gray-300'}`}
                                                    >
                                                        {p}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                  </div>
                              </div>

                              <button 
                                onClick={() => {
                                  setSimDate(new Date().toISOString().split('T')[0]);
                                  setSimTime(`${String(new Date().getHours()).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}`);
                                  setShowDatePicker(false);
                                  setShowTimePicker(false);
                                }}
                                className="px-4 py-3 rounded-lg border border-indigo-500/50 text-indigo-300 hover:text-white hover:bg-indigo-500/20 font-mono text-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase tracking-wide whitespace-nowrap shadow-sm"
                              >
                                Reset to Now
                              </button>
                          </div>
                       </div>
                    )}
                 </div>
             </div>
        </div>

        {/* Tactical Intel / Tips Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10" aria-label="Parking Tips">
            <article className="bg-black border border-gray-800 p-5 rounded-xl shadow-lg hover:border-gray-700 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                    <Clock className="w-5 h-5 text-rebel-red" aria-hidden="true" />
                    <h3 className="font-bold text-white uppercase tracking-wider text-sm">The 4:30 Lift</h3>
                </div>
                <p className="text-gray-300 text-xs leading-relaxed font-mono">
                    Most Red/Orange restrictions lift at <span className="text-white font-bold">4:30 PM</span>. If you arrive at 4:20 PM, wait. TAPS patrols heavily right before the buzzer to catch early arrivals.
                </p>
            </article>
            
            <article className="bg-black border border-gray-800 p-5 rounded-xl shadow-lg hover:border-gray-700 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                    <Zap className="w-5 h-5 text-rebel-red" aria-hidden="true" />
                    <h3 className="font-bold text-white uppercase tracking-wider text-sm">Flashers = Targets</h3>
                </div>
                <p className="text-gray-300 text-xs leading-relaxed font-mono">
                    Hazard lights are not a "pause button." They act as a beacon for TAPS. Never leave your car unattended in a fire lane or bus loop, even for "just a minute."
                </p>
            </article>

            <article className="bg-black border border-gray-800 p-5 rounded-xl shadow-lg hover:border-gray-700 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                    <AlertTriangle className="w-5 h-5 text-rebel-red" aria-hidden="true" />
                    <h3 className="font-bold text-white uppercase tracking-wider text-sm">Verify Signage</h3>
                </div>
                <p className="text-gray-300 text-xs leading-relaxed font-mono">
                    Always verify physical signage at the lot entrance. Rules change due to events or construction. Do not rely solely on this app for enforcement data.
                </p>
            </article>

            <article className="bg-black border border-gray-800 p-5 rounded-xl shadow-lg hover:border-gray-700 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                    <Trophy className="w-5 h-5 text-rebel-red" aria-hidden="true" />
                    <h3 className="font-bold text-white uppercase tracking-wider text-sm">Game Day Protocol</h3>
                </div>
                <p className="text-gray-300 text-xs leading-relaxed font-mono">
                   On home football game days, standard "Lifted" statuses are void. Restrictions typically start <span className="text-white font-bold">3 hours before kickoff</span>. Unauthorized vehicles will be towed.
                </p>
            </article>
        </section>

        {/* Lots Grid */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-white flex items-center gap-3 uppercase tracking-wider">
                {getListTitle()}
                <span className="text-xs font-mono text-gray-900 bg-rebel-red px-2 py-0.5 rounded font-bold ml-3" aria-label={`${filteredLots.length} results`}>
                    {filteredLots.length}
                </span>
            </h2>
            {isSimulationMode && (
                <span className="text-xs text-indigo-300 font-mono mt-1 flex items-center gap-1">
                    <CalendarClock className="w-3 h-3"/> SIMULATION DATA: {targetDate.toLocaleString()}
                </span>
            )}
          </div>
        </div>

        {filteredLots.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredLots.map(lot => (
              <LotCard 
                key={lot.id} 
                lot={lot} 
                isFavorite={favorites.includes(lot.id)}
                onToggleFav={toggleFavorite}
                simulatedDate={isSimulationMode ? targetDate : undefined}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-900/50 rounded-2xl border border-dashed border-gray-800">
            <p className="text-gray-300 text-lg font-mono">No targets found matching criteria.</p>
            <button 
              onClick={() => {setFilterType(PermitType.ANY); setStatusFilter('ALL'); setSearchInput(''); setSearchQuery(''); setSortByDistance(false); setShowFavoritesOnly(false); setIsSimulationMode(false);}}
              className="mt-4 text-rebel-red hover:text-white transition-colors font-medium uppercase text-sm tracking-widest border-b border-rebel-red pb-1 focus:outline-none focus:ring-2 focus:ring-rebel-red"
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