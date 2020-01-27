export function aStar(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  startNode.distance = 0;
  startNode.f = 0;
  const unvisitedNodes = getAllNodes(grid);
  while (!!unvisitedNodes.length) {
    sortNodesByDistance(unvisitedNodes);
    const closestNode = unvisitedNodes.shift();
    // If we encounter a wall, we skip it.
    if (closestNode.isWall) continue;

    // If the closest node is at a distance of infinity,
    // we must be trapped and should therefore stop.
    if (closestNode.distance === Infinity) return visitedNodesInOrder;
    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);
    if (closestNode === finishNode) return visitedNodesInOrder;
    updateUnvisitedNeighbors(closestNode, grid, finishNode);
  }
}

function sortNodesByDistance(unvisitedNodes) {
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.f - nodeB.f);
}

function updateUnvisitedNeighbors(node, grid, finishNode) {
  const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
  for (const neighbor of unvisitedNeighbors) {
    const distance = getDistance(node, neighbor);
    if (neighbor.h === Infinity) {
      neighbor.h = manhattanDistance(neighbor, finishNode);
    }

    const distanceToCompare = node.distance + distance;
    if (distanceToCompare < neighbor.distance) {
      neighbor.distance = distanceToCompare;
      neighbor.previousNode = node;
      neighbor.f = neighbor.distance + neighbor.h;
    }
  }
}
function manhattanDistance(node1, node2) {
  const d1 = Math.abs(node1.row - node2.row);
  const d2 = Math.abs(node1.col - node2.col);
  return d1 + d2;
}
function getDistance(node1, node2) {
  const x1 = node1.row;
  const x2 = node2.row;
  const y1 = node1.col;
  const y2 = node2.col;
  if (x2 < x1 && y1 === y2) return 3;
  else if (x2 > x1 && y1 === y2) return 3;
  else if (y2 < y1 && x1 === x2) return 1;
  else if (y2 > y1 && x1 === x2) return 1;
}
function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const { col, row } = node;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  return neighbors.filter(neighbor => !neighbor.isVisited);
}

function getAllNodes(grid) {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
}
