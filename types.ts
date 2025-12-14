
export enum PermitType {
  RED = 'Red',
  RED_1 = 'Red 1',
  RED_3 = 'Red 3',
  ORANGE = 'Orange',
  BLUE = 'Blue',
  GREEN = 'Green',
  BROWN = 'Brown',
  MEDICAL = 'Medical',
  PARK_AND_RIDE = 'Park & Ride',
  ANY = 'Any',
  NO_DECAL = 'No Decal Required',
  SILVER = 'Silver',
  GOLD = 'Gold',
}

export enum OccupancyStatus {
  AVAILABLE = 'Available',
  FULL = 'Full',
  CLOSING_SOON = 'Closing Soon'
}

export enum EnforcementState {
  LIFTED = 'LIFTED',
  ENFORCED = 'ENFORCED',
  CLOSED = 'CLOSED',
  RISK = 'RISK' // Closing soon (within 60 mins of enforcement start)
}

export interface Schedule {
  monFri: string;
  sat: string;
  sun: string;
}

export interface ParkingLot {
  id: string;
  name: string;
  permitTypes: PermitType[];
  location: string;
  latitude: number;
  longitude: number;
  enforcementHours: string; // General description
  weekdayLifted: string;    // e.g., "After 4:30 PM"
  weekendLifted: string;    // e.g., "All Day"
  schedule: Schedule;       // Structured hours for UI
  image: string;            // URL for visual

  // New fields
  status: OccupancyStatus;
  currentFill: number; // 0-100
  lastUpdated?: string;
  distance?: number; // Calculated distance in miles
  
