let numberOfRows = 100;
let numberOfCols = 26;

let addressColCont = document.querySelector(".address-col-cont");
let adressRowCont = document.querySelector(".address-row-cont");
let cellCont = document.querySelector(".cell-cont");
let addressBar = document.querySelector(".address-bar");

for (let i = 0; i < numberOfRows; i++) {
  let addressCol = document.createElement("div");
  addressCol.setAttribute("class", "address-col");
  addressCol.innerText = i + 1;
  addressColCont.appendChild(addressCol);
}

for (let i = 0; i < numberOfCols; i++) {
  let rowCol = document.createElement("div");
  rowCol.innerText = String.fromCharCode(65 + i);
  rowCol.setAttribute("class", "row-col");
  adressRowCont.appendChild(rowCol);
}

for (let i = 0; i < numberOfRows; i++) {
  let rowCont = document.createElement("div");
  rowCont.setAttribute("class", "row-cont");
  for (let j = 0; j < numberOfCols; j++) {
    let cell = document.createElement("div");
    cell.setAttribute("class", "cell");
    cell.setAttribute("contentEditable", "true");
    rowCont.appendChild(cell);
    addListnerForAddressBarDisplay(cell, i, j);
  }
  cellCont.appendChild(rowCont);
}

function addListnerForAddressBarDisplay(cell, i, j) {
  cell.addEventListener("click", (e) => {
    let rowId = i + 1;
    let colId = String.fromCharCode(65 + j);
    addressBar.value = `${colId}${rowId}`;
  });
}
