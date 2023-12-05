import { getComponentValue } from "@latticexyz/recs";
import { useDojo } from "../../DojoContext";
import useBlockchainStore from "../store/useBlockchainStore";
import { getEntityIdFromKeys } from "../../utils/utils";

export enum LevelIndex {
  FOOD = 1,
  RESOURCE = 2,
  TRAVEL = 3,
  COMBAT = 4,
}

const LEVEL_DECAY = 0.1;
const LEVEL_BASE_MULTIPLIER = 25;

export function useLevel() {
  const {
    setup: {
      components: { Level },
    },
  } = useDojo();

  const nextBlockTimestamp = useBlockchainStore((state) => state.nextBlockTimestamp);

  const getEntityLevel = (entityId: number): { level: number; timeLeft: number; percentage: number } | undefined => {
    const level = getComponentValue(Level, getEntityIdFromKeys([BigInt(entityId)])) || {
      level: 0,
      valid_until: nextBlockTimestamp,
    };

    let trueLevel = level.level;
    // calculate true level
    if (level.valid_until > nextBlockTimestamp) {
      trueLevel = level.level;
    } else {
      const weeksPassed = Math.floor((nextBlockTimestamp - level.valid_until) / 604800) + 1;
      trueLevel = Math.max(0, level.level - weeksPassed);
    }

    let timeLeft: number;
    if (trueLevel === 0) {
      timeLeft = 0;
    } else {
      if (nextBlockTimestamp >= level.valid_until) {
        timeLeft = 604800 - ((nextBlockTimestamp - level.valid_until) % 604800);
      } else {
        timeLeft = level.valid_until - nextBlockTimestamp;
      }
    }

    let percentage = 100;
    if (trueLevel === 1) {
      percentage = 125;
    } else if (trueLevel === 2) {
      percentage = 150;
    } else if (trueLevel === 3) {
      percentage = 200;
    }
    return { level: trueLevel, timeLeft, percentage };
  };

  const getRealmLevelBonus = (level: number, levelIndex: LevelIndex) => {
    if (level < 5) {
      return 100;
    } else {
      let tier = (level % 4) + 1 > levelIndex ? Math.floor(level / 4) + 1 : Math.floor(level / 4);
      return Math.round(((1 - (1 - LEVEL_DECAY) ** (tier - 1)) / LEVEL_DECAY) * LEVEL_BASE_MULTIPLIER) + 100;
    }
  };

  return {
    getEntityLevel,
    getRealmLevelBonus,
  };
}
