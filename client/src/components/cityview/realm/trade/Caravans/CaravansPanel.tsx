import React, { useEffect, useMemo, useState } from "react";
import { FiltersPanel } from "../../../../../elements/FiltersPanel";
import { FilterButton } from "../../../../../elements/FilterButton";
import { SortPanel } from "../../../../../elements/SortPanel";
import { SortButton, SortInterface } from "../../../../../elements/SortButton";
import { Caravan } from "./Caravan";
import { CaravanDetails } from "../../../../caravans/CaravanDetailsComponent";
import {
  CaravanInterface,
  useGetCaravans,
  useGetRealm,
  useGetRealmCaravans,
} from "../../../../../hooks/graphql/useGraphQLQueries";
import { useDojo } from "../../../../../DojoContext";
import useRealmStore from "../../../../../hooks/store/useRealmStore";

type CaravansPanelProps = {};

export const CaravansPanel = ({}: CaravansPanelProps) => {
  const [activeFilter, setActiveFilter] = useState(false);
  const [showCaravanDetails, setShowCaravanDetails] = useState(false);
  const [selectedCaravan, setSelectedCaravan] =
    useState<CaravanInterface | null>(null);

  const { realmEntityId } = useRealmStore();

  const onClick = (caravan: CaravanInterface) => {
    setShowCaravanDetails(true);
    setSelectedCaravan(caravan);
  };

  const { data: caravanData, status } = useGetCaravans();

  // get realm position

  const { realm } = useGetRealm({ entityId: realmEntityId });
  const caravansData = useGetRealmCaravans(
    realm?.position.x || 0,
    realm?.position.y || 0,
  );

  const sortingParams = useMemo(() => {
    return [
      { label: "Number", sortKey: "number" },
      { label: "Health-bar", sortKey: "health", className: "ml-4" },
      { label: "Items", sortKey: "items", className: "ml-auto mr-4" },
      { label: "Time-left", sortKey: "time", className: "" },
    ];
  }, []);

  const [activeSort, setActiveSort] = useState<SortInterface>({
    sortKey: "number",
    sort: "none",
  });

  return (
    <div className="flex flex-col">
      <FiltersPanel className="px-3 py-2">
        <FilterButton
          active={activeFilter}
          onClick={() => setActiveFilter(!activeFilter)}
        >
          Filter
        </FilterButton>
      </FiltersPanel>
      <SortPanel className="px-3 py-2">
        {sortingParams.map(({ label, sortKey, className }) => (
          <SortButton
            className={className}
            key={sortKey}
            label={label}
            sortKey={sortKey}
            activeSort={activeSort}
            onChange={(_sortKey, _sort) => {
              setActiveSort({
                sortKey: _sortKey,
                sort: _sort,
              });
            }}
          />
        ))}
      </SortPanel>
      {selectedCaravan && showCaravanDetails && (
        <CaravanDetails
          caravan={selectedCaravan}
          onClose={() => setShowCaravanDetails(false)}
        />
      )}
      {caravansData &&
        caravansData.caravans &&
        caravansData.caravans.map((caravan) => (
          <div className="flex flex-col p-2">
            <Caravan caravan={caravan} onClick={() => onClick(caravan)} />
          </div>
        ))}
    </div>
  );
};
