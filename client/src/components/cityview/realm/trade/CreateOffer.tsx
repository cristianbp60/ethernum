import { useEffect, useMemo, useState } from "react";
import { SecondaryPopup } from "../../../../elements/SecondaryPopup";
import Button from "../../../../elements/Button";
import { Headline } from "../../../../elements/Headline";
import { ResourceCost } from "../../../../elements/ResourceCost";
import { NumberInput } from "../../../../elements/NumberInput";
import { SelectableResource } from "../../../../elements/SelectableResource";
import { ONE_MONTH, WEIGHTS, resources } from "@bibliothecadao/eternum";
import { ReactComponent as ArrowSeparator } from "../../../../assets/icons/common/arrow-separator.svg";
import { ReactComponent as Danger } from "../../../../assets/icons/common/danger.svg";
import { ReactComponent as Donkey } from "../../../../assets/icons/units/donkey-circle.svg";
import { Caravan } from "./Caravans/Caravan";
import { Steps } from "../../../../elements/Steps";
import { CaravanInterface } from "@bibliothecadao/eternum";
import { useDojo } from "../../../../DojoContext";
import useRealmStore from "../../../../hooks/store/useRealmStore";
import useBlockchainStore from "../../../../hooks/store/useBlockchainStore";
import { useCaravan } from "../../../../hooks/helpers/useCaravans";
import { divideByPrecision, multiplyByPrecision } from "../../../../utils/utils";
import { useGetRealm } from "../../../../hooks/helpers/useRealm";
import { useTrade } from "../../../../hooks/helpers/useTrade";
import { SelectRealmPanel } from "../SelectRealmPanel";
import clsx from "clsx";
import { DONKEYS_PER_CITY, WEIGHT_PER_DONKEY_KG } from "@bibliothecadao/eternum";
import { useResources } from "../../../../hooks/helpers/useResources";
import { getTotalResourceWeight } from "./TradeUtils";

type CreateOfferPopupProps = {
  onClose: () => void;
  onCreate: () => void;
};

