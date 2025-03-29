import { tileConfig } from "../../constants";
import { memo, useRef, useState } from "react";
import { useGameLoop } from "./hooks/useGameLoop";
import { useGameInit } from "./hooks/useGameInit";
import { useAddTower } from "./hooks/useAddTower";
import {
  Button,
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { cn } from "../../utils/styles";
import { TowerType } from "../../towers/TowerFactory";
import {
  Battery100Icon,
  CurrencyDollarIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

interface Props {
  mapGrid: number[][];
  setCurrentLevel: React.Dispatch<React.SetStateAction<number>>;
}

export const GameCanvas = memo(({ mapGrid, setCurrentLevel }: Props) => {
  const gameCanvasRef = useRef<HTMLCanvasElement>(null);

  const { spawnedMonsters, game, isPaused, continueGame, gold, lives } =
    useGameInit(mapGrid, setCurrentLevel);

  useGameLoop(game, gameCanvasRef?.current?.getContext("2d"));

  const [selectedTowerType, setSelectedTowerType] = useState<TowerType>(
    TowerType.SPIKE
  );

  const { addTower } = useAddTower({
    mapGrid,
    game,
    gameCanvasRef,
    gold,
    selectedTowerType,
  });

  return (
    <>
      <div className="absolute top-0 left-[-200px] p-4 bg-slate-700/30 flex flex-col gap-2">
        <h2 className="flex items-center gap-2">
          <UserGroupIcon className="w-6 h-6" />
          Monsters: {spawnedMonsters}
        </h2>
        <h2 className="flex items-center gap-2">
          <CurrencyDollarIcon className="w-6 h-6" /> Money: {gold}
        </h2>
        <h2 className="flex items-center gap-2">
          <Battery100Icon className="w-6 h-6" /> Lives: {lives}
        </h2>
        <div className="flex gap-2 mt-2">
          <img
            src="/towers/stone/base.png"
            alt="Stone Tower"
            className={cn(
              "object-center object-contain w-12 h-12 cursor-pointer",
              selectedTowerType === TowerType.STONE && "border-2 border-white"
            )}
            onClick={() => {
              setSelectedTowerType(TowerType.STONE);
            }}
          />
          <img
            src="/towers/spike/base.png"
            alt="Spike Tower"
            className={cn(
              "object-center object-contain w-12 h-12 cursor-pointer",
              selectedTowerType === TowerType.SPIKE && "border-2 border-white"
            )}
            onClick={() => {
              setSelectedTowerType(TowerType.SPIKE);
            }}
          />
        </div>
      </div>

      <canvas
        ref={gameCanvasRef}
        width={tileConfig.mapWidth * tileConfig.tileSize}
        height={tileConfig.mapHeight * tileConfig.tileSize}
        style={{ position: "absolute", top: 0, left: 0 }}
        onClick={addTower}
      />

      <Dialog
        open={isPaused}
        onClose={() => {
          if (!gameCanvasRef.current) return;
          continueGame(gameCanvasRef.current.getContext("2d"));
        }}
        className="relative z-50"
      >
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="max-w-lg space-y-4 border bg-black p-12">
            <DialogTitle className="font-bold">Great Job</DialogTitle>
            <Description>You've defeated all the monsters!</Description>
            <div className="flex gap-4">
              <Button
                className="cursor-pointer inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white"
                onClick={() => {
                  if (!gameCanvasRef.current) return;
                  continueGame(gameCanvasRef.current.getContext("2d"));
                }}
              >
                Continue
              </Button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
});
