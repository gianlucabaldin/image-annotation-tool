import React from "react";
import Board from "./components/Board";
import Toolbar from "./components/Toolbar";

const App: React.FC = () => {
  return (
    <div className="flex">
      <Board />
      <Toolbar />
    </div>
  );
};

export default App;
