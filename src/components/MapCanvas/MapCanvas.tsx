import { tileConfig } from "../../constants";
import { CharacterCanvas } from "../CharacterCanvas";
import { useMapInit } from "./hooks/useMapInit";
import { usePathInit } from "./hooks/usePathInit";
import { useGameInit } from "./hooks/useGameInit";
import { useAddTower } from "./hooks/useAddTower";

export const MapCanvas = () => {
  const { mapCanvasRef, mapGrid } = useMapInit();

  const { path } = usePathInit(mapGrid);

  const { game } = useGameInit(path);

  const { addTower } = useAddTower({ mapGrid, game, mapCanvasRef });

  return (
    <div style={{ position: "relative" }}>
      <canvas
        ref={mapCanvasRef}
        width={tileConfig.mapWidth * tileConfig.tileSize}
        height={tileConfig.mapHeight * tileConfig.tileSize}
        style={{ border: "1px solid black" }}
        onClick={addTower}
      />

      {game && path && <CharacterCanvas path={path} game={game} />}
    </div>
  );
};
