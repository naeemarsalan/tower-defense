import { tileConfig } from "../../constants";
import { memo, useRef } from "react";
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

interface Props {
  mapGrid: number[][];
  setCurrentLevel: React.Dispatch<React.SetStateAction<number>>;
}

export const GameCanvas = memo(({ mapGrid, setCurrentLevel }: Props) => {
  const gameCanvasRef = useRef<HTMLCanvasElement>(null);

  const { spawnedMonsters, game, isPaused, continueGame, gold, lives } =
    useGameInit(mapGrid, setCurrentLevel);

  useGameLoop(game, gameCanvasRef?.current?.getContext("2d"));

  const { addTower } = useAddTower({ mapGrid, game, gameCanvasRef, gold });

  return (
    <>
      <div className="absolute top-0 left-0 p-4 bg-slate-700/30 ">
        <h2>Monsters: {spawnedMonsters}</h2>
        <h2>Gold: {gold}</h2>
        <h2>Lives: {lives}</h2>
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
