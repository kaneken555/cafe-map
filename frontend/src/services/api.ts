import axios from "axios";

export const getGoogleMapsApiKey = async (): Promise<string> => {
  const response = await axios.get("http://localhost:8000/api/google-maps-key/");
  return response.data.apiKey;
};

export const fetchCafeLocations = async (lat: number, lng: number) => {
  const response = await fetch(`http://localhost:8000/api/cafes?lat=${lat}&lng=${lng}`);
  const data = await response.json();
  return data.cafes; // { lat: number, lng: number, name: string }[]
};