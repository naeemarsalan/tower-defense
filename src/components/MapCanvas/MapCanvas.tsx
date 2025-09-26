import { tileConfig } from "../../constants";
import { useMapInit } from "./hooks/useMapInit";
import { useRef, useState } from "react";
import { GameCanvas } from "../GameCanvas/GameCanvas";

export const MapCanvas = () => {
  const [currentLevel, setCurrentLevel] = useState(1);

  const mapCanvasRef = useRef<HTMLCanvasElement>(null);
  const { mapGrid } = useMapInit(mapCanvasRef, currentLevel);

  const mapWidthPx = tileConfig.mapWidth * tileConfig.tileSize;
  const mapHeightPx = tileConfig.mapHeight * tileConfig.tileSize;
  const axisOffset = 24;
  const xAxisLabels = Array.from({ length: tileConfig.mapWidth }, (_, x) => x);
  const yAxisLabels = Array.from({ length: tileConfig.mapHeight }, (_, y) => y);

  return (
    <>
      <h2>Level: {currentLevel}</h2>
      <div
        style={{
          position: "relative",
          margin: `${axisOffset}px`,
        }}
      >
        <canvas
          ref={mapCanvasRef}
          width={mapWidthPx}
          height={mapHeightPx}
          style={{ border: "1px solid black" }}
        />

        <GameCanvas mapGrid={mapGrid} setCurrentLevel={setCurrentLevel} />

        <div
          style={{
            position: "absolute",
            top: -axisOffset,
            left: 0,
            width: mapWidthPx,
            display: "flex",
            color: "#fff",
            fontSize: "0.75rem",
            fontFamily: "monospace",
            zIndex: 20,
          }}
        >
          {xAxisLabels.map((label) => (
            <span
              key={`top-${label}`}
              style={{
                width: tileConfig.tileSize,
                textAlign: "center",
              }}
            >
              {label}
            </span>
          ))}
        </div>

        <div
          style={{
            position: "absolute",
            bottom: -axisOffset,
            left: 0,
            width: mapWidthPx,
            display: "flex",
            color: "#fff",
            fontSize: "0.75rem",
            fontFamily: "monospace",
            zIndex: 20,
          }}
        >
          {xAxisLabels.map((label) => (
            <span
              key={`bottom-${label}`}
              style={{
                width: tileConfig.tileSize,
                textAlign: "center",
              }}
            >
              {label}
            </span>
          ))}
        </div>

        <div
          style={{
            position: "absolute",
            left: -axisOffset,
            top: 0,
            height: mapHeightPx,
            display: "flex",
            flexDirection: "column",
            color: "#fff",
            fontSize: "0.75rem",
            fontFamily: "monospace",
            zIndex: 20,
          }}
        >
          {yAxisLabels.map((label) => (
            <span
              key={`left-${label}`}
              style={{
                height: tileConfig.tileSize,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {label}
            </span>
          ))}
        </div>

        <div
          style={{
            position: "absolute",
            right: -axisOffset,
            top: 0,
            height: mapHeightPx,
            display: "flex",
            flexDirection: "column",
            color: "#fff",
            fontSize: "0.75rem",
            fontFamily: "monospace",
            zIndex: 20,
          }}
        >
          {yAxisLabels.map((label) => (
            <span
              key={`right-${label}`}
              style={{
                height: tileConfig.tileSize,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </>
  );
};
