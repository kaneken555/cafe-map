import { ExternalLink } from 'lucide-react'; // アイコンライブラリ

const GoogleMapButton = ({ url }: { url: string }) => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center border border-black text-black rounded-lg px-4 py-2 hover:bg-gray-100 transition whitespace-nowrap"
    >
      <span className="mr-2">Google Map</span>
      <ExternalLink size={18} />
    </a>
  );
};

export default GoogleMapButton;
