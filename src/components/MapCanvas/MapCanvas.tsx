import { tileConfig } from "../../constants";
import { useMapInit } from "./hooks/useMapInit";
import { useRef, useState } from "react";
import { GameCanvas } from "../GameCanvas/GameCanvas";

export const MapCanvas = () => {
  const [currentLevel, setCurrentLevel] = useState(1);

  const mapCanvasRef = useRef<HTMLCanvasElement>(null);
  const { mapGrid } = useMapInit(mapCanvasRef, currentLevel);

  return (
    <>
      <h2>Level: {currentLevel}</h2>
      <div style={{ position: "relative" }}>
        <canvas
          ref={mapCanvasRef}
          width={tileConfig.mapWidth * tileConfig.tileSize}
          height={tileConfig.mapHeight * tileConfig.tileSize}
          style={{ border: "1px solid black" }}
        />

        <GameCanvas mapGrid={mapGrid} setCurrentLevel={setCurrentLevel} />
      </div>
    </>
  );
};
