import { ExtrudeGeometry, InstancedMesh, MeshBasicMaterial } from "three";
import HyperstructureFinished from "./hyperstructures/models/HyperstructureFinished";
import { Hexagon, getPositionsAtIndex } from "./HexGrid";
import hexDataJson from "../../geodata/hex/hexData.json";
import useUIStore from "../../hooks/store/useUIStore";

type Hyperstructures = {
  hexMeshRef: React.MutableRefObject<InstancedMesh<ExtrudeGeometry, MeshBasicMaterial> | undefined>;
};

const hexData: Hexagon[] = hexDataJson as Hexagon[];

export const Hyperstructures = ({ hexMeshRef }: Hyperstructures) => {
  const mesh = hexMeshRef.current;

  const hyperstructures = useUIStore((state) => state.hyperstructures);

  return (
    <group>
      {hyperstructures.map((hyperstructure, i) => {
        if (hyperstructure) {
          const {
            position: { x, y },
            uiPosition,
          } = hyperstructure;
          const hexIndex = hexData.findIndex((h) => h.col === x && h.row === y);
          // to have the exact height of the hexagon and place hyperstructure on top
          const hexPosition = mesh ? getPositionsAtIndex(mesh, hexIndex) : undefined;
          return (
            <HyperstructureFinished
              key={i}
              hyperstructure={hyperstructure}
              scale={6}
              position={[uiPosition.x, 10 + (hexPosition?.z || 0), -uiPosition.y]}
            />
          );
        }
      })}
    </group>
  );
};
