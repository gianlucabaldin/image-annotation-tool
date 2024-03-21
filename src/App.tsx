import React, { useState } from "react";
import Board from "./components/Board";
import Toolbar from "./components/Toolbar";
import { ACTION_TYPES } from "./utils/types";

const App: React.FC = () => {
  const [action, setAction] = useState<ACTION_TYPES | undefined>(undefined);
  return (
    <div className="flex">
      <Board action={action} />
      <Toolbar setAction={setAction} />
    </div>
  );
};

export default App;
