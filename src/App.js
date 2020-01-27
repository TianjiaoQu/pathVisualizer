import React from "react";
import "./App.css";
import HighlightIcon from "@material-ui/icons/Highlight";
import PathfindingVisualizer from "./PathfindingVisualizer/PathfindingVisualizer";

function App() {
  return (
    <div className="App">
      <header>
        <h1>
          <HighlightIcon />
          Path Visualizer
        </h1>
      </header>
      <PathfindingVisualizer></PathfindingVisualizer>
    </div>
  );
}

export default App;
