import axios from "axios";

export const getGoogleMapsApiKey = async (): Promise<string> => {
  const response = await axios.get("http://localhost:8000/api/google-maps-key/");
  return response.data.apiKey;
};
