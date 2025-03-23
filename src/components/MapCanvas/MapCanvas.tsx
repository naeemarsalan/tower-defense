import { tileConfig } from "../../constants";
import { CharacterCanvas } from "../CharacterCanvas";
import { useMapInit } from "./hooks/useMapInit";
import { usePathInit } from "./hooks/usePathInit";
import { useGameInit } from "./hooks/useGameInit";

export const MapCanvas = () => {
  const { mapCanvasRef, mapGrid } = useMapInit();

  const { path } = usePathInit(mapGrid);

  const { game } = useGameInit(path);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!game || !mapCanvasRef.current) return;

    const canvas = mapCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Convert pixel coordinates to grid coordinates
    const gridX = Math.floor(x / tileConfig.tileSize);
    const gridY = Math.floor(y / tileConfig.tileSize);

    // Check if the clicked position is within bounds and is a sand tile (0)
    if (
      gridX >= 0 &&
      gridX < tileConfig.mapWidth &&
      gridY >= 0 &&
      gridY < tileConfig.mapHeight &&
      mapGrid[gridY][gridX] === 0
    ) {
      console.log("Adding tower at:", { gridX, gridY });
      game.addTower({ x: gridX, y: gridY });
    } else {
      console.log("Invalid tile for tower placement");
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <canvas
        ref={mapCanvasRef}
        width={tileConfig.mapWidth * tileConfig.tileSize}
        height={tileConfig.mapHeight * tileConfig.tileSize}
        style={{ border: "1px solid black" }}
        onClick={handleCanvasClick}
      />

      {game && path && <CharacterCanvas path={path} game={game} />}
    </div>
  );
};
