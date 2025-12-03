// components/GoogleMapButton.tsx
import { ExternalLink } from 'lucide-react';

const GoogleMapButton = ({ url }: { url: string }) => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center border border-black text-black rounded-lg px-2 py-1 sm:px-3 sm:py-1.5 text-sm sm:text-base hover:bg-gray-100 transition whitespace-nowrap"
    >
      <span className="mr-1 sm:mr-2">Google Map</span>
      <ExternalLink className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
    </a>
  );
};

export default GoogleMapButton;
