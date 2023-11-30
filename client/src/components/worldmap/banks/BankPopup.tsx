import { useEffect, useMemo, useState } from "react";
import { SecondaryPopup } from "../../../elements/SecondaryPopup";
import Button from "../../../elements/Button";
import { SelectCaravanPanel } from "../../cityview/realm/trade/CreateOffer";
import { ReactComponent as ArrowSeparator } from "../../../assets/icons/common/arrow-separator.svg";
import useRealmStore from "../../../hooks/store/useRealmStore";
import { getRealm } from "../../../utils/realms";
import { getComponentValue } from "@latticexyz/recs";
import { divideByPrecision, getEntityIdFromKeys, multiplyByPrecision } from "../../../utils/utils";
import { useDojo } from "../../../DojoContext";
import { Steps } from "../../../elements/Steps";
import { Headline } from "../../../elements/Headline";
import { OrderIcon } from "../../../elements/OrderIcon";
import { orderNameDict } from "@bibliothecadao/eternum";
import { ResourceCost } from "../../../elements/ResourceCost";
import clsx from "clsx";
import { Tabs } from "../../../elements/tab";
import { useGetPositionCaravans } from "../../../hooks/helpers/useCaravans";
import { WEIGHT_PER_DONKEY_KG } from "@bibliothecadao/eternum";
import useUIStore from "../../../hooks/store/useUIStore";
import { BANK_AUCTION_DECAY, BankInterface, targetPrices } from "../../../hooks/helpers/useBanks";
import { BankCaravansPanel } from "./BanksCaravans/BankCaravansPanel";
import { NumberInput } from "../../../elements/NumberInput";
import { getLordsAmountFromBankAuction } from "./utils";
import { LaborAuction } from "../../cityview/realm/labor/LaborAuction";
import useBlockchainStore from "../../../hooks/store/useBlockchainStore";

type BankPopupProps = {
  onClose: () => void;
  bank: BankInterface;
};

export const BankPopup = ({ onClose, bank }: BankPopupProps) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const setTooltip = useUIStore((state) => state.setTooltip);

  const { caravans } = useGetPositionCaravans(bank.position.x, bank.position.y);

  const tabs = useMemo(
    () => [
      {
        key: "all",
        label: (
          <div
            onMouseEnter={() =>
              setTooltip({
                position: "bottom",
                content: (
                  <>
                    <p className="whitespace-nowrap">Initialize or feed Hyperstructure with resources.</p>
                  </>
                ),
              })
            }
            onMouseLeave={() => setTooltip(null)}
            className="flex relative group flex-col items-center"
          >
            <div>Build</div>
          </div>
        ),
        component: (
          <SwapResourcesPanel
            onSendCaravan={() => setSelectedTab(1)}
            onClose={onClose}
            bank={bank}
            bankPrice={bank.wheatPrice}
          />
        ),
      },
      {
        key: "my",
        label: (
          <div
            onMouseEnter={() =>
              setTooltip({
                position: "bottom",
                content: (
                  <>
                    <p className="whitespace-nowrap">Watch incoming caravans.</p>
                    <p className="whitespace-nowrap">Pass resources to Hyperstructure on arriving.</p>
                  </>
                ),
              })
            }
            onMouseLeave={() => setTooltip(null)}
            className="flex group relative flex-col items-center"
          >
            <div>{`Caravans (${caravans.length})`}</div>
          </div>
        ),
        component: <BankCaravansPanel caravans={caravans} bank={bank} />,
      },
    ],
    [selectedTab, caravans],
  );

  return (
    <SecondaryPopup name="hyperstructure">
      <SecondaryPopup.Head onClose={onClose}>
        <div className="flex items-center space-x-1">
          <div className="mr-0.5 bg-gray">Manage Hyperstructure:</div>
        </div>
      </SecondaryPopup.Head>
      <SecondaryPopup.Body width={"460px"}>
        <Tabs
          selectedIndex={selectedTab}
          onChange={(index: any) => setSelectedTab(index)}
          variant="default"
          className="h-full"
        >
          <Tabs.List className="!border-t-transparent">
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
      </SecondaryPopup.Body>
    </SecondaryPopup>
  );
};

