import { ParkingLot, PermitType, OccupancyStatus } from './types';

export const INITIAL_LOTS: ParkingLot[] = [
  {
    id: '1',
    name: 'Garage 5 (G5/Gale Lemerand)',
    permitTypes: [PermitType.RED_1, PermitType.BLUE],
    location: 'Gale Lemerand Dr',
    latitude: 29.6416,
    longitude: -82.3524,
    enforcementHours: 'M-F 7:30 AM - 4:30 PM',
    weekdayLifted: 'After 4:30 PM',
    weekendLifted: 'Closed',
    schedule: {
        monFri: '7:30 AM – 4:30 PM',
        sat: 'Closed',
        sun: 'Closed'
    },
    status: OccupancyStatus.AVAILABLE,
    currentFill: 45,
    image: 'https://streetviewpixels-pa.googleapis.com/v1/thumbnail?cb_client=maps_sv.tactile&w=900&h=600&pitch=-5.921116584237666&panoid=QTFAqEvryvngWex0YpVgvw&yaw=296.61781936827987' // Multi-level concrete garage
  },
  {
    id: '2',
    name: 'O\'Connell Center Lot (ODome)',
    permitTypes: [PermitType.ORANGE, PermitType.RED_1],
    location: 'Stadium Rd',
    latitude: 29.6494,
    longitude: -82.3512,
    enforcementHours: 'M-F 7:30 AM - 3:30 PM',
    weekdayLifted: 'After 3:30 PM',
    weekendLifted: 'All Day',
    schedule: {
        monFri: '7:30 AM – 3:30 PM',
        sat: 'Lifted',
        sun: 'Lifted'
    },
    status: OccupancyStatus.AVAILABLE,
    currentFill: 60,
    image: 'https://www.gainesvillesportscommission.com/wp-content/uploads/2019/02/OConnell-Center-Entrance-2.jpg' // Large open lot
  },
  {
    id: '3',
    name: 'Commuter Lot (G5-side/Gale Lemerand)',
    permitTypes: [PermitType.GREEN, PermitType.PARK_AND_RIDE],
    location: 'Gale Lemerand Dr',
    latitude: 29.6410,
    longitude: -82.3520,
    enforcementHours: 'M-F 7:30 AM - 4:30 PM',
    weekdayLifted: 'After 4:30 PM',
    weekendLifted: 'All Day',
    schedule: {
        monFri: '7:30 AM – 4:30 PM',
        sat: 'Lifted',
        sun: 'Lifted'
    },
    status: OccupancyStatus.AVAILABLE,
    currentFill: 30,
    image: 'https://streetviewpixels-pa.googleapis.com/v1/thumbnail?cb_client=maps_sv.tactile&w=900&h=600&pitch=5.370149790094274&panoid=KlgxVDh1WyAjhCGbQfo71A&yaw=256.3141820735443' // Open commuter lot
  },
  {
    id: '4',
    name: 'Garage 14 (G14/Dental)',
    permitTypes: [PermitType.BLUE, PermitType.RED_3],
    location: 'Center Dr',
    latitude: 29.6393,
    longitude: -82.3444,
    enforcementHours: 'M-F 7:30 AM - 5:30 PM',
    weekdayLifted: 'After 5:30 PM',
    weekendLifted: 'All Day',
    schedule: {
        monFri: '7:30 AM – 5:30 PM',
        sat: 'Lifted',
        sun: 'Lifted'
    },
    status: OccupancyStatus.AVAILABLE,
    currentFill: 55,
    image: 'https://parksmart.gbci.org/sites/default/files/garage_14__3.jpg' // Modern concrete structure
  },
  {
    id: '5',
    name: 'Murphree Area',
    permitTypes: [PermitType.RED_1],
    location: 'Fletcher Dr',
    latitude: 29.6508,
    longitude: -82.3463,
    enforcementHours: '24/7',
    weekdayLifted: 'Never',
    weekendLifted: 'Never',
    schedule: {
        monFri: '24 Hours',
        sat: '24 Hours',
        sun: '24 Hours'
    },
    status: OccupancyStatus.CLOSING_SOON,
    currentFill: 88,
    image: 'https://streetviewpixels-pa.googleapis.com/v1/thumbnail?cb_client=maps_sv.tactile&w=900&h=600&pitch=0&panoid=3w0U3TjsT09iMk7i3mlx7A&yaw=249.47334' // Brick collegiate buildings
  },
  {
    id: '6',
    name: 'Garage 8 (G8/Norman Hall)',
    permitTypes: [PermitType.RED_3, PermitType.ORANGE],
    location: 'SW 8th Ave',
    latitude: 29.645517261853584,
    longitude: -82.33751028766038,
    enforcementHours: 'M-F 7:30 AM - 4:30 PM',
    weekdayLifted: 'After 4:30 PM',
    weekendLifted: 'All Day',
    schedule: {
        monFri: '7:30 AM – 4:30 PM',
        sat: 'Lifted',
        sun: 'Lifted'
    },
    status: OccupancyStatus.AVAILABLE,
    currentFill: 70,
    image: 'https://streetviewpixels-pa.googleapis.com/v1/thumbnail?cb_client=maps_sv.tactile&w=900&h=600&pitch=0&panoid=Wn7WL6tw3xpyWI_2N12vvw&yaw=354.25314' // Garage interior
  },
  {
    id: '7',
    name: 'Southwest Rec Center',
    permitTypes: [PermitType.PARK_AND_RIDE],
    location: 'Hull Rd',
    latitude: 29.6366,
    longitude: -82.3686,
    enforcementHours: 'M-F 7:30 AM - 3:30 PM',
    weekdayLifted: 'After 3:30 PM',
    weekendLifted: 'All Day',
    schedule: {
        monFri: '7:30 AM – 3:30 PM',
        sat: 'Lifted',
        sun: 'Lifted'
    },
    status: OccupancyStatus.AVAILABLE,
    currentFill: 20,
    image: 'https://www.gainesville.com/gcdn/authoring/2010/08/23/NTGS/ghows_image-LK-b42ab5ae-3920-4501-961c-26e708fe60ac.jpeg' // Gym/Rec center vibe
  },
  {
    id: '8',
    name: 'Flavet Field',
    permitTypes: [PermitType.GREEN],
    location: 'Woodlawn Dr',
    latitude: 29.6467,
    longitude: -82.3543,
    enforcementHours: 'M-F 7:30 AM - 4:30 PM',
    weekdayLifted: 'After 4:30 PM',
    weekendLifted: 'All Day',
    schedule: {
        monFri: '7:30 AM – 4:30 PM',
        sat: 'Lifted',
        sun: 'Lifted'
    },
    status: OccupancyStatus.AVAILABLE,
    currentFill: 40,
    image: 'https://streetviewpixels-pa.googleapis.com/v1/thumbnail?cb_client=maps_sv.tactile&w=900&h=600&pitch=1.719655145639564&panoid=JxHQC7ZVP0h0V7s35GEVjA&yaw=41.88947854957639' // Grass field
  },
  {
    id: '9',
    name: 'Garage 4 (Museum Rd)',
    permitTypes: [PermitType.RED_3, PermitType.ORANGE],
    location: 'Museum Rd & Newell Dr',
    latitude: 29.6443,
    longitude: -82.3468,
    enforcementHours: 'M-F 7:30 AM - 4:30 PM',
    weekdayLifted: 'After 4:30 PM',
    weekendLifted: 'All Day',
    schedule: {
        monFri: '7:30 AM – 4:30 PM',
        sat: 'Lifted',
        sun: 'Lifted'
    },
    status: OccupancyStatus.AVAILABLE,
    currentFill: 75,
    image: 'data:image/jpeg;base64,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' // Concrete garage
  },
  {
    id: '10',
    name: 'Garage 9 (Archer Rd)',
    permitTypes: [PermitType.BLUE],
    location: 'Archer Rd',
    latitude: 29.6368,
    longitude: -82.3429,
    enforcementHours: 'M-F 7:30 AM - 4:30 PM',
    weekdayLifted: 'After 4:30 PM',
    weekendLifted: 'All Day',
    schedule: {
        monFri: '7:30 AM – 4:30 PM',
        sat: 'Lifted',
        sun: 'Lifted'
    },
    status: OccupancyStatus.AVAILABLE,
    currentFill: 50,
    image: 'https://lh3.googleusercontent.com/gps-cs-s/AG0ilSxHuSeZUiYFJgPJzubeO0L-bRjcn-GbH-7OhRwbU-98CkiPYuZxRUxp1QBNEikkSgU4UldPcNv2EcFFXe_kCkjkFyPP9-vAZqlwYpyZXorAk7Rf_kjJfHZOUDw5K2a_C4lb1iva=s1360-w1360-h1020-rw' // Garage structure
  },
  {
    id: '11',
    name: 'Levin Law (Garage 6)',
    permitTypes: [PermitType.GREEN, PermitType.RED_3],
    location: 'Village Dr',
    latitude: 29.6482,
    longitude: -82.3582,
    enforcementHours: 'M-F 7:30 AM - 3:30 PM',
    weekdayLifted: 'After 3:30 PM',
    weekendLifted: 'All Day',
    schedule: {
        monFri: '7:30 AM – 3:30 PM',
        sat: 'Lifted',
        sun: 'Lifted'
    },
    status: OccupancyStatus.AVAILABLE,
    currentFill: 65,
    image: 'data:image/jpeg;base64,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' // Law building style
  },
  {
    id: '12',
    name: 'Fraternity Row',
    permitTypes: [PermitType.RED_1],
    location: 'Fraternity Dr',
    latitude: 29.6460,
    longitude: -82.3560,
    enforcementHours: '24/7',
    weekdayLifted: 'Never',
    weekendLifted: 'Never',
    schedule: {
        monFri: '24 Hours',
        sat: '24 Hours',
        sun: '24 Hours'
    },
    status: OccupancyStatus.FULL,
    currentFill: 95,
    image: 'https://scorpioco.com/wp-content/uploads/2020/04/HeaderImage_NightShot.jpg' // Residential street/house
  },
  {
    id: '13',
    name: 'Sorority Row',
    permitTypes: [PermitType.RED_1],
    location: 'Sorority Dr',
    latitude: 29.6445,
    longitude: -82.3395,
    enforcementHours: '24/7',
    weekdayLifted: 'Never',
    weekendLifted: 'Never',
    schedule: {
        monFri: '24 Hours',
        sat: '24 Hours',
        sun: '24 Hours'
    },
    status: OccupancyStatus.CLOSING_SOON,
    currentFill: 92,
    image: 'https://scorpioco.com/wp-content/uploads/2018/12/Scorpio_Delta_Gamma_Ext_1343-2-1024x683.jpg' // Brick buildings/houses
  },
  {
    id: '14',
    name: 'Hume Hall Lot',
    permitTypes: [PermitType.RED_1],
    location: 'Gale Lemerand Dr',
    latitude: 29.6450,
    longitude: -82.3526,
    enforcementHours: '24/7',
    weekdayLifted: 'Never',
    weekendLifted: 'Never',
    schedule: {
        monFri: '24 Hours',
        sat: '24 Hours',
        sun: '24 Hours'
    },
    status: OccupancyStatus.CLOSING_SOON,
    currentFill: 85,
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800' // Dorm exterior
  },
  {
    id: '15',
    name: 'Graham Area',
    permitTypes: [PermitType.RED_1],
    location: 'Radio Rd',
    latitude: 29.6425,
    longitude: -82.3533,
    enforcementHours: '24/7',
    weekdayLifted: 'Never',
    weekendLifted: 'Never',
    schedule: {
        monFri: '24 Hours',
        sat: '24 Hours',
        sun: '24 Hours'
    },
    status: OccupancyStatus.CLOSING_SOON,
    currentFill: 85,
    image: 'https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&q=80&w=800' // Campus residential area
  },
  {
    id: '16',
    name: 'Garage 3 (Criser Hall)',
    permitTypes: [PermitType.ORANGE, PermitType.BLUE],
    location: 'Stadium Rd',
    latitude: 29.6490,
    longitude: -82.3465,
    enforcementHours: 'M-F 7:30 AM - 5:30 PM',
    weekdayLifted: 'After 5:30 PM',
    weekendLifted: 'All Day',
    schedule: {
        monFri: '7:30 AM – 5:30 PM',
        sat: 'Lifted',
        sun: 'Lifted'
    },
    status: OccupancyStatus.AVAILABLE,
    currentFill: 60,
    image: 'https://www.uflib.ufl.edu/ufarch/parking7.jpg' // Parking structure
  },
  {
    id: '17',
    name: 'Maguire Village',
    permitTypes: [PermitType.GREEN],
    location: 'Village Dr',
    latitude: 29.6385,
    longitude: -82.3600,
    enforcementHours: 'M-F 7:30 AM - 3:30 PM',
    weekdayLifted: 'After 3:30 PM',
    weekendLifted: 'All Day',
    schedule: {
        monFri: '7:30 AM – 3:30 PM',
        sat: 'Lifted',
        sun: 'Lifted'
    },
    status: OccupancyStatus.AVAILABLE,
    currentFill: 30,
    image: 'https://cdn.mydorm.com/images/6a72250e-f207-4a68-92bd-a0e9244e6946.jpg' // Residential/Apartments
  },
  {
    id: '18',
    name: 'Garage 1 (Shands/Visitor)',
    permitTypes: [PermitType.BLUE, PermitType.ANY],
    location: 'Archer Rd',
    latitude: 29.6395,
    longitude: -82.3418,
    enforcementHours: 'Paid Parking M-F',
    weekdayLifted: 'Varies',
    weekendLifted: 'Varies',
    schedule: {
        monFri: 'Paid Parking',
        sat: 'Paid Parking',
        sun: 'Paid Parking'
    },
    status: OccupancyStatus.FULL,
    currentFill: 98,
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800' // Hospital/Medical buildings
  },
  {
    id: '19',
    name: 'Garage 13 (Lakeside)',
    permitTypes: [PermitType.RED_3],
    location: 'SW 62nd Blvd',
    latitude: 29.6360,
    longitude: -82.3700,
    enforcementHours: 'M-F 7:30 AM - 4:30 PM',
    weekdayLifted: 'After 4:30 PM',
    weekendLifted: 'All Day',
    schedule: {
        monFri: '7:30 AM – 4:30 PM',
        sat: 'Lifted',
        sun: 'Lifted'
    },
    status: OccupancyStatus.AVAILABLE,
    currentFill: 40,
    image: 'https://www.gainesville.com/gcdn/authoring/2018/10/30/NTGS/ghows-LK-7974e364-d7f6-4bb5-e053-0100007f7979-86189a19.jpeg' // Structure
  },
  {
    id: '20',
    name: 'Rawlings Hall',
    permitTypes: [PermitType.RED_1],
    location: 'Newell Dr',
    latitude: 29.6470,
    longitude: -82.3435,
    enforcementHours: '24/7',
    weekdayLifted: 'Never',
    weekendLifted: 'Never',
    schedule: {
        monFri: '24 Hours',
        sat: '24 Hours',
        sun: '24 Hours'
    },
    status: OccupancyStatus.CLOSING_SOON,
    currentFill: 80,
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800' // Brick Dorm
  },
  {
    id: '21',
    name: 'Keys Complex',
    permitTypes: [PermitType.RED_1],
    location: 'Stadium Rd',
    latitude: 29.6480,
    longitude: -82.3500,
    enforcementHours: '24/7',
    weekdayLifted: 'Never',
    weekendLifted: 'Never',
    schedule: {
        monFri: '24 Hours',
        sat: '24 Hours',
        sun: '24 Hours'
    },
    status: OccupancyStatus.AVAILABLE,
    currentFill: 80,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnc_ZOoOofIE5od1EG-fTRTsH4ffdha23dKg&s' // Residential buildings
  },
  {
    id: '22',
    name: 'Springs Complex',
    permitTypes: [PermitType.RED_1],
    location: 'Radio Rd',
    latitude: 29.6420,
    longitude: -82.3560,
    enforcementHours: '24/7',
    weekdayLifted: 'Never',
    weekendLifted: 'Never',
    schedule: {
        monFri: '24 Hours',
        sat: '24 Hours',
        sun: '24 Hours'
    },
    status: OccupancyStatus.AVAILABLE,
    currentFill: 75,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800' // Campus housing
  },
  {
    id: '23',
    name: 'Beaty Towers',
    permitTypes: [PermitType.RED_1],
    location: 'Museum Rd',
    latitude: 29.6440,
    longitude: -82.3400,
    enforcementHours: '24/7',
    weekdayLifted: 'Never',
    weekendLifted: 'Never',
    schedule: {
        monFri: '24 Hours',
        sat: '24 Hours',
        sun: '24 Hours'
    },
    status: OccupancyStatus.CLOSING_SOON,
    currentFill: 85,
    image: 'https://housing.ufl.edu/wp-content/uploads/2022/02/2012_BEATY_sky_blue_exterior_05_22_0134_POST-scaled.jpg' // Tall towers
  },
  {
    id: '24',
    name: 'Jennings Hall',
    permitTypes: [PermitType.RED_1],
    location: 'Museum Rd',
    latitude: 29.6440,
    longitude: -82.3410,
    enforcementHours: '24/7',
    weekdayLifted: 'Never',
    weekendLifted: 'Never',
    schedule: {
        monFri: '24 Hours',
        sat: '24 Hours',
        sun: '24 Hours'
    },
    status: OccupancyStatus.AVAILABLE,
    currentFill: 80,
    image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80&w=800' // Dorm area
  },
  {
    id: '25',
    name: 'Broward Hall',
    permitTypes: [PermitType.RED_1],
    location: 'Inner Rd',
    latitude: 29.6465,
    longitude: -82.3415,
    enforcementHours: '24/7',
    weekdayLifted: 'Never',
    weekendLifted: 'Never',
    schedule: {
        monFri: '24 Hours',
        sat: '24 Hours',
        sun: '24 Hours'
    },
    status: OccupancyStatus.AVAILABLE,
    currentFill: 80,
    image: 'https://images.unsplash.com/photo-1592595896551-12b371d546d5?auto=format&fit=crop&q=80&w=800' // Campus residential
  },
  {
    id: '26',
    name: 'Reitz Union Welcome Center',
    permitTypes: [PermitType.ANY],
    location: 'Museum Rd',
    latitude: 29.6463,
    longitude: -82.3478,
    enforcementHours: 'Paid Parking / Event Parking',
    weekdayLifted: 'Paid Only',
    weekendLifted: 'Varies',
    schedule: {
        monFri: '7:30 AM – 4:30 PM (Paid)',
        sat: 'Varies',
        sun: 'Varies'
    },
    status: OccupancyStatus.AVAILABLE,
    currentFill: 65,
    image: 'https://media-cdn.tripadvisor.com/media/photo-s/03/a1/5c/f9/reitz-union-hotel-uf.jpg' // Student Union/University
  }
];