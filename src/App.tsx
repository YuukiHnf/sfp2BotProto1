import "./App.css";
import React from "react";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import {
  changeGeneration,
  selectGeneration,
} from "./features/generation/generationSlicer";

const App: React.VFC = () => {
  const generation = useAppSelector((state) => state.generation.generation);
  const dispatch = useAppDispatch();

  return (
    <>
      <div className="App">
        <button
          type="button"
          onClick={() => dispatch(changeGeneration("First"))}
        >
          FIRST
        </button>
        <button
          type="button"
          onClick={() => dispatch(changeGeneration("Second"))}
        >
          SECOND
        </button>
        <div>Generatioin is {generation}</div>
      </div>
    </>
  );
};

export default App;
