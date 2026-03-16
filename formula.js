for (let i = 0; i < numberOfRows; i++) {
  for (let j = 0; j < numberOfCols; j++) {
    let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
    cell.addEventListener("blur", (e) => {
      let address = addressBar.value;
      let [row, col] = getClickedCellValue(address);
      let cellProp = sheetDB[row][col];

      if (cellProp.value === cell.innerText) return;

      cellProp.value = cell.innerText;
      removeChildAddress(cellProp.formula, address);
      cellProp.formula = "";
      updateChildrenAddress(address);
    });
  }
}

let formulaBar = document.querySelector(".formula-bar");

formulaBar.addEventListener("keydown", (e) => {
  let inputFormula = formulaBar.value;

  if (e.key === "Enter" && inputFormula) {
    let address = addressBar.value;
    let [row, col] = getClickedCellValue(address);
    let cellProp = sheetDB[row][col];

    if (inputFormula !== cellProp.formula)
      removeChildAddress(cellProp.formula, address);

    addChildToGraphComponent(inputFormula, address);

    if (isGraphCyclic()) {
      alert("graph contains cycle. Unable to calculate");
      removeChildFromGraphComponent(inputFormula);
      return;
    }

    let evaluatedValue = evaluateInputFormula(inputFormula, address);
    updateCellAndFormula(evaluatedValue, inputFormula, address);
    updateChildrenAddress(address);
  }
});

function addChildToGraphComponent(formula, childAdress) {
  let [childRowID, childColID] = getClickedCellValue(childAdress);

  let encodedFormula = formula.split(" ");

  for (let i = 0; i < encodedFormula.length; i++) {
    let asciiValue = encodedFormula[i].charCodeAt(0);
    if (asciiValue >= 65 && asciiValue <= 90) {
      let [parentRowID, parentColId] = getClickedCellValue(encodedFormula[i]);
      graphComponentMatrix[parentRowID][parentColId].push([
        childRowID,
        childColID,
      ]);
    }
  }
}

function removeChildFromGraphComponent(formula) {
  let encodedFormula = formula.split(" ");

  for (let i = 0; i < encodedFormula.length; i++) {
    let asciiValue = encodedFormula[i].charCodeAt(0);
    if (asciiValue >= 65 && asciiValue <= 90) {
      let [parentRowID, parentColId] = getClickedCellValue(encodedFormula[i]);
      graphComponentMatrix[parentRowID][parentColId].pop();
    }
  }
}

function updateChildrenAddress(parentAddress) {
  let [parentRow, parentCol] = getClickedCellValue(parentAddress);
  let children = sheetDB[parentRow][parentCol].children;

  for (let i = 0; i < children.length; i++) {
    let childAdress = children[i];
    let [childRow, childCol] = getClickedCellValue(childAdress);
    let childFormula = sheetDB[childRow][childCol].formula;
    let evaluatedValue = evaluateInputFormula(childFormula, childAdress);
    updateCellAndFormula(evaluatedValue, childFormula, childAdress);
    updateChildrenAddress(childAdress);
  }
}

function removeChildAddress(formula, childAdress) {
  let decodedFormula = formula.split(" ");

  for (let i = 0; i < decodedFormula.length; i++) {
    let asciiValue = decodedFormula[i].charCodeAt(0);
    if (asciiValue >= 65 && asciiValue <= 90) {
      let [parentRow, parentCol] = getClickedCellValue(decodedFormula[i]);
      let cellProp = sheetDB[parentRow][parentCol];
      let index = cellProp.children.indexOf(childAdress);
      cellProp.children.splice(index, 1);
    }
  }
}

function addChildrenToParent(parentAddress, childAdress) {
  let [parentRow, parentCol] = getClickedCellValue(parentAddress);
  let parentCellProp = sheetDB[parentRow][parentCol];
  if (!parentCellProp.children.includes(childAdress)) {
    parentCellProp.children.push(childAdress);
  }
}

function evaluateInputFormula(inputFormula, childAdress) {
  let encodedFormula = inputFormula.split(" ");
  for (let i = 0; i < encodedFormula.length; i++) {
    let asciiValue = encodedFormula[i].charCodeAt(0);
    if (asciiValue >= 65 && asciiValue <= 90) {
      addChildrenToParent(encodedFormula[i], childAdress);
      let [row, col] = getClickedCellValue(encodedFormula[i]);
      encodedFormula[i] = sheetDB[row][col].value;
    }
  }

  const decodedFormula = encodedFormula.join(" ");

  return eval(decodedFormula);
}

function updateCellAndFormula(evaluatedValue, inputFormula, address) {
  // const address = addressBar.value;
  const [row, col] = getClickedCellValue(address);
  let cell = document.querySelector(`.cell[rid="${row}"][cid="${col}"]`);
  const cellProp = sheetDB[row][col];
  cellProp.formula = inputFormula;
  cell.innerText = evaluatedValue;
  cellProp.value = evaluatedValue;
}
