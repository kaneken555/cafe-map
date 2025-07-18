// components/CafeOverlayIcon.stories.tsx
import { Meta, StoryObj } from "@storybook/react";
import CafeOverlayIcon from "./CafeOverlayIcon";
import { LoadScript, GoogleMap } from "@react-google-maps/api";
import { Cafe } from "../../types/cafe";

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const meta: Meta<typeof CafeOverlayIcon> = {
  title: "Map/CafeOverlayIcon",
  component: CafeOverlayIcon,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof CafeOverlayIcon>;

const sampleCafe: Cafe = {
  id: 1,
  placeId: "ChIJN1t_tDeuEmsRUsoyG83frY4",
  name: "Sample Cafe",
  address: "東京都千代田区丸の内1-1-1",
  openTime: "09:00",
  status: "open",
  distance: "300m",
  photoUrls: ["https://upload.wikimedia.org/wikipedia/commons/3/3f/Starbucks_Coffee_restaurant.png"],
  rating: 4.2,
  lat: 35.681236,
  lng: 139.767125,
};

const mapCenter = {
  lat: sampleCafe.lat,
  lng: sampleCafe.lng,
};


export const Selected: Story = {
  render: () => (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap
        mapContainerStyle={{ height: "400px", width: "100%" }}
        center={mapCenter}
        zoom={16}
      >
        <CafeOverlayIcon
          cafe={sampleCafe}
          isSelected={true}
          onClick={(cafe) => alert(`${cafe.name} がクリックされました`)}
        />
      </GoogleMap>
    </LoadScript>
  ),
};

export const Unselected: Story = {
  render: () => (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap
        mapContainerStyle={{ height: "400px", width: "100%" }}
        center={mapCenter}
        zoom={16}
      >
        <CafeOverlayIcon
          cafe={sampleCafe}
          isSelected={false}
          onClick={(cafe) => alert(`${cafe.name} がクリックされました`)}
        />
      </GoogleMap>
    </LoadScript>
  ),
};