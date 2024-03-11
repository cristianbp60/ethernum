import { getComponentValue } from "@dojoengine/recs";
import { useDojo } from "../../../DojoContext";
import { useCombat } from "../../../hooks/helpers/useCombat";
import { ReactComponent as Pen } from "../../../assets/icons/common/pen.svg";
import useRealmStore from "../../../hooks/store/useRealmStore";
import useUIStore from "../../../hooks/store/useUIStore";
import useBlockchainStore from "../../../hooks/store/useBlockchainStore";
import { ArmyModel } from "./models/ArmyModel";
import {
  divideByPrecision,
  getColRowFromUIPosition,
  getEntityIdFromKeys,
  getUIPositionFromColRow,
} from "../../../utils/utils";
import { CombatInfo, Position, Resource, UIPosition, biomes } from "@bibliothecadao/eternum";
// @ts-ignore
import { useEffect, useMemo, useRef, useState } from "react";
import { Html } from "@react-three/drei";
import { getRealmNameById, getRealmOrderNameById } from "../../../utils/realms";
import clsx from "clsx";
import { OrderIcon } from "../../../elements/OrderIcon";
import { formatSecondsLeftInDaysHours } from "../../cityview/realm/labor/laborUtils";
import ProgressBar from "../../../elements/ProgressBar";
import { useRealm } from "../../../hooks/helpers/useRealm";
import { DEPTH, Hexagon } from "../HexGrid";
import { useExplore } from "../../../hooks/helpers/useExplore";
import { useFrame } from "@react-three/fiber";
import { Group } from "three";
import { useResources } from "../../../hooks/helpers/useResources";
import { ResourceCost } from "../../../elements/ResourceCost";
import { TIME_PER_TICK } from "../../network/EpochCountdown";
import { get } from "lodash";

type ArmiesProps = {
  props?: any;
  hexData: Hexagon[];
};

const BIOMES = biomes as Record<string, { color: string; depth: number }>;

export const Armies = ({ hexData }: ArmiesProps) => {
  const {
    setup: {
      components: { Position },
    },
  } = useDojo();

  const selectedEntity = useUIStore((state) => state.selectedEntity);
  const setSelectedEntity = useUIStore((state) => state.setSelectedEntity);
  const animationPath = useUIStore((state) => state.animationPath);

  const positionOffset: Record<string, number> = {};

  // stary only by showing your armies for now
  const realmEntityIds = useRealmStore((state) => state.realmEntityIds);
  const { getStationaryRealmRaiders } = useCombat();
  const { isExplored } = useExplore();

  const armies = realmEntityIds.flatMap(({ realmEntityId }) => {
    return getStationaryRealmRaiders(realmEntityId);
  });

  const [hoveredArmy, setHoveredArmy] = useState<{ id: bigint; position: UIPosition } | undefined>(undefined);
  const [selectedArmy, setSelectedArmy] = useState<{ id: bigint; position: UIPosition } | undefined>(undefined);

  const onHover = (armyId: bigint, position: UIPosition) => {
    setHoveredArmy({ id: armyId, position });
  };

  const onUnhover = () => {
    setHoveredArmy(undefined);
  };

  const positions = useMemo(
    () =>
      armies
        .map((armyId) => {
          const position = getComponentValue(Position, armyId);
          // if animated army dont display
          if (!position || animationPath?.id === position.entity_id) return;
          const hexIndex = hexData.findIndex((h) => h.col === position.x && h.row === position.y);
          const hex = hexData[hexIndex];
          let z = DEPTH;
          if (hexIndex !== -1 && isExplored(position.x, position.y)) {
            z = 0.32;
          }
          return {
            contractPos: { x: position.x, y: position.y },
            uiPos: { ...getUIPositionFromColRow(position.x, position.y), z: z },
            id: position.entity_id,
          };
        })
        .filter(Boolean) as { contractPos: Position; uiPos: UIPosition; id: bigint }[],
    [armies],
  );

  // clickable
  const onClick = (id: bigint, position: Position) => {
    setSelectedEntity({ id, position });
  };

  // useEffect(() => {
  //   const army = positions.find((army) => army.id === selectedEntity?.id);
  //   if (!selectedEntity) setSelectedArmy(undefined);
  //   if (army) setSelectedArmy({ id: army.id, position: army.uiPos });
  // }, [selectedEntity, positions]);

  return (
    <group>
      {positions.map(({ contractPos, uiPos, id }, i) => {
        let offset = 0;
        if (positionOffset[JSON.stringify(uiPos)]) {
          positionOffset[JSON.stringify(uiPos)] += 1;
          if (positionOffset[JSON.stringify(uiPos)] % 2 === 0) {
            offset = positionOffset[JSON.stringify(uiPos)] * -0.3;
          } else {
            offset = positionOffset[JSON.stringify(uiPos)] * 0.3;
          }
        } else {
          positionOffset[JSON.stringify(uiPos)] = 1;
        }
        return (
          <ArmyModel
            onPointerOver={() => onHover(id, uiPos)}
            onPointerOut={onUnhover}
            onClick={() => onClick(id, contractPos)}
            key={i}
            scale={1}
            position={[uiPos.x + offset, uiPos.z, -uiPos.y]}
          ></ArmyModel>
        );
      })}
      {hoveredArmy && <ArmyInfoLabel position={hoveredArmy.position} armyId={hoveredArmy.id} />}
      {selectedArmy && <ArmyInfoLabel position={selectedArmy.position} armyId={selectedArmy.id} />}
    </group>
  );
};

