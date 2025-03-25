import { useState } from "react";
import { MapCanvas } from "./components/MapCanvas/MapCanvas";

function App() {
  const [currentLevel, setCurrentLevel] = useState(1);

  return (
    <main className="flex flex-col items-center justify-center h-screen w-screen">
      <h1 className="">Tower Defense</h1>
      <h2 className="text-2xl font-bold">Level: {currentLevel}</h2>

      <MapCanvas
        currentLevel={currentLevel}
        setCurrentLevel={setCurrentLevel}
      />
    </main>
  );
}

export default App;
