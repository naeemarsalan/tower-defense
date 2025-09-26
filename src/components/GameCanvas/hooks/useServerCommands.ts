import { useEffect } from "react";
import { Game } from "../../../game/Game";
import { TowerType } from "../../../towers/TowerFactory";

type PlaceTowerCommand = {
  type: "place_tower";
  position: { x: number; y: number };
  towerType?: string;
  tower_type?: string;
};

type ServerCommand = Record<string, unknown>;

interface Args {
  game: Game | null;
  placeTower: (
    position: { x: number; y: number },
    towerType: TowerType
  ) => boolean | void;
}

const parseTowerType = (type: unknown): TowerType | null => {
  if (typeof type !== "string") return null;

  const normalized = type.toUpperCase();

  if ((Object.values(TowerType) as string[]).includes(normalized)) {
    return normalized as TowerType;
  }

  if (normalized in TowerType) {
    return TowerType[normalized as keyof typeof TowerType];
  }

  return null;
};

const isPlaceTowerCommand = (
  command: ServerCommand
): command is PlaceTowerCommand => {
  if (!command || typeof command !== "object") return false;

  return (command as { type?: unknown }).type === "place_tower";
};

const resolveSocketUrl = () =>
  import.meta.env.VITE_COMMANDS_WS_URL ??
  import.meta.env.VITE_GAME_SERVER_WS ??
  "ws://localhost:3001";

export const useServerCommands = ({ game, placeTower }: Args) => {
  useEffect(() => {
    if (!game) return;
    if (typeof window === "undefined") return;
    if (typeof WebSocket === "undefined") return;

    const url = resolveSocketUrl();

    let socket: WebSocket | null = null;

    try {
      socket = new WebSocket(url);
    } catch (error) {
      console.error("Failed to connect to command socket", error);
      return;
    }

    socket.onmessage = (event) => {
      try {
        const command: ServerCommand = JSON.parse(event.data);

        if (!isPlaceTowerCommand(command)) return;

        const towerType =
          parseTowerType(command.towerType) ?? parseTowerType(command.tower_type);
        if (!towerType) {
          console.warn("Unknown tower type received from server", command);
          return;
        }

        const { position } = command;
        if (
          !position ||
          typeof position.x !== "number" ||
          typeof position.y !== "number"
        ) {
          console.warn("Invalid tower position received from server", command);
          return;
        }

        placeTower({ x: position.x, y: position.y }, towerType);
      } catch (error) {
        console.error("Failed to process server command", error);
      }
    };

    socket.onerror = (event) => {
      console.error("Command socket error", event);
    };

    return () => {
      socket?.close();
    };
  }, [game, placeTower]);
};