type TravelingArmiesProps = {
  props?: any;
  hexData: Hexagon[];
};

export const TravelingArmies = ({ hexData }: TravelingArmiesProps) => {
  const {
    setup: {
      components: { Position },
    },
  } = useDojo();
  // stary only by showing your armies for now
  const realmEntityIds = useRealmStore((state) => state.realmEntityIds);
  const animationPath = useUIStore((state) => state.animationPath);
  const setAnimationPath = useUIStore((state) => state.setAnimationPath);
  // const selectedEntity = useUIStore((state) => state.selectedEntity);

  const { getMovingRealmRaiders } = useCombat();
  const { isExplored } = useExplore();

  const startAnimationTimeRef = useRef<number | undefined>(undefined);
  const animatedArmyRef = useRef<Group | null>(null);

  const [hoveredArmy, setHoveredArmy] = useState<{ id: bigint; position: UIPosition } | undefined>(undefined);
  const [selectedArmy, setSelectedArmy] = useState<{ id: bigint; position: UIPosition } | undefined>(undefined);

  const armies = realmEntityIds.flatMap(({ realmEntityId }) => {
    return getMovingRealmRaiders(realmEntityId);
  });

  const onHover = (armyId: bigint, position: UIPosition) => {
    setHoveredArmy({ id: armyId, position });
  };

  const onUnhover = () => {
    setHoveredArmy(undefined);
  };

  useFrame(() => {
    // animate
    if (animationPath && animatedArmyRef.current && startAnimationTimeRef.current) {
      const uiPath = animationPath.path.map((pos) => getUIPositionFromColRow(pos.x, pos.y));
      const now = Date.now();
      const timeElapsed = now - startAnimationTimeRef.current!;
      const timeToComplete = uiPath.length * 1000;
      const progress = Math.min(timeElapsed / timeToComplete, 1);

      const pathIndex = Math.floor(progress * uiPath.length);
      const currentPath: Position[] = uiPath.slice(pathIndex, pathIndex + 2);

      // stop if progress is >= 1
      if (progress >= 1 || currentPath.length < 2) {
        // reset all
        startAnimationTimeRef.current = undefined;
        setAnimationPath(undefined);
        animatedArmyRef.current = null;
        return;
      }

      // calculate progress between 2 points
      const progressBetweenPoints = (progress - (1 / uiPath.length) * pathIndex) / (1 / uiPath.length);

      const currentPos = {
        x: currentPath[0].x + (currentPath[1].x - currentPath[0].x) * progressBetweenPoints,
        y: currentPath[0].y + (currentPath[1].y - currentPath[0].y) * progressBetweenPoints,
      };

      const currentColRow = getColRowFromUIPosition(currentPos.x, currentPos.y);
      const hex = hexData.find((h) => h.col === currentColRow.col && h.row === currentColRow.row);
      const z = DEPTH + (hex ? BIOMES[hex.biome].depth * DEPTH : 0);

      animatedArmyRef.current.position.set(currentPos.x, z, -currentPos.y);
    }
  });

  useEffect(() => {
    if (animationPath) {
      // animate
      startAnimationTimeRef.current = Date.now();
    }
  }, [animationPath]);

  const positions = useMemo(
    () =>
      armies
        .map((armyId) => {
          const position = getComponentValue(Position, armyId);
          if (!position) return;
          const hexIndex = hexData.findIndex((h) => h.col === position.x && h.row === position.y);
          const hex = hexData[hexIndex];
          let z = DEPTH;
          if (hexIndex !== -1 && isExplored(position.x, position.y)) {
            z += BIOMES[hex.biome].depth * DEPTH;
          }
          return {
            contractPos: { x: position.x, y: position.y },
            uiPos: { ...getUIPositionFromColRow(position.x, position.y), z: z },
            id: position.entity_id,
          };
        })
        .filter(Boolean) as { contractPos: Position; uiPos: UIPosition; id: bigint }[],
    [armies],
  );

  // useEffect(() => {
  //   const army = positions.find((army) => army.id === selectedEntity?.id);
  //   if (army) setSelectedArmy({ id: army.id, position: army.uiPos });
  // }, [selectedEntity, positions]);

  return (
    <group>
      {positions
        .filter(({ id }) => id !== animationPath?.id)
        .map(({ uiPos, id }, i) => {
          return (
            <ArmyModel
              onPointerOver={() => onHover(id, uiPos)}
              onPointerOut={onUnhover}
              key={i}
              scale={1}
              position={[uiPos.x, uiPos.z, -uiPos.y]}
            ></ArmyModel>
          );
        })}
      {animationPath && <ArmyModel ref={animatedArmyRef} scale={1}></ArmyModel>}
      {hoveredArmy && <ArmyInfoLabel position={hoveredArmy.position} armyId={hoveredArmy.id} />}
      {selectedArmy && <ArmyInfoLabel position={selectedArmy.position} armyId={selectedArmy.id} />}
    </group>
  );
};