  // Optional field for Game Day specifics
  gameDayInfo?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

// --- HOLIDAY LOGIC ---

// Fixed holidays (Month is 0-indexed: 0=Jan, 11=Dec)
const FIXED_HOLIDAYS = [
  { month: 0, day: 1, name: "New Year's Day" },
  { month: 5, day: 19, name: "Juneteenth" },
  { month: 6, day: 4, name: "Independence Day" },
  { month: 10, day: 11, name: "Veterans Day" },
  { month: 11, day: 25, name: "Christmas Day" }
];

// Variable date holidays specific to UF academic calendar (e.g. Homecoming)
// These are hard to calculate algorithmically without a reference table.
const SPECIAL_OBSERVATIONS = [
  '2024-10-04', // UF Homecoming 2024
  '2025-10-03', // Estimated Homecoming 2025 (placeholder)
  '2024-12-26', // Day after Christmas often observed
  '2025-12-26', 
];

const isObservedHoliday = (date: Date, month: number, day: number): boolean => {
  const currentMonth = date.getMonth();
  const currentDay = date.getDate();
  const dayOfWeek = date.getDay(); // 0=Sun, 6=Sat

  // Exact match
  if (currentMonth === month && currentDay === day) return true;

  // Observed logic:
  // If holiday falls on Saturday, observed on Friday
  if (dayOfWeek === 5) { // Checking if today is Friday (observed)
     // It is observed if the actual holiday (month/day) is tomorrow (Saturday)
     const tomorrow = new Date(date);
     tomorrow.setDate(currentDay + 1);
     if (tomorrow.getMonth() === month && tomorrow.getDate() === day) return true;
  }

  // If holiday falls on Sunday, observed on Monday
  if (dayOfWeek === 1) { // Checking if today is Monday (observed)
    // It is observed if the actual holiday was yesterday (Sunday)
    const yesterday = new Date(date);
    yesterday.setDate(currentDay - 1);
    if (yesterday.getMonth() === month && yesterday.getDate() === day) return true;
  }

  return false;
};

const isFloatingHoliday = (date: Date): boolean => {
  const month = date.getMonth();
  const day = date.getDate();
  const dayOfWeek = date.getDay();

  // MLK Jr. Day: 3rd Monday in Jan
  if (month === 0 && dayOfWeek === 1) {
    if (day >= 15 && day <= 21) return true;
  }

  // Memorial Day: Last Monday in May
  if (month === 4 && dayOfWeek === 1) {
    const nextWeek = new Date(date);
    nextWeek.setDate(day + 7);
    if (nextWeek.getMonth() !== 4) return true;
  }

  // Labor Day: 1st Monday in Sept
  if (month === 8 && dayOfWeek === 1) {
    if (day <= 7) return true;
  }

  // Thanksgiving: 4th Thursday in Nov
  if (month === 10 && dayOfWeek === 4) {
    if (day >= 22 && day <= 28) return true;
  }

  // Friday after Thanksgiving
  if (month === 10 && dayOfWeek === 5) {
    if (day >= 23 && day <= 29) return true;
  }

  return false;
};

const isUniversityHoliday = (date: Date): boolean => {
  // Check special manual dates
  const dateStr = date.toISOString().split('T')[0];
  if (SPECIAL_OBSERVATIONS.includes(dateStr)) return true;

  // Check floating holidays
  if (isFloatingHoliday(date)) return true;

  // Check fixed & observed holidays
  return FIXED_HOLIDAYS.some(h => isObservedHoliday(date, h.month, h.day));
};

// Advanced logic to determine detailed state
export const getEnforcementState = (lot: ParkingLot, customTime?: Date): EnforcementState => {
  const now = customTime || new Date();
  const day = now.getDay(); // 0 = Sunday, 6 = Saturday
  const hour = now.getHours();
  const minute = now.getMinutes();
  const timeVal = hour + minute / 60;
  const isWeekend = day === 0 || day === 6;
  const isHoliday = isUniversityHoliday(now);

  // 1. Determine Effective Schedule Day
  // Holidays strictly follow SUNDAY enforcement rules for closures.
  let scheduleText = lot.schedule.monFri;
  if (isHoliday) {
    scheduleText = lot.schedule.sun;
  } else if (day === 0) {
    scheduleText = lot.schedule.sun;
  } else if (day === 6) {
    scheduleText = lot.schedule.sat;
  }

  // 2. Check Explicit "Closed" Status
  if (scheduleText.toLowerCase().includes('closed')) {
    return EnforcementState.CLOSED;
  }

  // 3. 24/7 Enforcement (Priority over Holidays)
  // 24/7 lots (Red 1, Service Drives) are NEVER lifted, even on Christmas.
  if (lot.enforcementHours.includes('24/7')) {
    return EnforcementState.ENFORCED;
  }
  
  // 4. Paid Parking Exception
  // Generally, Paid Parking is enforced M-F 7:30-4:30 unless marked otherwise.
  // Shands (Garage 1) is a notable exception often enforced 24/7 or having separate rules.
  if (lot.enforcementHours.toLowerCase().includes('paid')) {
     // Hardcoded safety for Shands/Hospital areas which are aggressive
     // Garage 1 (id 17) logic: Lifted on weekends, Enforced otherwise (M-F)
     if (lot.id === '17') {
         if (isWeekend) return EnforcementState.LIFTED;
         return EnforcementState.ENFORCED;
     }
     
     // For others (Reitz/Welcome Center), lifted on holidays/weekends
     if (isWeekend || isHoliday) return EnforcementState.LIFTED; 
     return EnforcementState.ENFORCED;
  }

  // 5. Holiday Lift
  // If not Closed and not 24/7, University Holidays lift decal restrictions.
  if (isHoliday) return EnforcementState.LIFTED;

  // 6. Weekend Lift
  if (isWeekend) return EnforcementState.LIFTED;

  // 7. Weekday Time Logic
  // Extract end time. Start is usually 7:30 AM (7.5).
  const start = 7.5;
  let end = 16.5; // 4:30 PM default
  
  if (lot.enforcementHours.includes('3:30')) end = 15.5;
  else if (lot.enforcementHours.includes('5:30')) end = 17.5;
  else if (lot.enforcementHours.includes('4:30')) end = 16.5;
  
  // Logic
  // If before start:
  if (timeVal < start) {
      // If within 1 hour of start?
      if (timeVal >= start - 1.0) return EnforcementState.RISK; // "Enforcement starts soon"
      return EnforcementState.LIFTED; 
  }
  // If during enforcement:
  if (timeVal >= start && timeVal < end) {
      return EnforcementState.ENFORCED;
  }
  // If after enforcement:
  return EnforcementState.LIFTED;
};

// Shared logic to check if a lot is currently lifted (no decal required)
// Returns true for LIFTED or RISK (since it is technically lifted right now)
export const isLotLifted = (lot: ParkingLot, customTime?: Date): boolean => {
  const state = getEnforcementState(lot, customTime);
  return state === EnforcementState.LIFTED || state === EnforcementState.RISK;
};
