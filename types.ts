export enum PermitType {
  RED_1 = 'Red 1',
  RED_3 = 'Red 3',
  ORANGE = 'Orange',
  BLUE = 'Blue',
  GREEN = 'Green',
  PARK_AND_RIDE = 'Park & Ride',
  ANY = 'Any',
  NO_DECAL = 'No Decal Required'
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
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

// Advanced logic to determine detailed state
export const getEnforcementState = (lot: ParkingLot): EnforcementState => {
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday, 6 = Saturday
  const hour = now.getHours();
  const minute = now.getMinutes();
  const timeVal = hour + minute / 60;
  const isWeekend = day === 0 || day === 6;

  // 1. Check Explicit Closed Schedule
  const scheduleText = isWeekend ? (day === 0 ? lot.schedule.sun : lot.schedule.sat) : lot.schedule.monFri;
  if (scheduleText.toLowerCase() === 'closed') return EnforcementState.CLOSED;

  // 2. 24/7 or Paid (Safe default: Enforced)
  if (lot.enforcementHours.includes('24/7')) return EnforcementState.ENFORCED;
  if (lot.enforcementHours.toLowerCase().includes('paid')) return EnforcementState.ENFORCED;

  // 3. Parse Standard Hours (M-F 7:30 - X:30)
  // If weekend and not closed/24-7, it is Lifted.
  if (isWeekend) return EnforcementState.LIFTED;

  // Weekday Logic
  // Extract end time. Start is usually 7:30 AM (7.5).
  const start = 7.5;
  let end = 16.5; // 4:30 PM default
  
  if (lot.enforcementHours.includes('3:30')) end = 15.5;
  else if (lot.enforcementHours.includes('5:30')) end = 17.5;
  else if (lot.enforcementHours.includes('4:30')) end = 16.5;
  else {
      // If we can't parse, default Enforced for safety
      return EnforcementState.ENFORCED;
  }

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
export const isLotLifted = (lot: ParkingLot): boolean => {
  const state = getEnforcementState(lot);
  return state === EnforcementState.LIFTED || state === EnforcementState.RISK;
};