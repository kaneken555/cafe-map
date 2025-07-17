// hooks/useInitializeApp.ts
import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useMap } from "../contexts/MapContext";
import { useGroup } from "../contexts/GroupContext";
import { getMapList, getSharedMapList } from "../api/map";
import { fetchGroupList } from "../api/group";
import ReactGA from "react-ga4";


const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID;

const InitializeApp = () => {
  const { setUser } = useAuth();
  const { setMapList, setSharedMapList } = useMap();
  const { setGroupList } = useGroup();

  useEffect(() => {
    const init = async () => {
      try {

        // ✅ GAの初期化（本番環境のみ）
        if (gaId) {
          ReactGA.initialize(gaId);
          ReactGA.send("pageview"); // 初期ページビュー送信
        }

        const res = await fetch(`/api/v1/auth/login/success/`, 
          {
            credentials: "include",
          }
        );

        if (res.ok) {
          const data = await res.json();
          setUser({ id: data.id, name: data.name });

          const [maps, sharedMaps, groups] = await Promise.all([
            getMapList(),
            getSharedMapList(),
            fetchGroupList(),
          ]);
          setMapList(maps);
          setSharedMapList(sharedMaps);
          setGroupList(groups);
        }
      } catch (e) {
        console.error("初期化エラー:", e);
      }
    };

    init();
  }, []);

  return null; // UIは持たない
};

export default InitializeApp;