const SelectableRealm = ({ realm, selected = false, onClick, costs, ...props }: any) => {
  const costById = useMemo(() => {
    const costById: any = {};
    costs &&
      costs.forEach((cost: any) => {
        costById[cost.resourceId] = cost.amount;
      });
    return costById;
  }, [costs]);

  const canInitialize = useMemo(() => {
    let canInitialize = true;
    if (!realm || !realm.resources) {
      return false;
    }
    realm.resources.forEach((resource: any) => {
      if (resource.balance < costById[resource.id]) {
        canInitialize = false;
      }
    });
    return canInitialize;
  }, [costById, realm.resources]);

  return (
    <div
      className={clsx(
        "flex flex-col relative items-center p-2 border rounded-md text-xxs text-gray-gold",
        "border-gray-gold",
      )}
      {...props}
    >
      {realm && (
        <div className="flex absolute items-center p-1 top-0 left-0 border border-t-0 border-l-0 rounded-br-md border-gray-gold">
          {realm.order && <OrderIcon order={orderNameDict[realm.order]} size="xs" className="mr-1" />}
          {realm.name}
        </div>
      )}
      <div className="text-gold ml-auto absolute right-2 top-2">24h:10m away</div>
      <div className="flex items-center mt-6 w-full">
        <div className="flex">
          {realm.resources &&
            realm.resources.map((resource: any) => {
              return (
                <ResourceCost
                  type="vertical"
                  withTooltip
                  key={resource.id}
                  resourceId={parseInt(resource.id)}
                  amount={divideByPrecision(resource.balance)}
                  color={resource.balance >= 0 ? "text-order-brilliance" : "text-order-giants"}
                />
              );
            })}
        </div>
        <Button
          // disabled={!initialized && !canInitialize}
          onClick={onClick}
          className="h-6 text-xxs ml-auto"
          variant="success"
        >
          {`Set the amounts`}
        </Button>
      </div>
    </div>
  );
};

const PercentageSelection = ({ setPercentage }: { setPercentage: (percentage: number) => void }) => {
  const percentages = [0, 25, 50, 75, 100];
  return (
    <div className="w-[80%] flex flex-row items-center justify-center">
      {percentages.map((percentage) => (
        <Button variant={"outline"} className={"!p-1 my-2 mr-3 w-20"} onClick={() => setPercentage(percentage)}>
          {`${percentage}%`}
        </Button>
      ))}
    </div>
  );
};

