import RealmInfoComponent from "../components/cityview/realm/RealmInfoComponent";
import RealmManagementComponent from "../components/cityview/realm/RealmManagementComponent";
import { BaseContainer } from "../containers/BaseContainer";
import { useGetRealm } from "../hooks/helpers/useRealm";
import useRealmStore from "../hooks/store/useRealmStore";
import { Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useLocation } from "wouter";

const RealmManagementModule = () => {
  const { realmEntityId } = useRealmStore();

  const { realm } = useGetRealm(realmEntityId);

  const [location] = useLocation();

  return (
    <>
      {
        <Transition
          show={realm && location !== "/map" ? true : false}
          as={Fragment}
          enter="transition-opacity duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <BaseContainer className="max-h-full h-min !p-0 mt-2">
            <RealmInfoComponent />
            <RealmManagementComponent />
          </BaseContainer>
        </Transition>
      }
    </>
  );
};

export default RealmManagementModule;
