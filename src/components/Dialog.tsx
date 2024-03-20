import { useState } from "react";

interface DialogProps {
  onClose: () => void;
  onSave: (name: string) => void;
}
const Dialog = ({ onClose, onSave }: DialogProps) => {
  const [label, setLabel] = useState("");

  const handleSave = () => {
    onClose();
    onSave(label);
  };

  return (
    <dialog className="fixed top-0 left-0 w-full h-full bg-transparent flex items-center justify-center">
      <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 z-50"></div>
      <div className="bg-white rounded-lg shadow-xl p-4 w-full max-w-md relative z-50">
        <h2 className="text-xl font-semibold mb-4">Shape label:</h2>
        <input
          type="text"
          className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:border-blue-500"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
        <div className="flex justify-end mt-4">
          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded-md mr-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default Dialog;
