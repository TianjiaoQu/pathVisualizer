import React, { Component } from "react";
import Node from "./Node/Node";
import { dijkstra, getNodesInShortestPathOrder } from "./algorithms/dijkstra";
import { BFS, shortestPathOrder } from "./algorithms/BFS";
import { DFS } from "./algorithms/DFS";
import { aStar } from "./algorithms/aStar";
import { greedy } from "./algorithms/greedy";
import "./PathfindingVisualizer.css";
import introJs from 'intro.js';
import 'intro.js/introjs.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';


export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
      start_row: 10,
      start_col: 10,
      finish_row: 10,
      finish_col: 35,
      setStart: false,
      setFinish: false
    };
  }
 startIntro(){
    var intro = introJs();
      intro.setOptions({
        steps: [
          { 
            intro: "Thank you for playing with PathVisualizer"
          },
          { 
            intro: "Use mouse to choose your Start <b>(yellow icon)</b> and End <b>(pink icon)</b> position."
          },
          {

            intro: "Click at any other position to set up Walls"
          },
          {
            element: document.getElementById("algorithm"),
            intro: "Play with different Graph Algorithms here",
            position: 'bottom'
          },
          {
            element: document.getElementById("path"),
            intro: "Clear out current path here",
            position: 'bottom'
          },
          {
            element: document.getElementById("board"),
            intro: "Clear out current wall here",
            position: 'bottom'
          }
        ]
      });

      intro.start();
  }
  createNode(col, row) {
    return {
      col,
      row,
      isStart: row === this.state.start_row && col === this.state.start_col,
      isFinish: row === this.state.finish_row && col === this.state.finish_col,
      distance: Infinity,
      isVisited: false,
      isWall: false,
      previousNode: null,
      f: Infinity,
      h: Infinity
    };
  }
  getInitialGrid() {
    const grid = [];
    for (let row = 0; row < 25; row++) {
      const currentRow = [];
      for (let col = 0; col < 42; col++) {
        const node = this.createNode(col, row);
        currentRow.push(node);
      }
      grid.push(currentRow);
    }
    return grid;
  }

  getNewGridWithWallToggled(grid, row, col) {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
      ...node,
      isWall: !node.isWall
    };
    newGrid[row][col] = newNode;
    return newGrid;
  }

  componentDidMount() {
    const grid = this.getInitialGrid();
    this.setState({ grid });
    
  }

  handleMouseDown(row, col, isFinish, isStart) {
    if (isFinish) {
      this.setState({ setFinish: true });
    } else if (isStart) {
      this.setState({ setStart: true });
    } else {
      const newGrid = this.getNewGridWithWallToggled(this.state.grid, row, col);
      this.setState({ grid: newGrid, mouseIsPressed: true });
    }
  }

  handleMouseMove(row, col) {
    if (this.state.setFinish) {
      for (let r = 0; r < 25; r++) {
        for (let c = 0; c < 42; c++) {
          const n = this.state.grid[r][c];
          if (n.isFinish) {
            const newN = {
              ...n,
              isFinish: !n.isFinish
            };
            this.state.grid[r][c] = newN;
          }
        }
      }
      const node = this.state.grid[row][col];
      const newNode = {
        ...node,
        isFinish: true
      };
      this.state.grid[row][col] = newNode;
      this.setState({ finish_row: row, finish_col: col });
    } else if (this.state.setStart) {
      for (let r = 0; r < 25; r++) {
        for (let c = 0; c < 42; c++) {
          const n = this.state.grid[r][c];
          if (n.isStart) {
            const newN = {
              ...n,
              isStart: !n.isStart
            };
            this.state.grid[r][c] = newN;
          }
        }
      }
      const node = this.state.grid[row][col];
      const newNode = {
        ...node,
        isStart: true
      };
      this.state.grid[row][col] = newNode;
      this.setState({ start_row: row, start_col: col });
    }
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    const newGrid = this.getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid });
  }

  handleMouseUp() {
    this.setState({ mouseIsPressed: false, setFinish: false, setStart: false });
  }
  clearBoard() {
    const { grid } = this.state;

    for (let row = 0; row < 25; row++) {
      for (let col = 0; col < 42; col++) {
        const node = grid[row][col];
        if (node.isStart || node.isFinish) {
        } else {
          document.getElementById(`node-${row}-${col}`).className = "node ";
        }
        node.isWall = false;
        node.distance = Infinity;
        node.isVisited = false;
        node.previousNode = null;
        node.f = Infinity;
        node.h = Infinity;
        grid[row][col] = node;
      }
    }
    this.setState({ grid });
  }
  clearPath() {
    const { grid } = this.state;

    for (let row = 0; row < 25; row++) {
      for (let col = 0; col < 42; col++) {
        const node = grid[row][col];
        if (node.isStart || node.isFinish || node.isWall) {
        } else {
          document.getElementById(`node-${row}-${col}`).className = "node ";
          node.isWall = false;
        }
        node.distance = Infinity;
        node.isVisited = false;
        node.previousNode = null;
        node.f = Infinity;
        node.h = Infinity;
        grid[row][col] = node;
      }
    }
    this.setState({ grid });
  }

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 1; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length - 1) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 6 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-visited";
      }, 5 * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 2; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i - 1];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-shortest-path";
      }, 25 * i);
    }
  }

  visualizeDijkstra() {
    this.clearPath();
    const { grid } = this.state;
    const startNode = grid[this.state.start_row][this.state.start_col];
    const finishNode = grid[this.state.finish_row][this.state.finish_col];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  visualizeAStar() {
    this.clearPath();
    const { grid } = this.state;
    const startNode = grid[this.state.start_row][this.state.start_col];
    const finishNode = grid[this.state.finish_row][this.state.finish_col];
    const visitedNodesInOrder = aStar(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  visualizeGreedy() {
    this.clearPath();
    const { grid } = this.state;
    const startNode = grid[this.state.start_row][this.state.start_col];
    const finishNode = grid[this.state.finish_row][this.state.finish_col];
    const visitedNodesInOrder = greedy(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  visualizeBFS() {
    this.clearPath();
    const { grid } = this.state;
    const startNode = grid[this.state.start_row][this.state.start_col];
    const finishNode = grid[this.state.finish_row][this.state.finish_col];
    const visitedNodes = BFS(grid, startNode, finishNode);
    const nodeShortestPathOrder = shortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodes, nodeShortestPathOrder);
  }

  visualizeDFS() {
    this.clearPath();
    const { grid } = this.state;
    const startNode = grid[this.state.start_row][this.state.start_col];
    const finishNode = grid[this.state.finish_row][this.state.finish_col];
    const visitedNodes = DFS(grid, startNode, finishNode);
    const nodeShortestPathOrder = shortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodes, nodeShortestPathOrder);
  }
  render() {
    const { grid, mouseIsPressed } = this.state;

    return (
      <>
        <div className="container">
        <div className="bars" id="algorithm">
         <button onClick={() => this.visualizeDijkstra()}>
            Dijkstra's Algorithm
          </button>
          <button onClick={() => this.visualizeBFS()}>
            Breadth-first Search Algorithm
          </button>
          <button onClick={() => this.visualizeDFS()}>
            Depth-first Search Algorithm
          </button>
          <button onClick={() => this.visualizeAStar()}>
            A * Search Algorithm
          </button>
          <button onClick={() => this.visualizeGreedy()}>
            Greedy Best-first Search Algorithm
          </button>
          
          <button id="board" onClick={() => this.clearBoard()}>Clear Board</button>
          <button id="path" onClick={() => this.clearPath()}>Clear Path</button>
          <FontAwesomeIcon style={{paddingLeft: "20px"}} icon={faInfoCircle} touchRadius="18" onClick={() => this.startIntro()} color="red"/>
        </div>
        </div>
        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const { row, col, isFinish, isStart, isWall } = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      row={row}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseMove={(row, col) => this.handleMouseMove(row, col)}
                      onMouseDown={(row, col, isFinish, isStart) =>
                        this.handleMouseDown(row, col, isFinish, isStart)
                      }
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      onMouseMove={(row, col) => this.handleMouseMove(row, col)}
                      onMouseUp={() => this.handleMouseUp()}
                    ></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}
