import { ComponentPropsWithRef, useState } from "react";
import { OrderIcon } from "./OrderIcon";
import clsx from "clsx";

type RealmBadgeProps = {
  active?: boolean;
  realm: {
    id: number;
    name: string;
    order: string;
  };
} & ComponentPropsWithRef<"div">;

export const RealmBadge = ({ active, realm, className, ...props }: RealmBadgeProps) => {
  const [hovered, setHovered] = useState(false);

  const hoveredOrActive = hovered || active;
  const name = hoveredOrActive ? realm.name : realm.name[0];

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={clsx(
        "flex h-8 p-2 w-auto transition-all duration-200 items-center text-xs text-white border rounded-[10px] cursor-pointer border-gold bg-brown whitespace-nowrap",
        hoveredOrActive ? "max-w-[150px] border-white text-white" : "max-w-[40px]",
        active && `bg-order-${realm.order}`,
        className,
      )}
      {...props}
    >
      <OrderIcon
        order={realm.order}
        size="xxs"
        color={hoveredOrActive ? "white" : undefined}
        withTooltip={false}
        className="mr-1"
      />
      {name}
    </div>
  );
};