type ArmyInfoLabelProps = {
  position: UIPosition;
  armyId: bigint;
};

const ArmyInfoLabel = ({ position, armyId }: ArmyInfoLabelProps) => {
  const { getEntitiesCombatInfo } = useCombat();

  const {
    setup: {
      components: { TickMove },
    },
  } = useDojo();

  const { getResourcesFromInventory } = useResources();
  const { getRealmAddressName } = useRealm();
  const nextBlockTimestamp = useBlockchainStore((state) => state.nextBlockTimestamp);

  const raider = useMemo(() => {
    return getEntitiesCombatInfo([armyId])[0];
  }, [armyId]);

  const tickMove = raider.entityId ? getComponentValue(TickMove, getEntityIdFromKeys([raider.entityId])) : undefined;
  const isPassiveTravel = raider.arrivalTime && nextBlockTimestamp ? raider.arrivalTime > nextBlockTimestamp : false;

  const currentTick = nextBlockTimestamp ? Math.floor(nextBlockTimestamp / TIME_PER_TICK) : 0;
  const isActiveTravel = tickMove !== undefined ? tickMove.tick >= currentTick : false;

  return (
    <Html scale={1} position={[position.x, position.z, -position.y]}>
      <RaiderInfo
        key={raider.entityId}
        raider={raider}
        getRealmAddressName={getRealmAddressName}
        getResourcesFromInventory={getResourcesFromInventory}
        nextBlockTimestamp={nextBlockTimestamp}
        isPassiveTravel={isPassiveTravel}
        isActiveTravel={isActiveTravel}
      />
    </Html>
  );
};

