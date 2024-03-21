import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import useUIStore from "../../../hooks/store/useUIStore";
import { soundSelector, useUiSounds } from "../../../hooks/useUISound";
import { Position, UIPosition } from "@bibliothecadao/eternum";
import { WarriorModel } from "./models/WarriorModel";
import { Vector3 } from "three";
import { getUIPositionFromColRow } from "../../../utils/utils";
import { ArmyInfoLabel } from "./ArmyInfoLabel";
import { Flag } from "../Flag";

type ArmyProps = {
  info: { contractPos: Position; uiPos: UIPosition; id: bigint; isDead: boolean; order: string };
};

export function Army({ info, ...props }: ArmyProps & JSX.IntrinsicElements["group"]) {
  const { play: playBuildMilitary } = useUiSounds(soundSelector.buildMilitary);
  const animationPaths = useUIStore((state) => state.animationPaths);
  const setAnimationPaths = useUIStore((state) => state.setAnimationPaths);
  const setSelectedEntity = useUIStore((state) => state.setSelectedEntity);

  const animationPath = useMemo(() => animationPaths.find((path) => path.id === info.id), [animationPaths]);

  const startAnimationTimeRef = useRef<number | null>(null);

  const [hovered, setHovered] = useState(false);
  const [position, setPosition] = useState<Vector3>(new Vector3(info.uiPos.x, 0.32, -info.uiPos.y));
  const [rotationY, setRotationY] = useState<number>(0);
  const [isRunning, setIsRunning] = useState(false);

  useFrame(() => {
    // animate
    if (animationPath) {
      const uiPath = animationPath.path.map((pos) => getUIPositionFromColRow(pos.x, pos.y));
      const now = Date.now();
      let timeElapsed = 0;
      const startTime = startAnimationTimeRef.current;
      const timeToComplete = uiPath.length * 1000;
      if (!startTime) {
        setIsRunning(true);
        startAnimationTimeRef.current = now;
      } else {
        timeElapsed = now - startTime;
      }
      const progress = Math.min(timeElapsed / timeToComplete, 1);

      const pathIndex = Math.floor(progress * uiPath.length);
      const currentPath: Position[] = uiPath.slice(pathIndex, pathIndex + 2);

      // stop if progress is >= 1
      if (progress >= 1 || currentPath.length < 2) {
        setIsRunning(false);
        // reset all
        const paths = [...animationPaths];
        const index = paths.indexOf(animationPath);
        if (index > -1) {
          paths.splice(index, 1);
        }
        setAnimationPaths(paths);
        return;
      }

      // calculate progress between 2 points
      const progressBetweenPoints = (progress - (1 / uiPath.length) * pathIndex) / (1 / uiPath.length);

      const currentPos = {
        x: currentPath[0].x + (currentPath[1].x - currentPath[0].x) * progressBetweenPoints,
        y: currentPath[0].y + (currentPath[1].y - currentPath[0].y) * progressBetweenPoints,
      };

      // Determine the direction of movement
      const direction = new Vector3(
        currentPath[1].x - currentPath[0].x,
        0,
        -(currentPath[1].y - currentPath[0].y), // Negate Y to match the Three.js coordinate system
      ).normalize();

      const z = 0.32;
      setPosition(new Vector3(currentPos.x, z, -currentPos.y));

      // Calculate and update rotation to face the direction of movement
      if (!direction.equals(new Vector3(0, 0, 0))) {
        const angle = Math.atan2(direction.x, direction.z);
        setRotationY(angle);
      }
    }
  });

  const onClick = () => {
    if (!info.isDead) {
      setSelectedEntity({ id: info.id, position: info.contractPos });
      playBuildMilitary();
    }
  };

  const onPointerIn = (e: any) => {
    e.stopPropagation();
    setHovered(true);
  };
  const onPointerOut = (e: any) => {
    e.stopPropagation();
    setHovered(false);
  };

  return (
    <>
      {hovered && <ArmyInfoLabel position={info.uiPos} armyId={info.id} />}
      {!info.isDead && <Flag angle={rotationY} order={info.order} position={position}></Flag>}
      <WarriorModel
        {...props}
        position={position}
        rotationY={rotationY}
        onClick={onClick}
        onPointerEnter={onPointerIn}
        onPointerOut={onPointerOut}
        isRunning={isRunning}
        hovered={hovered}
        isDead={info.isDead}
      />
    </>
  );
}
