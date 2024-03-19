import React from "react";

const Toolbar: React.FC<{
  onCreateRectangle?: () => void;
  onCreateCircle?: () => void;
  onSelect?: () => void;
}> = ({ onCreateRectangle, onCreateCircle, onSelect }) => {
  return (
    <div className="flex flex-col gap-4 justify-center my-4 px-4 w-52 border border-gray-400">
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2 w-full"
        onClick={onCreateRectangle}
      >
        Rettangolo
      </button>
      <button
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2 w-full"
        onClick={onCreateCircle}
      >
        Cerchio
      </button>
      <button
        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded w-full"
        onClick={onSelect}
      >
        Seleziona
      </button>
    </div>
  );
};

export default Toolbar;
