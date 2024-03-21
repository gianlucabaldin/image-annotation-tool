import React from "react";
import { ACTION_TYPES } from "../utils/types";

const Toolbar: React.FC<{
  setAction: (action: ACTION_TYPES) => void;
}> = ({ setAction }) => {
  return (
    <div className="flex flex-col gap-4 justify-center my-4 px-4 w-64 ">
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2 w-full"
        onClick={() => setAction(ACTION_TYPES.DRAW_RECTANGLE)}
      >
        DRAW RECTANGLE
      </button>
      <button
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2 w-full"
        onClick={() => setAction(ACTION_TYPES.DRAW_CIRCLE)}
      >
        DRAW CIRCLE
      </button>
      <button
        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded w-full"
        onClick={() => setAction(ACTION_TYPES.SELECT)}
      >
        SELECT ELEMENT
      </button>
    </div>
  );
};

export default Toolbar;
