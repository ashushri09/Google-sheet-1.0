let graphComponentMatrix = [];

for (let i = 0; i < numberOfRows; i++) {
  let row = [];
  for (let j = 0; j < numberOfCols; j++) {
    row.push([]);
  }

  graphComponentMatrix.push(row);
}

function isGraphCyclic() {
  let visited = [];
  let dfsVisited = [];

  for (let i = 0; i < numberOfRows; i++) {
    let visitedRow = [];
    let dfsVisitedRow = [];

    for (let j = 0; j < numberOfCols; j++) {
      visitedRow.push(false);
      dfsVisitedRow.push(false);
    }
    visited.push(visitedRow);
    dfsVisited.push(dfsVisitedRow);
  }

  for (let i = 0; i < numberOfRows; i++) {
    for (let j = 0; j < numberOfCols; j++) {
      if (visited[i][j] === false) {
        if (
          dfsCycleDetection(graphComponentMatrix, i, j, visited, dfsVisited)
        ) {
          return true;
        }
      }
    }
  }

  return false;
}

function dfsCycleDetection(
  graphComponentMatrix,
  row,
  col,
  visited,
  dfsVisited,
) {
  visited[row][col] = true;
  dfsVisited[row][col] = true;

  for (let c = 0; c < graphComponentMatrix[row][col].length; c++) {
    let [rowChild, colChild] = graphComponentMatrix[row][col][c];
    if (visited[rowChild][colChild] === false) {
      if (
        dfsCycleDetection(
          graphComponentMatrix,
          rowChild,
          colChild,
          visited,
          dfsVisited,
        )
      ) {
        return true;
      }
    } else if (dfsVisited[rowChild][colChild]) {
      return true;
    }
  }
  dfsVisited[row][col] = false;

  return false;
}