const SwapResourcesPanel = ({
  onClose,
  onSendCaravan,
  bank,
  bankPrice: number,
}: {
  onClose: () => void;
  onSendCaravan: () => void;
  bank: BankInterface;
  bankPrice: number;
}) => {
  const [selectedCaravan, setSelectedCaravan] = useState<number>(0);
  const [isNewCaravan, setIsNewCaravan] = useState(false);
  const [donkeysCount, setDonkeysCount] = useState(1);
  const [hasEnoughDonkeys, setHasEnoughDonkeys] = useState(false);
  const [step, setStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);

  const {
    account: { account },
    setup: {
      systemCalls: { send_resources_to_location },
    },
  } = useDojo();

  const sendResourcesToBank = async () => {
    setIsLoading(true);
    const resourcesList = Object.keys(feedResourcesGiveAmounts)
      .filter((id) => feedResourcesGiveAmounts[Number(id)] > 0)
      .flatMap((id) => [Number(id), multiplyByPrecision(feedResourcesGiveAmounts[Number(id)])]);
    if (isNewCaravan) {
      await send_resources_to_location({
        signer: account,
        sending_entity_id: realmEntityId,
        resources: resourcesList || [],
        destination_coord_x: bank.position.x,
        destination_coord_y: bank.position.y,
        donkeys_quantity: donkeysCount,
      });
    } else {
      // transfer resources to caravan
      await send_resources_to_location({
        signer: account,
        sending_entity_id: realmEntityId,
        resources: resourcesList || [],
        destination_coord_x: bank.position.x,
        destination_coord_y: bank.position.y,
        caravan_id: selectedCaravan,
      });
    }
    onSendCaravan();
  };

  const {
    setup: {
      components: { Resource },
    },
  } = useDojo();

  const nextBlockTimestamp = useBlockchainStore((state) => state.nextBlockTimestamp);

  const realmEntityIds = useRealmStore((state) => state.realmEntityIds);
  const realmEntityId = useRealmStore((state) => state.realmEntityId);
  const setRealmEntityId = useRealmStore((state) => state.setRealmEntityId);
  const [percentage, setPercentage] = useState<number>(null);
  const [feedResourcesGiveAmounts, setFeedResourcesGiveAmounts] = useState<{ [key: number]: number }>({
    254: 0,
    255: 0,
  });

  // TODO: use same precision everywhere
  const resourceWeight = useMemo(() => {
    let _resourceWeight = 0;
    for (const amount of Object.values(feedResourcesGiveAmounts || {})) {
      _resourceWeight += multiplyByPrecision(amount * 1);
    }
    return _resourceWeight;
  }, [feedResourcesGiveAmounts]);

  const realms = useMemo(
    () =>
      realmEntityIds.map((realmEntityId) => {
        const _realm = getRealm(realmEntityId.realmId);
        const _resources = Object.keys(feedResourcesGiveAmounts).map((resourceId) => ({
          id: resourceId,
          balance:
            getComponentValue(Resource, getEntityIdFromKeys([BigInt(realmEntityId.realmEntityId), BigInt(resourceId)]))
              ?.balance || 0,
        }));
        return { ..._realm, entity_id: realmEntityId.realmEntityId, resources: _resources };
      }),
    [realmEntityIds],
  );

  const canGoToNextStep = useMemo(() => {
    if (step === 3) {
      return selectedCaravan !== 0 || (hasEnoughDonkeys && isNewCaravan);
    } else if (step == 2) {
      return false;
    } else {
      return true;
    }
  }, [step, selectedCaravan, hasEnoughDonkeys, isNewCaravan]);

  const lordsAmountFromWheat = useMemo(() => {
    console.log({ feedResourcesGiveAmounts });
    const lordsAmountFromWheat = bank.wheatLaborAuction
      ? getLordsAmountFromBankAuction(
          feedResourcesGiveAmounts[254],
          targetPrices[254],
          BANK_AUCTION_DECAY,
          bank.wheatLaborAuction.per_time_unit,
          bank.wheatLaborAuction.start_time,
          nextBlockTimestamp,
          bank.wheatLaborAuction.sold,
          bank.wheatLaborAuction.price_update_interval,
        )
      : 1;
    console.log({ lordsAmountFromWheat });
    return lordsAmountFromWheat;
  }, [feedResourcesGiveAmounts[254]]);

  useEffect(() => {
    if (donkeysCount * WEIGHT_PER_DONKEY_KG >= divideByPrecision(resourceWeight)) {
      setHasEnoughDonkeys(true);
    } else {
      setHasEnoughDonkeys(false);
    }
  }, [donkeysCount, resourceWeight]);

  const totalResources = useMemo(() => {
    const totalResources: any = {};
    Object.keys(feedResourcesGiveAmounts).forEach((resourceId) => {
      let resourceAmount = getComponentValue(
        Resource,
        getEntityIdFromKeys([BigInt(realmEntityId), BigInt(resourceId)]),
      );
      totalResources[resourceId] = resourceAmount?.balance || 0;
    });
    return totalResources;
  }, [realmEntityId]);

  useEffect(() => {
    const feedResourcesGiveAmounts = {};
    Object.keys(totalResources).forEach((id) => {
      (feedResourcesGiveAmounts[id] = Math.floor(divideByPrecision((totalResources[id] * percentage) / 100))),
        setFeedResourcesGiveAmounts(feedResourcesGiveAmounts);
    });
  }, [percentage]);

  return (
    <div className="flex flex-col items-center p-2">
      <div className="flex flex-col space-y-2 text-xs w-full mb-3">
        <div className="flex justify-between">
          <div className="flex items-center">
            {/* {<OrderIcon order={orderNameDict[order]} size="xs" className="mx-1" />} */}
            {/* <span className="text-white font-bold">{orders[order - 1].fullOrderName}</span> */}
          </div>
          <div className="flex flex-col text-xxs text-right">
            <span className="text-gray-gold italic">State</span>
            {/* <span
              className={clsx(
                !hyperstructureData?.initialized && "text-order-giants",
                hyperstructureData?.completed && "text-order-brilliance",
                hyperstructureData && hyperstructureData?.progress >= 0 && !hyperstructureData?.completed
                  ? "text-gold"
                  : "",
              )}
            >
              {hyperstructureData?.completed
                ? "Completed"
                : hyperstructureData?.initialized
                ? `Building in progress ${hyperstructureData?.progress.toFixed(2)}%`
                : "Not initialized"}
            </span> */}
          </div>
        </div>
        {/* <ProgressBar rounded progress={hyperstructureData?.progress || 0} className="bg-gold" /> */}
      </div>
      {step == 1 && (
        <>
          <div className="flex flex-col space-y-2 text-xs">
            <div className="relative w-full">
              <img src={`/images/buildings/hyperstructure.jpg`} className="object-cover w-full h-full rounded-[10px]" />
              <div className="flex flex-col p-2 absolute left-2 bottom-2 rounded-[10px] bg-black/60">
                <div className="mb-1 ml-1 italic text-light-pink text-xxs">
                  {/* {hyperstructureData?.initialized ? "Resources need to complete:" : "Initialization cost:"} */}
                </div>
                <div className="grid grid-cols-4 gap-1">
                  {[
                    { resourceId: 254, amount: 1000 },
                    { resourceId: 255, amount: 1000 },
                  ].map(({ resourceId, amount }) => (
                    <ResourceCost
                      withTooltip
                      type="vertical"
                      key={resourceId}
                      resourceId={resourceId}
                      amount={divideByPrecision(amount)}
                    />
                  ))}
                </div>
              </div>
            </div>
            <Headline size="big">
              {/* {hyperstructureData?.initialized ? "Feed Hyperstructure" : "Initialize Hyperstructure"}- Step {step} */}
            </Headline>
            <div className="text-xxs mb-2 italic text-gold">
              {`
                To feed the Hyperstructure you need to send any amount of required resources to the Hyperstructure location.
              `}
            </div>

            <div className="text-xxs mb-2 italic text-white">{`Click the "Next" button to select a Realm from which you want to spend resources.`}</div>
          </div>
        </>
      )}
      {step == 2 && (
        <div className="flex flex-col w-full space-y-2">
          <Headline size="big">Select Realm - Step {step}</Headline>
          <div className="text-xxs mb-2 italic text-gold">
            {`Press "Set the amounts" on any Realm with required resources, to set amounts and send caravan to Hyperstructure.`}
          </div>
          {realms.map((realm) => (
            <SelectableRealm
              key={realm.realm_id}
              realm={realm}
              onClick={() => {
                setRealmEntityId(realm.entity_id);
                setStep(step + 1);
              }}
              costs={[]}
              selected={realmEntityId === realm.entity_id}
              initialized={false}
            />
          ))}
        </div>
      )}
      {step == 3 && (
        <>
          <>
            <div className="grid relative grid-cols-9 gap-2 max-h-[350px] overflow-auto mb-4">
              <div className={clsx("flex flex-col items-center  space-y-2 h-min", "col-span-4")}>
                <Headline className="mb-2">You Give</Headline>
                {Object.keys(totalResources).map((_id) => {
                  const id: any = Number(_id);
                  return (
                    <div key={id} className="flex items-center w-full h-8">
                      <NumberInput
                        max={totalResources[id]}
                        min={1}
                        step={targetPrices[id]}
                        value={feedResourcesGiveAmounts[id]}
                        onChange={(value) => {
                          setFeedResourcesGiveAmounts({
                            ...feedResourcesGiveAmounts,
                            [id]: Math.min(divideByPrecision(totalResources[id] || 0), value),
                          });
                        }}
                      />
                      <div className="ml-2">
                        <ResourceCost
                          className=" cursor-pointer"
                          onClick={() => {
                            setFeedResourcesGiveAmounts({
                              ...feedResourcesGiveAmounts,
                              [id]: divideByPrecision(totalResources[id] || 0),
                            });
                          }}
                          resourceId={id}
                          amount={divideByPrecision(totalResources[id] || 0)}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-center">
                <ArrowSeparator className="fixed top-1/6" />
              </div>
              <div className="flex flex-col w-full col-span-4 space-y-2 h-min">
                <Headline className="mb-2">You Get</Headline>
                <div className="w-full flex justify-center">
                  <ResourceCost
                    className="!w-min h-8 cursor-pointer"
                    resourceId={253}
                    amount={lordsAmountFromWheat}
                    onClick={() => {}}
                  />
                </div>
              </div>
            </div>
          </>
          <PercentageSelection setPercentage={setPercentage}></PercentageSelection>
          <SelectCaravanPanel
            className="!p-0"
            donkeysCount={donkeysCount}
            setDonkeysCount={setDonkeysCount}
            isNewCaravan={isNewCaravan}
            setIsNewCaravan={setIsNewCaravan}
            selectedCaravan={selectedCaravan}
            setSelectedCaravan={setSelectedCaravan}
            selectedResourceIdsGet={[]}
            selectedResourcesGetAmounts={[]}
            selectedResourceIdsGive={[]}
            selectedResourcesGiveAmounts={[]}
            resourceWeight={resourceWeight}
            hasEnoughDonkeys={hasEnoughDonkeys}
            headline="Select Caravan - Step 3"
          />
        </>
      )}
      <div className="flex justify-between items-center mt-3 w-full text-xxs">
        <Button
          className="!px-[6px] !py-[2px] text-xxs"
          onClick={() => (step === 1 ? onClose() : setStep(step - 1))}
          variant="outline"
        >
          {step === 1 ? "Cancel" : "Back"}
        </Button>
        <Steps className="absolute -translate-x-1/2 left-1/2 bottom-3" step={step} maxStep={3} />
        {!isLoading && (
          <Button
            className="!px-[6px] !py-[2px] text-xxs ml-auto"
            disabled={!canGoToNextStep}
            isLoading={isLoading}
            onClick={() => {
              if (step == 3) {
                sendResourcesToBank();
              } else {
                setStep(step + 1);
              }
            }}
            variant={canGoToNextStep ? "success" : "outline"}
          >
            {step == 3 ? "Send Caravan" : "Next Step"}
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
    </div>
  );
};
