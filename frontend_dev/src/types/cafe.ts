// types/cafe.ts
export interface Cafe {
  id: number;
  placeId: string;
  name: string;
  address: string;
  openTime: string;
  status: string;
  distance: string;
  price_day?: string;
  price_night?: string;
  photoUrls: string[];
  rating: number;
  userRatingTotal?: number;
  priceLevel?: number;
  phoneNumber?: string;
  website?: string;
  lat: number;
  lng: number;
  businessStatus?: string; // "OPERATIONAL" など
}