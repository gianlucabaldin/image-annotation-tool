import React, { useEffect, useState } from "react";
import Board from "./components/Board";
import Toolbar from "./components/Toolbar";
import { ACTION_TYPES, IAnnotation } from "./utils/types";

const App: React.FC = () => {
  const [action, setAction] = useState<ACTION_TYPES | undefined>(undefined);
  const [storedAnnotations, setStoredAnnotations] = useState<
    Array<IAnnotation>
  >([]);

  const saveSession = (annotations: IAnnotation[]) => {
    localStorage.setItem("canvasState", JSON.stringify(annotations));
    alert("Session saved successfully!");
  };

  const deleteSession = () => {
    localStorage.removeItem("canvasState");
    alert("Session deleted successfully!");
    window.location.reload();
  };

  const loadPrevSession = (): any => {
    const canvasStateString = localStorage.getItem("canvasState");
    if (!canvasStateString) return;
    setStoredAnnotations(() => JSON.parse(canvasStateString));
  };

  useEffect(() => {
    loadPrevSession();
  }, []);

  return (
    <>
      <h1 className="text-center text-4xl font-bold mt-4">
        Image Annotation Tool
      </h1>
      <div className="flex">
        <Board
          action={action}
          storedAnnotations={storedAnnotations ?? []}
          saveSession={saveSession}
          deleteSession={deleteSession}
        />
        <Toolbar setAction={setAction} />
      </div>
    </>
  );
};

export default App;
