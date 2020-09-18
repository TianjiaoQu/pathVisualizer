import React from "react";
import "./App.css";
import HighlightIcon from "@material-ui/icons/Highlight";
import PathfindingVisualizer from "./PathfindingVisualizer/PathfindingVisualizer";
import introJs from 'intro.js';
import 'intro.js/introjs.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import Icon from './basic/Icon';
// using intro.js
const intro = introJs();

function App() {
  return (
    <div className="App">
      <header>
        <h1>
          <HighlightIcon />
          Path Visualizer
        </h1>
        <Icon touchRadius="8" onClick={() => intro.start()} color="#7f00c4">
            <FontAwesomeIcon icon={faInfoCircle} />
          </Icon>
      </header>
      <PathfindingVisualizer></PathfindingVisualizer>
    </div>
  );
}

export default App;
