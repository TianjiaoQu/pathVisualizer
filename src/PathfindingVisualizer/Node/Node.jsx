import React, { Component } from "react";

import "./Node.css";

export default class Node extends Component {
  render() {
    const {
      col,
      row,
      isFinish,
      isStart,
      isWall,
      onMouseDown,
      onMouseEnter,
      onMouseMove,
      onMouseUp,
      f,
      h
    } = this.props;
    const extraClassName = isFinish
      ? "node-finish"
      : isStart
      ? "node-start"
      : isWall
      ? "node-wall"
      : "";

    return (
      <div
        id={`node-${row}-${col}`}
        className={`node ${extraClassName}`}
        onMouseDown={() => onMouseDown(row, col, isFinish, isStart)}
        onMouseEnter={() => onMouseEnter(row, col)}
        onMouseMove={() => onMouseMove(row, col)}
        onMouseUp={() => onMouseUp()}
      ></div>
    );
  }
}
