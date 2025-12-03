export type PlaceType = 'photo_spot' | 'meeting_point' | 'viewpoint' | 'memorial' | 'other';

export interface CustomPlaceOwner {
  id: number;
  name: string;
}

export interface CustomPlaceMap {
  id: number;
  name: string;
  is_visible: boolean;
}

export interface CustomPlace {
  id: number;
  owner: CustomPlaceOwner;
  name: string;
  latitude: number;
  longitude: number;
  image_url?: string;
  place_type?: PlaceType;
  place_type_display?: string;
  memo?: string;
  created_at: string;
  updated_at: string;
  maps?: CustomPlaceMap[];
}

export interface CreateCustomPlaceRequest {
  name: string;
  latitude: number;
  longitude: number;
  image?: File | null;
  place_type?: PlaceType;
  memo?: string;
  map_ids?: number[];
}

export interface UpdateCustomPlaceRequest {
  name?: string;
  latitude?: number;
  longitude?: number;
  image?: File | null;
  place_type?: PlaceType;
  memo?: string;
}

export interface CustomPlaceMapRelation {
  id: number;
  map: number;
  map_name: string;
  custom_place: number;
  custom_place_name: string;
  is_visible: boolean;
  created_at: string;
}

export interface CustomPlaceListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: CustomPlace[];
}

export interface CustomPlacesByMapResponse {
  map: {
    id: number;
    name: string;
  };
  custom_places: CustomPlace[];
}

export const PLACE_TYPE_CHOICES: { value: PlaceType; label: string }[] = [
  { value: 'photo_spot', label: '写真スポット' },
  { value: 'meeting_point', label: '待ち合わせ場所' },
  { value: 'viewpoint', label: '景色の良い場所' },
  { value: 'memorial', label: '記念碑・モニュメント' },
  { value: 'other', label: 'その他' },
];
