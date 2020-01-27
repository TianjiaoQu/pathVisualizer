export function DFS(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];

  const unvisitedNodes = [startNode];
  while (!!unvisitedNodes.length) {
    const closestNode = unvisitedNodes.pop();
    visitedNodesInOrder.push(closestNode);
    // If we encounter a wall, we skip it.
    if (closestNode.isWall) continue;

    closestNode.isVisited = true;

    if (closestNode === finishNode) return visitedNodesInOrder;
    updateUnvisitedNeighbors(closestNode, grid, unvisitedNodes);
  }
}

function updateUnvisitedNeighbors(node, grid, unvisitedNodes) {
  const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
  for (const neighbor of unvisitedNeighbors) {
    unvisitedNodes.push(neighbor);
    neighbor.previousNode = node;
  }
}

function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const { col, row } = node;
  if (row > 0) neighbors.unshift(grid[row - 1][col]);
  if (col < grid[0].length - 1) neighbors.unshift(grid[row][col + 1]);
  if (row < grid.length - 1) neighbors.unshift(grid[row + 1][col]);
  if (col > 0) neighbors.unshift(grid[row][col - 1]);

  return neighbors.filter(neighbor => !neighbor.isVisited);
}
