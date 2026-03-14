for (let i = 0; i < numberOfRows; i++) {
  for (let j = 0; j < numberOfCols; j++) {
    let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
    cell.addEventListener("blur", (e) => {
      let address = addressBar.value;
      let [row, col] = getClickedCellValue(address);
      let cellProp = sheetDB[row][col];

      if (cellProp.value === cell.innerText) return;

      console.log(
        "cell inner text is ",
        cell.innerText,
        "for row",
        row,
        "and col",
        col,
      );
      console.log(
        "cell prop value is",
        cellProp.value,
        "for row",
        row,
        "and col",
        col,
      );

      console.log(
        "cell prop formula is",
        cellProp.formula,
        "for row",
        row,
        "and col",
        col,
      );

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
    let evaluatedValue = evaluateInputFormula(inputFormula, address);
    updateCellAndFormula(evaluatedValue, inputFormula, address);
    updateChildrenAddress(address);
  }
});

function updateChildrenAddress(parentAddress) {
  console.log("we are inside update children address");
  let [parentRow, parentCol] = getClickedCellValue(parentAddress);
  let children = sheetDB[parentRow][parentCol].children;
  console.log(
    "children for parentRow",
    parentRow,
    "parentCol",
    parentCol,
    "for parent",
    parentAddress,
    "is",
    children,
  );

  for (let i = 0; i < children.length; i++) {
    console.log(
      "we are inside for loop for update children address with children address as",
      children[i],
      "for row",
      parentRow,
      "for col",
      parentCol,
    );
    let childAdress = children[i];
    let [childRow, childCol] = getClickedCellValue(childAdress);
    let childFormula = sheetDB[childRow][childCol].formula;
    let evaluatedValue = evaluateInputFormula(childFormula, childAdress);
    updateCellAndFormula(evaluatedValue, childFormula, childAdress);
    updateChildrenAddress(childAdress);
  }
}

function removeChildAddress(formula, childAdress) {
  console.log("we are inside remove child address");
  let decodedFormula = formula.split(" ");
  console.log("decoded formula is", decodedFormula);
  for (let i = 0; i < decodedFormula.length; i++) {
    console.log("we are inside for loop for remove child address");
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