const RaiderInfo = ({
  raider,
  getRealmAddressName,
  getResourcesFromInventory,
  nextBlockTimestamp,
  isPassiveTravel,
  isActiveTravel,
}: {
  raider: CombatInfo;
  getRealmAddressName: (name: bigint) => string;
  getResourcesFromInventory: (entityId: bigint) => { resources: Resource[]; indices: number[] };
  nextBlockTimestamp: number | undefined;
  isPassiveTravel: boolean;
  isActiveTravel: boolean;
}) => {
  const { entityOwnerId, entityId, health, quantity, attack, defence, originRealmId } = raider;

  const setTooltip = useUIStore((state) => state.setTooltip);
  const attackerAddressName = entityOwnerId ? getRealmAddressName(entityOwnerId) : "";

  const originRealmName = originRealmId ? getRealmNameById(originRealmId) : "";

  const inventoryResources = raider.entityId ? getResourcesFromInventory(raider.entityId) : undefined;

  const isTraveling = isPassiveTravel || isActiveTravel;

  return (
    <div
      className={clsx(
        "w-[300px] flex flex-col p-2 mb-1 bg-black border rounded-md border-gray-gold text-xxs text-gray-gold",
      )}
    >
      <div className="flex items-center text-xxs">
        {entityId.toString() && (
          <div className="flex items-center p-1 -mt-2 -ml-2 italic border border-t-0 border-l-0 text-light-pink rounded-br-md border-gray-gold">
            #{entityId.toString()}
          </div>
        )}
        <div className="flex items-center ml-1 -mt-2">
          {isTraveling && originRealmId?.toString() && (
            <div className="flex items-center ml-1">
              <span className="italic text-light-pink">From</span>
              <div className="flex items-center ml-1 mr-1 text-gold">
                <OrderIcon order={getRealmOrderNameById(originRealmId)} className="mr-1" size="xxs" />
                {originRealmName}
              </div>
            </div>
          )}
          {!isTraveling && originRealmId?.toString() && (
            <div className="flex items-center ml-1">
              <span className="italic text-light-pink">Owned by</span>
              <div className="flex items-center ml-1 mr-1 text-gold">
                <span className={"mr-1"}>{attackerAddressName.slice(0, 10)}</span>
                <OrderIcon order={getRealmOrderNameById(originRealmId)} className="mr-1" size="xxs" />
                {originRealmName}
              </div>
            </div>
          )}
        </div>
        {!isTraveling && (
          <div className="flex ml-auto -mt-2 italic text-gold">
            Idle
            <Pen className="ml-1 fill-gold" />
          </div>
        )}
        {raider.arrivalTime && isTraveling && nextBlockTimestamp && (
          <div className="flex ml-auto -mt-2 italic text-light-pink">
            {isPassiveTravel
              ? formatSecondsLeftInDaysHours(raider.arrivalTime - nextBlockTimestamp)
              : "Arrives Next Tick"}
          </div>
        )}
      </div>
      <div className="flex flex-col mt-2 space-y-2">
        <div className="flex relative justify-between text-xxs text-lightest w-full">
          <div className="flex items-center">
            <div className="flex items-center h-6 mr-2">
              <img src="/images/units/troop-icon.png" className="h-[28px]" />
              <div className="flex ml-1 text-center">
                <div className="bold mr-1">x{quantity}</div>
                Raiders
              </div>
            </div>
          </div>
          <div className="flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center">
            <div
              className="flex items-center h-6 mr-2"
              onMouseEnter={() =>
                setTooltip({
                  position: "top",
                  content: (
                    <>
                      <p className="whitespace-nowrap">Attack power</p>
                    </>
                  ),
                })
              }
              onMouseLeave={() => setTooltip(null)}
            >
              <img src="/images/icons/attack.png" className="h-full" />
              <div className="flex flex-col ml-1 text-center">
                <div className="bold ">{attack}</div>
              </div>
            </div>
            <div
              className="flex items-center h-6 mr-2"
              onMouseEnter={() =>
                setTooltip({
                  position: "top",
                  content: (
                    <>
                      <p className="whitespace-nowrap">Defence power</p>
                    </>
                  ),
                })
              }
              onMouseLeave={() => setTooltip(null)}
            >
              <img src="/images/icons/defence.png" className="h-full" />
              <div className="flex flex-col ml-1 text-center">
                <div className="bold ">{defence}</div>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="text-order-brilliance">{health && health.toLocaleString()}</div>&nbsp;/ {10 * quantity} HP
          </div>
        </div>
        {health && (
          <div className="grid grid-cols-12 gap-0.5">
            <ProgressBar
              containerClassName="col-span-12 !bg-order-giants"
              rounded
              progress={(health / (10 * quantity)) * 100}
            />
          </div>
        )}
        <div className="flex items-center justify-between mt-[8px] text-xxs">
          {inventoryResources && (
            <div className="flex justify-center items-center space-x-1 flex-wrap">
              {inventoryResources.resources.map(
                (resource) =>
                  resource && (
                    <ResourceCost
                      key={resource.resourceId}
                      type="vertical"
                      color="text-order-brilliance"
                      resourceId={resource.resourceId}
                      amount={divideByPrecision(Number(resource.amount))}
                    />
                  ),
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
