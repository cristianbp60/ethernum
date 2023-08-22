import { Background as BackgroundContainer } from "../containers/Background";
import { MainScene } from "../modules/scenes/MainScene";
import useUIStore from "../hooks/store/useUIStore";
import { Leva } from "leva";
import { BottomRightContainer } from "../containers/BottomRightContainer";
import ChatModule from "../modules/ChatModule";
import NetworkModule from "../modules/NetworkModule";
import BottomMiddleContainer from "../containers/BottomMiddleContainer";
import TopContainer from "../containers/TopContainer";
import NavigationModule from "../modules/NavigationModule";
import ContentContainer from "../containers/ContentContainer";
import RealmManagementModule from "../modules/RealmManagementModule";
import EpochCountdown from "../components/network/EpochCountdown";
import RealmResourcesComponent from "../components/cityview/realm/RealmResourcesComponent";
import { useFetchBlockchainData } from "../hooks/store/useBlockchainStore";
import { useEffect } from "react";
import clsx from "clsx";
import { Redirect } from "wouter";
import { useProgress } from "@react-three/drei";
import { BlurOverlayContainer } from "../containers/BlurOverlayContainer";
import { SignUpComponent } from "../components/SignUpComponent";
import useSound from "use-sound";
import { NotificationsComponent } from "../components/NotificationsComponent";

export const World = () => {
  useFetchBlockchainData();
  const { progress } = useProgress();

  const isSoundOn = useUIStore((state) => state.isSoundOn);
  const musicLevel = useUIStore((state) => state.musicLevel);

  const isLoadingScreenEnabled = useUIStore(
    (state) => state.isLoadingScreenEnabled,
  );

  const setIsLoadingScreenEnabled = useUIStore(
    (state) => state.setIsLoadingScreenEnabled,
  );

  const [playBackground, { stop }] = useSound("/sound/music/happy_realm.mp3", {
    soundEnabled: isSoundOn,
    volume: musicLevel / 100,
    loop: true,
  });

  useEffect(() => {
    if (isSoundOn) {
      playBackground();
    } else {
      stop();
    }
  }, [isSoundOn]);

  useEffect(() => {
    if (progress === 100) {
      setIsLoadingScreenEnabled(false);
    } else {
      setIsLoadingScreenEnabled(true);
    }
  }, [progress]);

  return (
    <div className="fixed top-0 left-0 z-0 w-screen h-screen p-2">
      <BackgroundContainer className="border-2 border-[#E0AF65] rounded-xl relative">
        <div className="absolute top-0 left-0 z-10 w-full pointer-events-none rounded-xl h-44 bg-gradient-to-b from-black to-transparent opacity-90" />
        <MainScene />
        <div className="absolute bottom-0 left-0 z-10 w-full pointer-events-none rounded-xl h-44 bg-gradient-to-t from-black to-transparent opacity-90" />
        <div
          className={clsx(
            "absolute bottom-0 left-0 z-20 w-full pointer-events-none flex items-center text-white justify-center text-3xl rounded-xl h-full bg-black duration-500 transition-opacity",
            isLoadingScreenEnabled ? "opacity-100" : "opacity-0",
          )}
        >
          <img
            src="/images/eternum-logo_animated.png"
            className=" invert scale-50"
          />
        </div>
      </BackgroundContainer>
      <TopContainer>
        <NetworkModule />
        <div className="flex">
          <NavigationModule />
          <RealmResourcesComponent className="ml-20 -mt-1" />
          <NotificationsComponent className="ml-auto" />
        </div>

        {/* <ContextsModule /> */}
      </TopContainer>
      <ContentContainer>
        <RealmManagementModule />
      </ContentContainer>
      <BottomMiddleContainer>
        {/* <WolrdMapLayersModule /> */}
      </BottomMiddleContainer>
      <BottomRightContainer>
        <ChatModule />
      </BottomRightContainer>
      <EpochCountdown />
      <BlurOverlayContainer>
        <SignUpComponent />
      </BlurOverlayContainer>
      <Leva hidden={import.meta.env.PROD} />
      <Redirect to="/map" />
    </div>
  );
};
