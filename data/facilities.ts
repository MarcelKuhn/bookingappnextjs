// Example facility mapping - replace with real Booking.com facility IDs once you have API access
export const FACILITIES = {
  '24h_reception': 24, // example only – replace with real ID from Booking API
  'fitness': 54,
  'sauna': 64,
  'swimming_pool': 12,
  'spa': 18,
  'restaurant': 3,
  'bar': 4,
  'wifi': 1,
  'parking': 2,
  'business_center': 21,
  'room_service': 8,
  'laundry': 15,
  'pet_friendly': 9
};

// Friendly display names
export const FACILITY_NAMES: Record<string, string> = {
  '24h_reception': '24h Reception',
  'fitness': 'Fitness Center',
  'sauna': 'Sauna',
  'swimming_pool': 'Swimming Pool',
  'spa': 'Spa',
  'restaurant': 'Restaurant',
  'bar': 'Bar',
  'wifi': 'WiFi',
  'parking': 'Parking',
  'business_center': 'Business Center',
  'room_service': 'Room Service',
  'laundry': 'Laundry',
  'pet_friendly': 'Pet Friendly'
};