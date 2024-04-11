import { RESOURCE_TIERS } from "@bibliothecadao/eternum";
import { getEntityIdFromKeys } from "../../utils/utils";
import { ResourceChip } from "./ResourceChip";
import { useResourceBalance } from "@/hooks/helpers/useResources";

export const EntityResourceTable = ({ entityId }: { entityId: bigint }) => {
  const { useBalance, getBalance, getProductionManager } = useResourceBalance();
  return (
    <div>
      {Object.entries(RESOURCE_TIERS).map(([tier, resourceIds]) => {
        return (
          <div className="my-3 px-3" key={tier}>
            <h5>{tier}</h5>
            <hr />
            <div className="flex my-3 flex-wrap">
              {resourceIds.map((resourceId) => {
                console.log("entityId", entityId);
                const balance = getBalance(entityId, resourceId);

                const [active, rate] = getProductionManager(entityId, resourceId).netRate();

                return (
                  <>
                    <ResourceChip
                      entityId={getEntityIdFromKeys([BigInt(entityId), BigInt(resourceId)])}
                      key={resourceId}
                      balance={balance.balance}
                      resourceId={resourceId}
                    />
                    {active && <p>rate: {active && rate.toString()}</p>}
                  </>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
