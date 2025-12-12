import { ParkingLot, PermitType, OccupancyStatus } from './types';

export const INITIAL_LOTS: ParkingLot[] = [
  {
    id: '1',
    name: 'Garage 5 (G5/Gale Lemerand)',
    permitTypes: [PermitType.RED_1, PermitType.BLUE],
    location: 'Gale Lemerand Dr',
    latitude: 29.6433,
    longitude: -82.3511,
    enforcementHours: 'M-F 7:30 AM - 4:30 PM',
    weekdayLifted: 'After 4:30 PM',
    weekendLifted: 'All Day',
    schedule: {
        monFri: '7:30 AM – 4:30 PM',
        sat: 'Lifted',
        sun: 'Lifted'
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
    enforcementHours: 'M-F 7:30 AM - 4:30 PM',
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
    latitude: 29.642272,
    longitude: -82.350842,
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
    permitTypes: [PermitType.RED],
    location: 'Woodlawn Dr',
    latitude: 29.6467,
    longitude: -82.3546,
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
    name: 'Garage 4 (G4/Honors)',
    permitTypes: [PermitType.ORANGE],
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
    image: 'https://streetviewpixels-pa.googleapis.com/v1/thumbnail?cb_client=maps_sv.tactile&w=900&h=600&pitch=-11.895186508169417&panoid=EbLRV0NIqP_VWga95CxHNg&yaw=316.56313390229036' // Concrete garage
  },
  {
    id: '10',
    name: 'Levin Law (Law School)',
    permitTypes: [PermitType.GREEN, PermitType.ORANGE],
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
    image: 'https://streetviewpixels-pa.googleapis.com/v1/thumbnail?cb_client=maps_sv.tactile&w=900&h=600&pitch=-4.373719800984929&panoid=RgEIH3DjJ3rxomyxE2q37Q&yaw=3.6774936017288957' // Law building style
  },
  {
    id: '11',
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
    id: '12',
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
    name: 'East Hall Area',
    permitTypes: [PermitType.ORANGE],
    location: 'Radio Rd',
    latitude: 29.6467823,
    longitude: -82.3499352,
    enforcementHours: '24/7',
    weekdayLifted: 'Never',
    weekendLifted: 'Lifted',
    schedule: {
        monFri: '7:30 AM – 4:30 PM',
        sat: 'Lifted',
        sun: 'Lifted'
    },
    status: OccupancyStatus.CLOSING_SOON,
    currentFill: 85,
    image: 'https://streetviewpixels-pa.googleapis.com/v1/thumbnail?cb_client=maps_sv.tactile&w=900&h=600&pitch=-1.695525310114789&panoid=llH1Lh_gVST9R7YjQYMO-Q&yaw=331.4040553846915' // Campus residential area
  },
  {
    id: '15',
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
    id: '16',
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
    id: '17',
    name: 'Garage 1 (G1/Shands/Visitor)',
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
    image: 'https://ufhealth.org/assets/images/stories/_1200x630_crop_center-center_82_line/Parking-Garage_MBF_IMG_9938.jpg' // Hospital/Medical buildings
  },
  {
    id: '18',
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
    id: '19',
    name: 'Rawlings Hall',
    permitTypes: [PermitType.RED_1],
    location: 'Newell Dr',
    latitude: 29.6470,
    longitude: -82.3435,
    enforcementHours: '24/7',
    weekdayLifted: 'Never',
    weekendLifted: 'Never',
    schedule: {
        monFri: '7:30 AM – 4:30 PM',
        sat: 'Lifted',
        sun: 'Lifted'
    },
    status: OccupancyStatus.CLOSING_SOON,
    currentFill: 80,
    image: 'https://streetviewpixels-pa.googleapis.com/v1/thumbnail?cb_client=maps_sv.tactile&w=900&h=600&pitch=-3.747338640795604&panoid=a64M-_qKN_IejcMBPA3_vg&yaw=49.92414638694365' // Brick Dorm
  },
  {
    id: '20',
    name: 'Keys Complex',
    permitTypes: [PermitType.RED_1],
    location: 'Stadium Rd',
    latitude: 29.6480,
    longitude: -82.3500,
    enforcementHours: '24/7',
    weekdayLifted: 'Never',
    weekendLifted: 'Never',
    schedule: {
        monFri: '7:30 AM – 4:30 PM',
        sat: 'Lifted',
        sun: 'Lifted'
    },
    status: OccupancyStatus.AVAILABLE,
    currentFill: 80,
    image: 'https://streetviewpixels-pa.googleapis.com/v1/thumbnail?cb_client=maps_sv.tactile&w=900&h=600&pitch=-5.322182555806947&panoid=TZyP0tjfsOlo8uy-TEQ7Bg&yaw=162.20136007196203' // Residential buildings
  },
  {
    id: '21',
    name: 'Springs Complex',
    permitTypes: [PermitType.RED_1],
    location: 'Radio Rd',
    latitude: 29.6420,
    longitude: -82.3560,
    enforcementHours: '24/7',
    weekdayLifted: 'Never',
    weekendLifted: 'Never',
    schedule: {
        monFri: '7:30 AM – 3:30 PM',
        sat: 'Lifted',
        sun: 'Lifted'
    },
    status: OccupancyStatus.AVAILABLE,
    currentFill: 75,
    image: 'https://streetviewpixels-pa.googleapis.com/v1/thumbnail?cb_client=maps_sv.tactile&w=900&h=600&pitch=-5.386509211370111&panoid=8RPQY_PI0bvQ8y8iSrkQ1Q&yaw=21.681040767400386' // Campus housing
  },
  {
    id: '22',
    name: 'Beaty Towers',
    permitTypes: [PermitType.RED_1],
    location: 'Museum Rd',
    latitude: 29.6440,
    longitude: -82.3400,
    enforcementHours: '24/7',
    weekdayLifted: 'Never',
    weekendLifted: 'Never',
    schedule: {
        monFri: '7:30 AM – 4:30 PM',
        sat: 'Lifted',
        sun: 'Lifted'
    },
    status: OccupancyStatus.CLOSING_SOON,
    currentFill: 85,
    image: 'https://housing.ufl.edu/wp-content/uploads/2022/02/2012_BEATY_sky_blue_exterior_05_22_0134_POST-scaled.jpg' // Tall towers
  },
  {
    id: '23',
    name: 'Jennings Hall',
    permitTypes: [PermitType.RED_1],
    location: 'Museum Rd',
    latitude: 29.6440,
    longitude: -82.3410,
    enforcementHours: '24/7',
    weekdayLifted: 'Never',
    weekendLifted: 'Never',
    schedule: {
        monFri: '7:30 AM – 4:30 PM',
        sat: 'Lifted',
        sun: 'Lifted'
    },
    status: OccupancyStatus.AVAILABLE,
    currentFill: 80,
    image: 'https://streetviewpixels-pa.googleapis.com/v1/thumbnail?cb_client=maps_sv.tactile&w=900&h=600&pitch=-5.7953140254754345&panoid=PSri6-OBgoNW_9swAs-EJw&yaw=165.87875884368702' // Dorm area
  },
  {
    id: '24',
    name: 'Broward Hall',
    permitTypes: [PermitType.RED_1],
    location: 'Inner Rd',
    latitude: 29.6465,
    longitude: -82.3415,
    enforcementHours: '24/7',
    weekdayLifted: 'Never',
    weekendLifted: 'Never',
    schedule: {
        monFri: '7:30 AM – 4:30 PM',
        sat: 'Lifted',
        sun: 'Lifted'
    },
    status: OccupancyStatus.AVAILABLE,
    currentFill: 80,
    image: 'https://streetviewpixels-pa.googleapis.com/v1/thumbnail?cb_client=maps_sv.tactile&w=900&h=600&pitch=-11.495879836460716&panoid=17S_gs9MQy4Tp9iBY10apA&yaw=334.90312480103614' // Campus residential
  },
  {
    id: '25',
    name: 'Reitz Union Welcome Center (G12/Garage 12)',
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
    image: 'https://walker-arch.com/wp-content/uploads/2018/01/reitz_front-elevation.jpg' // Student Union/University
  },
  {
    id: '26',
    name: 'Frazier Rogers',
    permitTypes: [PermitType.ORANGE],
    location: 'Museum Rd',
    latitude: 29.64444,
    longitude: -82.3465,
     enforcementHours: 'M-F 7:30 AM - 4:30 PM',
    weekdayLifted: 'After 4:30 PM',
    weekendLifted: 'All Day',
    schedule: {
        monFri: '7:30 AM – 4:30 PM',
        sat: 'Lifted',
        sun: 'Lifted'
    },
    status: OccupancyStatus.AVAILABLE,
    currentFill: 65,
    image: 'https://streetviewpixels-pa.googleapis.com/v1/thumbnail?cb_client=maps_sv.tactile&w=900&h=600&pitch=4.121973590181355&panoid=RlOdmwZPFCcS8x-jPLIjQQ&yaw=217.10356286724993' // Malachowsky Hall
  }
];