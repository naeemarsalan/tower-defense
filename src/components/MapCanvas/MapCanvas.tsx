import { tileConfig } from "../../constants";
import { useMapInit } from "./hooks/useMapInit";
import { usePathInit } from "./hooks/usePathInit";
import { useRef } from "react";
import { GameCanvas } from "../GameCanvas/GameCanvas";

interface Props {
  currentLevel: number;
  setCurrentLevel: React.Dispatch<React.SetStateAction<number>>;
}

export const MapCanvas = ({ currentLevel }: Props) => {
  const mapCanvasRef = useRef<HTMLCanvasElement>(null);

  const { mapGrid } = useMapInit(mapCanvasRef, currentLevel);

  const { path } = usePathInit(mapGrid);

  return (
    <div style={{ position: "relative" }}>
      <canvas
        ref={mapCanvasRef}
        width={tileConfig.mapWidth * tileConfig.tileSize}
        height={tileConfig.mapHeight * tileConfig.tileSize}
        style={{ border: "1px solid black" }}
      />

      <GameCanvas path={path} currentLevel={currentLevel} mapGrid={mapGrid} />
    </div>
  );
};
