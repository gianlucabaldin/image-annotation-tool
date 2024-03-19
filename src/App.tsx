import React, { useState } from "react";
import Board from "./components/Board";
import Toolbar from "./components/Toolbar";
import { ACTION_TYPES } from "./utils/types";

const App: React.FC = () => {
  const [isDrawing, setIsDrawing] = useState<ACTION_TYPES | null>(null);
  return (
    <>
      <div className="flex">
        <Board action={isDrawing} />
        <Toolbar setAction={setIsDrawing} />
      </div>
      {/* to remove */}
      <p>isDrawing: *{(isDrawing ?? "null").toString()}*</p>
    </>
  );
};

export default App;