export const CreateOfferPopup = ({ onClose }: CreateOfferPopupProps) => {
  const [step, setStep] = useState<number>(1);
  const [selectedResourceIdsGive, setSelectedResourceIdsGive] = useState<number[]>([]);
  const [selectedResourceIdsGet, setSelectedResourceIdsGet] = useState<number[]>([]);
  const [selectedResourcesGiveAmounts, setSelectedResourcesGiveAmounts] = useState<{ [key: number]: number }>({});
  const [selectedResourcesGetAmounts, setSelectedResourcesGetAmounts] = useState<{ [key: number]: number }>({});
  const [selectedCaravan, setSelectedCaravan] = useState<bigint>(0n);
  const [selectedRealmEntityId, setSelectedRealmEntityId] = useState<bigint | undefined>();
  const [selectedRealmId, setSelectedRealmId] = useState<bigint | undefined>();
  const [isNewCaravan, setIsNewCaravan] = useState(false);
  const [donkeysCount, setDonkeysCount] = useState(1);
  const [resourceWeight, setResourceWeight] = useState(0);
  const [hasEnoughDonkeys, setHasEnoughDonkeys] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    account: { account },
    setup: {
      optimisticSystemCalls: { optimisticCreateOrder },
      systemCalls: { create_order },
    },
  } = useDojo();

  const realmEntityId = useRealmStore((state) => state.realmEntityId);

  const nextBlockTimestamp = useBlockchainStore((state) => state.nextBlockTimestamp);

  const { getRealmEntityIdFromRealmId } = useTrade();

  const onSelectRealmId = (realmId: bigint) => {
    const entityId = getRealmEntityIdFromRealmId(realmId);
    entityId && setSelectedRealmEntityId(entityId);
  };

  const createOrder = async () => {
    setIsLoading(true);
    if (!nextBlockTimestamp) return;
    if (isNewCaravan) {
      await optimisticCreateOrder(create_order)({
        signer: account,
        maker_id: realmEntityId,
        maker_gives_resource_types: selectedResourceIdsGive,
        maker_gives_resource_amounts: selectedResourceIdsGive.map((id) =>
          multiplyByPrecision(Number(selectedResourcesGiveAmounts[id])),
        ),
        taker_id: selectedRealmEntityId || 0,
        taker_gives_resource_types: selectedResourceIdsGet,
        taker_gives_resource_amounts: selectedResourceIdsGet.map((id) =>
          multiplyByPrecision(Number(selectedResourcesGetAmounts[id])),
        ),
        donkeys_quantity: donkeysCount,
        expires_at: nextBlockTimestamp + ONE_MONTH,
      });
    } else {
      await optimisticCreateOrder(create_order)({
        signer: account,
        maker_id: realmEntityId,
        maker_gives_resource_types: selectedResourceIdsGive,
        maker_gives_resource_amounts: selectedResourceIdsGive.map((id) =>
          multiplyByPrecision(Number(selectedResourcesGiveAmounts[id])),
        ),
        taker_id: selectedRealmEntityId || 0,
        maker_transport_id: selectedCaravan,
        taker_gives_resource_types: selectedResourceIdsGet,
        taker_gives_resource_amounts: selectedResourceIdsGet.map((id) =>
          multiplyByPrecision(Number(selectedResourcesGetAmounts[id])),
        ),
        expires_at: nextBlockTimestamp + ONE_MONTH,
      });
    }
    onClose();
  };

  const canGoToNextStep = useMemo(() => {
    if (step === 1) {
      return selectedResourceIdsGive.length > 0 && selectedResourceIdsGet.length > 0;
    } else if (step === 3) {
      return selectedCaravan !== 0n || (hasEnoughDonkeys && isNewCaravan);
    } else {
      return true;
    }
  }, [step, selectedCaravan, hasEnoughDonkeys, selectedResourceIdsGet, selectedResourceIdsGive, isNewCaravan]);

  useEffect(() => {
    setHasEnoughDonkeys(multiplyByPrecision(donkeysCount * WEIGHT_PER_DONKEY_KG) >= resourceWeight);
  }, [donkeysCount, resourceWeight]);

  return (
    <SecondaryPopup name="create-offer">
      <SecondaryPopup.Head onClose={onClose}>
        <div className="flex items-center space-x-1">
          <div className="mr-0.5">Create Offer:</div>
        </div>
      </SecondaryPopup.Head>
      <SecondaryPopup.Body width={"476px"}>
        <div className="flex flex-col items-center p-2">
          {step == 1 && (
            <SelectResourcesPanel
              selectedResourceIdsGive={selectedResourceIdsGive}
              setSelectedResourceIdsGive={(e) => {
                setSelectedResourceIdsGive(e);
                setSelectedResourcesGiveAmounts(Object.fromEntries(e.map((id) => [id, 1])));
              }}
              selectedResourceIdsGet={selectedResourceIdsGet}
              setSelectedResourceIdsGet={(e) => {
                setSelectedResourceIdsGet(e);
                setSelectedResourcesGetAmounts(Object.fromEntries(e.map((id) => [id, 1])));
              }}
            />
          )}
          {step == 2 && (
            <SelectResourcesAmountPanel
              selectedResourceIdsGive={selectedResourceIdsGive}
              selectedResourcesGiveAmounts={selectedResourcesGiveAmounts}
              setSelectedResourcesGiveAmounts={setSelectedResourcesGiveAmounts}
              resourceWeight={resourceWeight}
              selectedResourceIdsGet={selectedResourceIdsGet}
              selectedResourcesGetAmounts={selectedResourcesGetAmounts}
              setSelectedResourcesGetAmounts={setSelectedResourcesGetAmounts}
              setResourceWeight={setResourceWeight}
              selectedRealmId={selectedRealmId}
              setSelectedRealmId={setSelectedRealmId}
            />
          )}
          {step == 3 && (
            <SelectCaravanPanel
              donkeysCount={donkeysCount}
              setDonkeysCount={setDonkeysCount}
              isNewCaravan={isNewCaravan}
              setIsNewCaravan={setIsNewCaravan}
              selectedCaravan={selectedCaravan}
              setSelectedCaravan={setSelectedCaravan}
              selectedResourceIdsGet={selectedResourceIdsGet}
              selectedResourcesGetAmounts={selectedResourcesGetAmounts}
              selectedResourceIdsGive={selectedResourceIdsGive}
              selectedResourcesGiveAmounts={selectedResourcesGiveAmounts}
              resourceWeight={resourceWeight}
              hasEnoughDonkeys={hasEnoughDonkeys}
            />
          )}
        </div>
        <div className="flex justify-between m-2 text-xxs">
          <Button
            className="!px-[6px] !py-[2px] text-xxs"
            onClick={() => (step === 1 ? onClose() : setStep(step - 1))}
            variant="outline"
          >
            {step === 1 ? "Cancel" : "Back"}
          </Button>
          <Steps className="absolute -translate-x-1/2 left-1/2 bottom-4" step={step} maxStep={3} />
          {!isLoading && (
            <Button
              className="!px-[6px] !py-[2px] text-xxs"
              disabled={!canGoToNextStep}
              onClick={() => {
                if (step === 3) {
                  createOrder();
                } else {
                  if (step === 2) {
                    selectedRealmId && onSelectRealmId(selectedRealmId);
                  }
                  setStep(step + 1);
                }
              }}
              variant={canGoToNextStep ? "success" : "danger"}
            >
              {step == 3 ? (selectedRealmId ? "Create Direct Offer" : "Create Public Offer") : "Next Step"}
            </Button>
          )}
          {isLoading && (
            <Button
              isLoading={true}
              onClick={() => {}}
              variant="danger"
              className="ml-auto p-2 !h-4 text-xxs !rounded-md"
            >
              {" "}
              {}{" "}
            </Button>
          )}
        </div>
      </SecondaryPopup.Body>
    </SecondaryPopup>
  );
};

