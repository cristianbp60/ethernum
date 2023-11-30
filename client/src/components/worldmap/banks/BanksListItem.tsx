import Button from "../../../elements/Button";
import { ReactComponent as Map } from "../../../assets/icons/common/map.svg";
import useUIStore from "../../../hooks/store/useUIStore";
import { ReactComponent as Bank } from "../../../assets/icons/common/bank.svg";
import { BankAuction } from "./BankAuction";
import { BankInterface } from "../../../hooks/helpers/useBanks";

type BanksListItemProps = {
  bank: BankInterface;
  onFeed?: () => void;
};

export const BanksListItem = ({ bank, onFeed = undefined }: BanksListItemProps) => {
  const moveCameraToTarget = useUIStore((state) => state.moveCameraToTarget);

  return (
    <div className="flex flex-col p-2 border rounded-md border-gray-gold text-xxs text-gray-gold">
      <div className="flex items-center">
        <div className="flex items-center p-1 -mt-2 -ml-2 border border-t-0 border-l-0 rounded-br-md border-gray-gold">
          {<Bank className="mr-1 text-gold" />}
          <div className={"mt-1"}>{bank.name}</div>
        </div>

        <div className=" text-gold flex ml-auto ">
          <Button
            onClick={() => {
              // moveCameraToTarget(coords as any);
            }}
            variant="outline"
            className="p-1 !h-4 text-xxs !rounded-md"
          >
            <Map className="mr-1 fill-current" />
            Show on map
          </Button>
        </div>
      </div>
      <div className="mr-2 m-1">
        <BankAuction bank={{ ...bank, price: 1 }} />
      </div>
      <div className="flex flex-col w-full mt-3">
        {/* <ProgressBar rounded progress={hyperstructure?.progress || 0} className="bg-white" /> */}
        <div className="flex items-center mt-2">
          {/* <div
            className={clsx(
              "ml-1 italic ",
              !hyperstructure?.initialized && "text-white/70",
              hyperstructure?.completed && "text-order-brilliance",
              hyperstructure && hyperstructure?.progress >= 0 && !hyperstructure?.completed ? "text-gold" : "",
            )}
          >
            {hyperstructure?.completed
              ? "Completed"
              : hyperstructure?.initialized
              ? `Building in progress ${hyperstructure?.progress.toFixed(2)}%`
              : "Not initialized"}
          </div> */}

          {onFeed && (
            <Button
              // disabled={hyperstructure?.completed}
              className="!px-[6px] !py-[2px] text-xxs ml-auto"
              variant="outline"
              onClick={onFeed}
            >
              Send Food
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
