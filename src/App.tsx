import React, { useState } from "react";
import Board from "./components/Board";
import Toolbar from "./components/Toolbar";
import { ACTION_TYPES } from "./utils/types";

const App: React.FC = () => {
  const [action, setAction] = useState<ACTION_TYPES | undefined>(undefined);
  return (
    <>
      <h1 className="text-center text-4xl font-bold mt-4">
        Image Annotation Tool
      </h1>
      <div className="flex">
        <Board action={action} />
        <Toolbar setAction={setAction} />
      </div>
    </>
  );
};

export default App;