const SelectResourcesPanel = ({
  selectedResourceIdsGive,
  setSelectedResourceIdsGive,
  selectedResourceIdsGet,
  setSelectedResourceIdsGet,
}: {
  selectedResourceIdsGive: number[];
  setSelectedResourceIdsGive: (selectedResourceIds: number[]) => void;
  selectedResourceIdsGet: number[];
  setSelectedResourceIdsGet: (selectedResourceIds: number[]) => void;
}) => {
  const { getBalance } = useResources();

  const { realmEntityId } = useRealmStore();

  return (
    <div className="grid grid-cols-9 gap-2 p-2 relative">
      <div className="flex flex-col items-center col-span-4">
        <Headline className="mb-2">You Give</Headline>
        <div className="grid grid-cols-4 gap-2">
          {resources.map(({ id, trait: _name }) => {
            let resource = getBalance(realmEntityId, id);
            return (
              <SelectableResource
                key={id}
                resourceId={id}
                amount={resource?.balance || 0}
                disabled={(resource?.balance || 0) === 0 || selectedResourceIdsGet.includes(id)}
                selected={selectedResourceIdsGive.includes(id)}
                onClick={() => {
                  if (selectedResourceIdsGive.includes(id)) {
                    setSelectedResourceIdsGive(selectedResourceIdsGive.filter((_id) => _id !== id));
                  } else {
                    setSelectedResourceIdsGive([...selectedResourceIdsGive, id]);
                  }
                }}
              />
            );
          })}
        </div>
      </div>
      <div className="flex items-center justify-center">
        <ArrowSeparator className="sticky top-1/2 -translate-y-1/2" />
      </div>
      <div className="flex flex-col items-center col-span-4">
        <Headline className="mb-2">You Get</Headline>
        <div className="grid grid-cols-4 gap-2">
          {resources.map(({ id, trait: _name }) => {
            let resource = getBalance(realmEntityId, id);
            return (
              <SelectableResource
                key={id}
                resourceId={id}
                amount={resource?.balance || 0}
                selected={selectedResourceIdsGet.includes(id)}
                disabled={selectedResourceIdsGive.includes(id)}
                onClick={() => {
                  if (selectedResourceIdsGet.includes(id)) {
                    setSelectedResourceIdsGet(selectedResourceIdsGet.filter((_id) => _id !== id));
                  } else {
                    setSelectedResourceIdsGet([...selectedResourceIdsGet, id]);
                  }
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

const SelectResourcesAmountPanel = ({
  selectedResourceIdsGive,
  selectedResourceIdsGet,
  selectedResourcesGiveAmounts,
  selectedResourcesGetAmounts,
  resourceWeight,
  setSelectedResourcesGiveAmounts,
  setSelectedResourcesGetAmounts,
  setResourceWeight,
  selectedRealmId,
  setSelectedRealmId,
}: {
  selectedResourceIdsGive: number[];
  selectedResourceIdsGet: number[];
  selectedResourcesGiveAmounts: { [key: number]: number };
  selectedResourcesGetAmounts: { [key: number]: number };
  resourceWeight: number;
  setSelectedResourcesGiveAmounts: (selectedResourcesGiveAmounts: { [key: number]: number }) => void;
  setSelectedResourcesGetAmounts: (selectedResourcesGetAmounts: { [key: number]: number }) => void;
  setResourceWeight: (resourceWeight: number) => void;
  selectedRealmId: bigint | undefined;
  setSelectedRealmId: (selectedRealmId: bigint) => void;
}) => {
  const { realmEntityId } = useRealmStore();

  const { getBalance } = useResources();

  useEffect(() => {
    // set resource weight in kg
    let resourcesGet = Object.keys(selectedResourcesGetAmounts).map((resourceId) => {
      return {
        resourceId: Number(resourceId),
        amount: selectedResourcesGetAmounts[Number(resourceId)],
      };
    });
    setResourceWeight(multiplyByPrecision(getTotalResourceWeight(resourcesGet)));
  }, [selectedResourcesGetAmounts]);

  return (
    <>
      <div className="grid grid-cols-9 gap-2 p-2 max-h-[250px] overflow-y-auto overflow-x-hidden relative">
        <div className="flex flex-col items-center col-span-4 space-y-2">
          <Headline className="mb-2">You Give</Headline>
          {selectedResourceIdsGive.map((id) => {
            let resource = getBalance(realmEntityId, id);
            return (
              <div key={id} className="flex items-center w-full">
                <NumberInput
                  max={divideByPrecision(Number(resource?.balance) || 0)}
                  min={1}
                  value={Number(selectedResourcesGiveAmounts[id].toString())}
                  onChange={(value) => {
                    setSelectedResourcesGiveAmounts({
                      ...selectedResourcesGiveAmounts,
                      [id]: Math.min(divideByPrecision(resource?.balance || 0), value),
                    });
                  }}
                />
                <div className="ml-2">
                  <ResourceCost
                    onClick={() => {
                      setSelectedResourcesGiveAmounts({
                        ...selectedResourcesGiveAmounts,
                        [id]: divideByPrecision(resource?.balance || 0),
                      });
                    }}
                    resourceId={id}
                    amount={divideByPrecision(resource?.balance || 0)}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-center">
          <ArrowSeparator className="sticky top-1/2 -translate-y-1/2" />
        </div>
        <div className="flex flex-col items-center col-span-4 space-y-2">
          <Headline className="mb-2">You Get</Headline>
          {selectedResourceIdsGet.map((id) => {
            let resource = getBalance(realmEntityId, id);

            return (
              <div key={id} className="flex items-center w-full">
                <NumberInput
                  max={100000}
                  min={1}
                  value={selectedResourcesGetAmounts[id]}
                  onChange={(value) => {
                    setSelectedResourcesGetAmounts({
                      ...selectedResourcesGetAmounts,
                      [id]: value,
                    });
                  }}
                />
                <div className="ml-2">
                  <ResourceCost resourceId={id} amount={divideByPrecision(resource?.balance || 0)} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex text-xs mt-2 text-center text-white">
        Total Items Weight <div className="ml-1 text-gold">{`${divideByPrecision(resourceWeight)}kg`}</div>
      </div>
      <div className="flex my-1 flex-row text-xxs text-center text-white">
        <div className="flex flex-col mx-1">
          <div> Food</div>
          <div className="ml-1 text-gold">{`${WEIGHTS[254]}kg/unit`}</div>
        </div>
        <div className="flex flex-col mx-1">
          <div> Resource</div>
          <div className="ml-1 text-gold">{`${WEIGHTS[1]}kg/unit`}</div>
        </div>
        <div className="flex flex-col mx-1">
          <div> Lords</div>
          <div className="ml-1 text-gold">{`${WEIGHTS[253]}kg/unit`}</div>
        </div>
      </div>
      <SelectRealmPanel selectedRealmId={selectedRealmId} setSelectedRealmId={setSelectedRealmId}></SelectRealmPanel>
    </>
  );
};

export const SelectCaravanPanel = ({
  donkeysCount,
  setDonkeysCount,
  isNewCaravan,
  setIsNewCaravan,
  selectedCaravan,
  setSelectedCaravan,
  selectedResourceIdsGet,
  selectedResourceIdsGive,
  selectedResourcesGetAmounts,
  selectedResourcesGiveAmounts,
  resourceWeight,
  hasEnoughDonkeys,
  headline = "You Give",
  className,
}: {
  donkeysCount: number;
  setDonkeysCount: (donkeysCount: number) => void;
  isNewCaravan: boolean;
  setIsNewCaravan: (isNewCaravan: boolean) => void;
  selectedCaravan: bigint;
  setSelectedCaravan: (selectedCaravanId: bigint) => void;
  selectedResourceIdsGet: number[];
  selectedResourceIdsGive: number[];
  selectedResourcesGetAmounts: { [key: number]: number };
  selectedResourcesGiveAmounts: { [key: number]: number };
  resourceWeight: number;
  hasEnoughDonkeys: boolean;
  headline?: string;
  className?: string;
}) => {
  const { realmEntityId } = useRealmStore();

  const nextBlockTimestamp = useBlockchainStore((state) => state.nextBlockTimestamp);

  const { getRealmDonkeysCount, useGetPositionCaravans } = useCaravan();
  const { getResourcesFromInventory } = useResources();
  const { realm } = useGetRealm(realmEntityId);
  const { caravans: realmCaravans } = useGetPositionCaravans(realm?.position.x || 0, realm?.position.y || 0);

  const donkeysLeft = useMemo(() => {
    const realmDonkeysCount = getRealmDonkeysCount(realmEntityId);
    if (realmDonkeysCount && realm) {
      return realm?.cities * DONKEYS_PER_CITY - realmDonkeysCount;
    } else {
      return (realm?.cities || 0) * DONKEYS_PER_CITY;
    }
  }, [realm, realmCaravans]);

  useEffect(() => {
    setDonkeysCount(Math.min(donkeysLeft || 0, Math.ceil(divideByPrecision(resourceWeight) / WEIGHT_PER_DONKEY_KG)));
  }, [resourceWeight]);

  const canCarry = (caravan: CaravanInterface, resourceWeight: number) => {
    return caravan.capacity ? caravan.capacity >= resourceWeight : false;
  };

  let myAvailableCaravans = useMemo(
    () =>
      realmCaravans
        ? (realmCaravans
            .map((caravan) => {
              const resourcesCarried = getResourcesFromInventory(caravan.caravanId);
              const isIdle =
                caravan &&
                nextBlockTimestamp &&
                !caravan.blocked &&
                (!caravan.arrivalTime || caravan.arrivalTime <= nextBlockTimestamp) &&
                resourcesCarried.resources.length == 0;
              // capacity in gr (1kg = 1000gr)
              if (isIdle && canCarry(caravan, resourceWeight)) {
                return caravan;
              }
            })
            .filter(Boolean) as CaravanInterface[])
        : [],
    [realmCaravans, resourceWeight],
  );

  return (
    <div className={clsx("flex flex-col items-center w-full p-2", className)}>
      {selectedResourceIdsGive.length > 0 || selectedResourceIdsGet.length > 0 ? (
        <div className="grid grid-cols-9 gap-2 relative">
          {selectedResourceIdsGive.length > 0 && (
            <>
              <div
                className={clsx(
                  "flex flex-col items-center  space-y-2 h-min",
                  selectedResourceIdsGet.length > 0 ? "col-span-4" : "col-span-9",
                )}
              >
                <Headline className="mb-2" size="big">
                  {headline}
                </Headline>
                <div className="flex items-center justify-center w-full flex-wrap">
                  {selectedResourceIdsGive.map((id) => (
                    <ResourceCost
                      key={id}
                      className="!w-min mb-2 mx-1"
                      resourceId={id}
                      color="text-gold"
                      type="vertical"
                      amount={-selectedResourcesGiveAmounts[id]}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
          {selectedResourceIdsGet.length > 0 && (
            <>
              <div className="flex items-center justify-center">
                <ArrowSeparator className="sticky top-1/2 -translate-y-1/2" />
              </div>
              <div className="flex flex-col items-center col-span-4 space-y-2 h-min">
                <Headline className="mb-2" size="big">
                  You Get
                </Headline>
                <div className="flex items-center justify-center w-full flex-wrap">
                  {selectedResourceIdsGet.map((id) => (
                    <ResourceCost
                      key={id}
                      className="!w-min  mb-2 mx-1"
                      type="vertical"
                      color="text-order-brilliance"
                      resourceId={id}
                      amount={selectedResourcesGetAmounts[id]}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      ) : null}
      <div className="flex text-xs mt-2 text-center text-white">
        Total Items Weight <div className="ml-1 text-gold">{`${divideByPrecision(resourceWeight)}kg`}</div>
      </div>
      <div className="flex my-1 flex-row text-xxs text-center text-white">
        <div className="flex flex-col mx-1">
          <div> Food</div>
          <div className="ml-1 text-gold">{`${WEIGHTS[254]}kg/unit`}</div>
        </div>
        <div className="flex flex-col mx-1">
          <div> Resource</div>
          <div className="ml-1 text-gold">{`${WEIGHTS[1]}kg/unit`}</div>
        </div>
        <div className="flex flex-col mx-1 mb-2">
          <div> Lords</div>
          <div className="ml-1 text-gold">{`${WEIGHTS[253]}kg/unit`}</div>
        </div>
      </div>
      {isNewCaravan && (
        <>
          <div className="flex flex-col">
            <Headline className="mb-2" size="big">
              Summon a New Caravan
            </Headline>
            <div className="grid grid-cols-9 gap-2 p-2">
              <div className="flex items-center col-span-3">
                <NumberInput
                  value={donkeysCount}
                  onChange={(value) => setDonkeysCount(Math.min(donkeysLeft || 0, value))}
                  max={donkeysLeft || 0}
                />
                <Donkey className="ml-2 w-5 h-5 min-w-[20px]" />
                <div className="flex flex-col justify-center ml-2">
                  <div className="text-xs font-bold text-white">{donkeysLeft - donkeysCount}</div>
                  <div className="text-xs text-center text-white">Donkeys</div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex mb-1 text-xs text-center text-white">
            Caravan Capacity{" "}
            <div className={`ml-1 text-${hasEnoughDonkeys ? "order-brilliance" : "danger"}`}>{`${
              donkeysCount * WEIGHT_PER_DONKEY_KG
            }kg`}</div>
          </div>
          {!hasEnoughDonkeys && (
            <div className="flex items-center mb-1 text-xs text-center text-white">
              <Danger />
              <div className="ml-1 uppercase text-danger">Increase the amount of units</div>
            </div>
          )}
        </>
      )}
      {!isNewCaravan && (
        <div
          onClick={() => setIsNewCaravan(true)}
          className="w-full mx-4 h-8 py-[7px] bg-dark-brown cursor-pointer rounded justify-center items-center"
        >
          <div className="text-xs text-center text-gold">+ New Caravan</div>
        </div>
      )}
      {isNewCaravan && myAvailableCaravans.length > 0 && (
        <div className="flex flex-col w-full mt-2">
          <Headline className="mb-2">Or choose from existing Caravans</Headline>
        </div>
      )}
      {isNewCaravan && myAvailableCaravans.length > 0 && (
        <div
          onClick={() => setIsNewCaravan(false)}
          className="w-full mx-4 h-8 py-[7px] bg-dark-brown cursor-pointer rounded justify-center items-center"
        >
          <div className="text-xs text-center text-gold">{`Show ${myAvailableCaravans.length} idle Caravans`}</div>
        </div>
      )}
      {!isNewCaravan && (
        <div className="flex flex-col max-h-[350px] overflow-auto w-full">
          {myAvailableCaravans.map((caravan) => (
            <Caravan
              key={caravan.caravanId}
              caravan={caravan}
              idleOnly={true}
              onClick={() => setSelectedCaravan(caravan.caravanId)}
              className={`w-full mt-2 border rounded-md ${
                selectedCaravan === caravan.caravanId ? "border-order-brilliance" : ""
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
