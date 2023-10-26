import { uuid } from "@latticexyz/utils";
import { ClientComponents } from "./createClientComponents";
import { getEntityIdFromKeys } from "../utils/utils";
import { Type, getComponentValue } from "@latticexyz/recs";
import { Resource } from "../types";
import { LaborCostInterface } from "../hooks/helpers/useLabor";
import { LABOR_CONFIG } from "@bibliothecadao/eternum";
import {
  CancelFungibleOrderProps,
  EmptyResourcesChestProps,
  CreateOrderProps,
  CreateRoadProps,
  HarvestLaborProps,
  PurchaseLaborProps,
  BuildLaborProps,
} from "@bibliothecadao/eternum";

export const HIGH_ENTITY_ID = 9999999999;

export function createOptimisticSystemCalls({
  Trade,
  Status,
  Labor,
  Resource,
  Road,
  ResourceDetached,
  ResourcesChest,
  Inventory,
}: ClientComponents) {
  function optimisticCreateOrder(systemCall: (args: any) => Promise<any>) {
    return async function (this: any, args: CreateOrderProps): Promise<void | number> {
      const {
        maker_id,
        maker_resource_types,
        maker_resource_amounts,
        maker_transport_id: transport_id,
        taker_id,
        // donkeys_quantity,
        taker_resource_types,
        taker_resource_amounts,
      } = args;

      const expires_at = Math.floor(Date.now() / 1000 + 2628000);

      // optimisitc rendering of trade
      const overrideId = uuid();
      const trade_id = getEntityIdFromKeys([BigInt(HIGH_ENTITY_ID)]);
      const maker_resources_chest_id = getEntityIdFromKeys([BigInt(HIGH_ENTITY_ID + 1)]);
      const taker_resources_chest_id = getEntityIdFromKeys([BigInt(HIGH_ENTITY_ID + 2)]);
      const maker_transport_id = transport_id || getEntityIdFromKeys([BigInt(HIGH_ENTITY_ID + 3)]);
      // const key = getEntityIdFromKeys([BigInt(HIGH_ENTITY_ID + 4)]);

      Trade.addOverride(overrideId, {
        entity: trade_id,
        value: {
          maker_id: maker_id as Type.Number,
          taker_id: taker_id as Type.Number,
          maker_resources_chest_id,
          taker_resources_chest_id,
          maker_transport_id: maker_transport_id as Type.Number,
          expires_at,
        },
      });
      Status.addOverride(overrideId, {
        entity: trade_id,
        value: { value: 0 },
      });
      ResourcesChest.addOverride(overrideId, {
        entity: maker_resources_chest_id,
        value: { resources_count: maker_resource_types.length },
      });
      ResourcesChest.addOverride(overrideId, {
        entity: taker_resources_chest_id,
        value: { resources_count: taker_resource_types.length },
      });
      for (let i = 0; i < maker_resource_amounts.length; i++) {
        ResourceDetached.addOverride(overrideId, {
          entity: getEntityIdFromKeys([BigInt(maker_resources_chest_id), BigInt(i)]),
          value: {
            resource_type: maker_resource_types[i] as Type.Number,
            resource_amount: maker_resource_amounts[i] as Type.Number,
          },
        });
      }
      for (let i = 0; i < taker_resource_amounts.length; i++) {
        ResourceDetached.addOverride(overrideId, {
          entity: getEntityIdFromKeys([BigInt(taker_resources_chest_id), BigInt(i)]),
          value: {
            resource_type: taker_resource_types[i] as Type.Number,
            resource_amount: taker_resource_amounts[i] as Type.Number,
          },
        });
      }

      try {
        return systemCall(args);
      } finally {
        Trade.removeOverride(overrideId);
        Status.removeOverride(overrideId);
      }
    };
  }

  // note: claim fungible order is actually transferring from the resourceschest to the realm
  function optimisticEmptyResourcesChest(
    resourcesGet: Resource[],
    systemCall: (args: EmptyResourcesChestProps) => Promise<void>,
  ) {
    return async function (this: any, args: EmptyResourcesChestProps) {
      const { receiver_id, carrier_id, resources_chest_id } = args;

      let overrideId = uuid();

      // remove resources from inventory
      Inventory.addOverride(overrideId, {
        entity: getEntityIdFromKeys([BigInt(carrier_id)]),
        value: {
          count: 0,
        },
      });

      // remove resources from chest
      ResourcesChest.addOverride(overrideId, {
        entity: getEntityIdFromKeys([BigInt(resources_chest_id)]),
        value: {
          resources_count: 0,
        },
      });

      // add resources to balance
      for (let resource of resourcesGet) {
        let resource_id = getEntityIdFromKeys([BigInt(receiver_id), BigInt(resource.resourceId)]);
        let currentResource = getComponentValue(Resource, resource_id) || {
          balance: 0,
        };
        let balance = currentResource.balance + resource.amount;
        Resource.addOverride(overrideId + resource.resourceId, {
          entity: resource_id,
          value: {
            balance,
          },
        });
      }

      try {
        await systemCall(args);
      } finally {
        Trade.removeOverride(overrideId);
        for (let resource of resourcesGet) {
          Resource.removeOverride(overrideId + resource.resourceId);
        }
      }
    };
  }

  function optimisticAcceptOffer(tradeId: number, takerId: number, systemCall: () => Promise<void>) {
    return async function (this: any) {
      const overrideId = uuid();
      let trade_id = getEntityIdFromKeys([BigInt(tradeId)]);
      let taker_id = getEntityIdFromKeys([BigInt(takerId)]);
      // change status from open to accepted
      Status.addOverride(overrideId, {
        entity: trade_id,
        value: { value: 1 },
      });
      // change trade taker_id to realm
      Trade.addOverride(overrideId, {
        entity: trade_id,
        value: { taker_id },
      });

      // TODO: remove resources from the realm balance

      try {
        await systemCall(); // Call the original function with its arguments and correct context
      } finally {
        // remove overrides
        Status.removeOverride(overrideId);
        Trade.removeOverride(overrideId);
      }
    };
  }

  function optimisticCancelOffer(systemCall: (args: CancelFungibleOrderProps) => Promise<void>) {
    return async function (this: any, args: CancelFungibleOrderProps) {
      const { trade_id: tradeId } = args;

      const overrideId = uuid();
      let trade_id = getEntityIdFromKeys([BigInt(tradeId)]);
      // change status from open to accepted
      Status.addOverride(overrideId, {
        entity: trade_id,
        value: { value: 2 },
      });

      try {
        await systemCall(args); // Call the original function with its arguments and correct context
      } finally {
        // remove overrides
        Status.removeOverride(overrideId);
      }
    };
  }

  function optimisticBuildLabor(
    ts: number,
    costResources: LaborCostInterface[],
    laborAuctionAverageCoefficient: number,
    systemCall: (args: PurchaseLaborProps & BuildLaborProps) => Promise<void>,
  ) {
    return async function (this: any, args: PurchaseLaborProps & BuildLaborProps) {
      const { entity_id: realmEntityId, resource_type: resourceId, labor_units: laborUnits, multiplier } = args;

      const overrideId = uuid();
      const resource_id = getEntityIdFromKeys([BigInt(realmEntityId), BigInt(resourceId)]);

      for (let i = 0; i < costResources.length; i++) {
        let costId = getEntityIdFromKeys([BigInt(realmEntityId), BigInt(costResources[i].resourceId)]);
        let currentResource = getComponentValue(Resource, costId) || {
          balance: 0,
        };
        let balance =
          currentResource.balance -
          Math.floor(
            (laborUnits as number) * (multiplier as number) * costResources[i].amount * laborAuctionAverageCoefficient,
          );
        Resource.addOverride(overrideId + i, {
          entity: costId,
          value: {
            balance,
          },
        });
      }

      // compute new values
      let labor = getComponentValue(Labor, resource_id) || {
        balance: ts,
        last_harvest: ts,
        multiplier: 1,
      };

      let additional_labor = (laborUnits as number) * LABOR_CONFIG.base_labor_units;
      let new_balance: number = labor.balance;
      let new_last_harvest: number = labor.last_harvest;
      if (labor.balance <= ts) {
        new_last_harvest += ts - labor.balance;
        new_balance = ts + additional_labor;
      } else {
        new_balance += additional_labor;
      }

      Labor.addOverride(overrideId, {
        entity: resource_id,
        value: {
          multiplier: multiplier as number,
          balance: new_balance,
          last_harvest: new_last_harvest,
        },
      });

      try {
        await systemCall(args); // Call the original function with its arguments and correct context
      } finally {
        // remove overrides
        Labor.removeOverride(overrideId);
        // remove resource overrides
        for (let i = 0; i < costResources.length; i++) {
          Resource.removeOverride(overrideId + i);
        }
      }
    };
  }

  function optimisticHarvestLabor(ts: number, systemCall: (args: HarvestLaborProps) => Promise<void>) {
    return async function (this: any, args: HarvestLaborProps) {
      const { realm_id, resource_type } = args;

      const overrideId = uuid();
      const resource_id = getEntityIdFromKeys([BigInt(realm_id), BigInt(resource_type)]);

      // compute new values
      let labor = getComponentValue(Labor, resource_id) || {
        balance: ts,
        last_harvest: ts,
        multiplier: 1,
      };
      let laborGenerated = labor.balance <= ts ? labor.balance - labor.last_harvest : ts - labor.last_harvest;
      let laborUnharvested = labor.balance <= ts ? 0 : labor.balance - ts;
      let laborUnitsGenerated = Math.floor(laborGenerated / LABOR_CONFIG.base_labor_units);
      let remainder = laborGenerated - laborUnitsGenerated * LABOR_CONFIG.base_labor_units;
      const balance = ts + remainder + laborUnharvested;
      const isFood = resource_type === 255 || resource_type === 254 ? true : false;

      Labor.addOverride(overrideId, {
        entity: resource_id,
        value: {
          multiplier: labor.multiplier,
          balance,
          last_harvest: ts,
        },
      });

      let currentResource = getComponentValue(Resource, resource_id) || {
        balance: 0,
      };
      let resourceBalance = isFood
        ? laborUnitsGenerated * LABOR_CONFIG.base_food_per_cycle * labor.multiplier
        : laborUnitsGenerated * LABOR_CONFIG.base_resources_per_cycle;
      Resource.addOverride(overrideId, {
        entity: resource_id,
        value: {
          balance: resourceBalance + currentResource.balance,
        },
      });

      try {
        await systemCall(args); // Call the original function with its arguments and correct context
      } finally {
        // remove overrides
        Labor.removeOverride(overrideId);
        Resource.removeOverride(overrideId);
      }
    };
  }

  function optimisticBuildRoad(systemCall: (args: CreateRoadProps) => Promise<void>) {
    return async function (this: any, args: CreateRoadProps) {
      const { creator_id, start_coord, end_coord, usage_count } = args;
      const overrideId = uuid();
      // change status from open to accepted
      let usageCount = usage_count as Type.Number;
      Road.addOverride(overrideId, {
        entity: getEntityIdFromKeys([
          BigInt(start_coord.x),
          BigInt(start_coord.y),
          BigInt(end_coord.x),
          BigInt(end_coord.y),
        ]),
        value: { usage_count: usageCount },
      });

      let { balance } = getComponentValue(Resource, getEntityIdFromKeys([BigInt(creator_id), BigInt(2)])) || {
        balance: 0,
      };

      // change trade taker_id to realm
      Resource.addOverride(overrideId, {
        entity: getEntityIdFromKeys([BigInt(creator_id), BigInt(2)]),
        value: {
          // 10 stone per usage
          balance: balance - usageCount * 10,
        },
      });

      try {
        await systemCall(args); // Call the original function with its arguments and correct context
      } finally {
        // remove overrides
        Road.removeOverride(overrideId);
        Resource.removeOverride(overrideId);
      }
    };
  }

  return {
    optimisticEmptyResourcesChest,
    optimisticCreateOrder,
    optimisticAcceptOffer,
    optimisticCancelOffer,
    optimisticBuildLabor,
    optimisticHarvestLabor,
    optimisticBuildRoad,
  };
}
