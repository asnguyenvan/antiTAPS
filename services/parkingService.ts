import { ParkingLot, OccupancyStatus } from '../types';
import { INITIAL_LOTS } from '../constants';

// In a production environment, this would fetch from https://taps.ufl.edu/api/lots
// Since we cannot access private APIs or cross-origin endpoints here, we simulate the live feed.

export const fetchLiveParkingData = async (): Promise<ParkingLot[]> => {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 600));

  return INITIAL_LOTS.map(lot => {
    // Simulate live fluctuations in parking density
    // In a real app, this data comes directly from sensors/cameras
    const randomFluctuation = Math.floor(Math.random() * 5) - 2; // -2% to +2% change
    let newFill = lot.currentFill + randomFluctuation;
    
    // Clamp values
    newFill = Math.max(0, Math.min(100, newFill));

    // Determine status based on live fill rate
    let newStatus = OccupancyStatus.AVAILABLE;
    if (newFill >= 95) {
      newStatus = OccupancyStatus.FULL;
    } else if (newFill >= 85) {
      newStatus = OccupancyStatus.CLOSING_SOON;
    }

    return {
      ...lot,
      currentFill: newFill,
      status: newStatus,
      lastUpdated: 'Live'
    };
  });
};