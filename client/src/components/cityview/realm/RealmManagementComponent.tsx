import { useEffect, useMemo, useState } from "react";
import { ReactComponent as CrossSwords } from "../../../assets/icons/common/cross-swords.svg";
import { ReactComponent as PickAxeSecond } from "../../../assets/icons/common/pick-axe-second.svg";
import { ReactComponent as Coin } from "../../../assets/icons/common/coin.svg";
import { ReactComponent as City } from "../../../assets/icons/common/city.svg";
import { ReactComponent as Map } from "../../../assets/icons/common/map.svg";
import { useLocation, useRoute } from "wouter";
import { Tabs } from "../../../elements/tab";
import RealmTradeComponent from "./RealmTradeComponent";
import RealmLaborComponent from "./RealmLaborComponent";
import useUIStore from "../../../hooks/store/useUIStore";
import useRealmStore from "../../../hooks/store/useRealmStore";
import RealmStatusComponent from "./RealmStatusComponent";
import { useGetRealm } from "../../../hooks/helpers/useRealm";

const RealmManagementComponent = () => {
  const { realmEntityId } = useRealmStore();
  const { realm } = useGetRealm(realmEntityId);

  const [selectedTab, setSelectedTab] = useState(1);

  const [_location, setLocation] = useLocation();
  // @ts-ignore
  const [match, params] = useRoute("/realm/:id/:tab");

  const moveCameraToMarketView = useUIStore(
    (state) => state.moveCameraToMarketView,
  );
  const moveCameraToLaborView = useUIStore(
    (state) => state.moveCameraToLaborView,
  );

  const moveCameraToRealm = useUIStore((state) => state.moveCameraToRealm);
  const moveCameraToWorldMapView = useUIStore(
    (state) => state.moveCameraToWorldMapView,
  );
  const setIsLoadingScreenEnabled = useUIStore(
    (state) => state.setIsLoadingScreenEnabled,
  );

  useEffect(() => {
    if (selectedTab == 0) {
      moveCameraToLaborView();
    } else {
      moveCameraToMarketView();
    }
  }, [selectedTab]);

  const showOnMap = () => {
    setLocation("/map");
    setIsLoadingScreenEnabled(true);
    moveCameraToWorldMapView();
    setTimeout(() => {
      moveCameraToRealm(realm?.realmId as number);
    }, 300);
  };

  const tabs = useMemo(
    () => [
      {
        key: "labor",
        label: (
          <div className="flex flex-col items-center">
            <PickAxeSecond className="mb-2 fill-gold" /> <div>Labor</div>
          </div>
        ),
        component: <RealmLaborComponent />,
      },
      {
        key: "market",
        label: (
          <div className="flex flex-col items-center">
            <Coin className="mb-2 fill-gold" /> <div>Trade</div>
          </div>
        ),
        component: <RealmTradeComponent />,
      },
      {
        key: "civilians",
        label: (
          <div
            className="flex flex-col items-center blur-sm cursor-not-allowed"
            title="Not implemented"
          >
            <City className="mb-2 fill-gold" /> <div>Civilians</div>
          </div>
        ),
        component: <div></div>,
      },
      {
        key: "military",
        label: (
          <div
            className="flex flex-col items-center blur-sm cursor-not-allowed"
            title="Not implemented"
          >
            <CrossSwords className="mb-2 fill-gold" /> <div>Military</div>
          </div>
        ),
        component: <div></div>,
      },
    ],
    [selectedTab],
  );

  useEffect(() => {
    const _tab = ["caravans", "market"].includes(params?.tab as string)
      ? "market"
      : params?.tab;
    const tabIndex = tabs.findIndex((tab) => tab.key === _tab);
    if (tabIndex >= 0) {
      setSelectedTab(tabIndex);
    }
  }, [params]);

  return (
    <>
      <div className="flex justify-between items-center p-2">
        <RealmStatusComponent />
        <button
          onClick={showOnMap}
          className="flex items-center hover:bg-gold/20 transition-bg duration-200 z-10 px-2 py-1 ml-auto text-xxs border rounded-md text-gold border-gold"
        >
          <Map className="mr-1 fill-current" />
          Show on map
        </button>
      </div>
      <Tabs
        selectedIndex={selectedTab}
        onChange={(index: any) =>
          setLocation(`/realm/${realmEntityId}/${tabs[index].key}`)
        }
        variant="primary"
        className="flex-1 mt-4 overflow-hidden"
      >
        <Tabs.List>
          {tabs.map((tab, index) => (
            <Tabs.Tab key={index}>{tab.label}</Tabs.Tab>
          ))}
        </Tabs.List>
        <Tabs.Panels className="overflow-hidden">
          {tabs.map((tab, index) => (
            <Tabs.Panel key={index}>{tab.component}</Tabs.Panel>
          ))}
        </Tabs.Panels>
      </Tabs>
    </>
  );
};

export default RealmManagementComponent;
