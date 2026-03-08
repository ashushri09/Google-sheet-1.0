// storage

let sheetDB = [];

for (let i = 0; i < numberOfRows; i++) {
  let rowDB = [];

  for (let j = 0; j < numberOfCols; j++) {
    const db = {
      isBold: false,
      isItalic: false,
      isUnderline: false,
      alignment: "left",
      fontFamily: "monospace",
      fontSize: 14,
      fontColor: "#000000",
      bgColor: "#000000",
    };

    rowDB.push(db);
  }

  sheetDB.push(rowDB);
}

// selectors for cell properties

let bold = document.querySelector(".bold");
let italic = document.querySelector(".italic");
let underline = document.querySelector(".underline");
let fontSize = document.querySelector(".font-size-prop");
let fontFamily = document.querySelector(".font-family-prop");
let fontColor = document.querySelector(".font-color-prop");
let BGcolor = document.querySelector(".BGcolor-prop");

let alignment = document.querySelectorAll(".alignment");
let leftAlign = alignment[0];
let rightAlign = alignment[1];
let centerAlign = alignment[2];

let activeColorProp = "#d1d8e0";
let inactiveColorProp = "#ecf0f1";

// BOLD

bold.addEventListener("click", () => {
  let address = addressBar.value;
  let [rowId, colId] = getClickedCellValue(address);

  let cell = document.querySelector(`.cell[rid="${rowId}"][cid="${colId}"]`);

  sheetDB[rowId][colId].isBold = !sheetDB[rowId][colId].isBold;

  cell.style.fontWeight = sheetDB[rowId][colId].isBold ? "bold" : "normal";

  bold.style.backgroundColor = sheetDB[rowId][colId].isBold
    ? activeColorProp
    : inactiveColorProp;
});

// ITALIC

italic.addEventListener("click", () => {
  let address = addressBar.value;
  let [rowId, colId] = getClickedCellValue(address);

  let cell = document.querySelector(`.cell[rid="${rowId}"][cid="${colId}"]`);

  sheetDB[rowId][colId].isItalic = !sheetDB[rowId][colId].isItalic;

  cell.style.fontStyle = sheetDB[rowId][colId].isItalic ? "italic" : "normal";

  italic.style.backgroundColor = sheetDB[rowId][colId].isItalic
    ? activeColorProp
    : inactiveColorProp;
});

// UNDERLINE

underline.addEventListener("click", () => {
  let address = addressBar.value;
  let [rowId, colId] = getClickedCellValue(address);

  let cell = document.querySelector(`.cell[rid="${rowId}"][cid="${colId}"]`);

  sheetDB[rowId][colId].isUnderline = !sheetDB[rowId][colId].isUnderline;

  cell.style.textDecoration = sheetDB[rowId][colId].isUnderline
    ? "underline"
    : "none";

  underline.style.backgroundColor = sheetDB[rowId][colId].isUnderline
    ? activeColorProp
    : inactiveColorProp;
});

// FONT SIZE

fontSize.addEventListener("change", () => {
  let address = addressBar.value;
  let [rowId, colId] = getClickedCellValue(address);

  let changedValue = fontSize.value;

  let cell = document.querySelector(`.cell[rid="${rowId}"][cid="${colId}"]`);

  sheetDB[rowId][colId].fontSize = changedValue;

  cell.style.fontSize = changedValue + "px";
});

// FONT FAMILY

fontFamily.addEventListener("change", () => {
  let address = addressBar.value;
  let [rowId, colId] = getClickedCellValue(address);

  let changedValue = fontFamily.value;

  let cell = document.querySelector(`.cell[rid="${rowId}"][cid="${colId}"]`);

  sheetDB[rowId][colId].fontFamily = changedValue;

  cell.style.fontFamily = changedValue;
});

// FONT COLOR

fontColor.addEventListener("change", () => {
  let address = addressBar.value;
  let [rowId, colId] = getClickedCellValue(address);

  let changedValue = fontColor.value;

  let cell = document.querySelector(`.cell[rid="${rowId}"][cid="${colId}"]`);

  sheetDB[rowId][colId].fontColor = changedValue;

  cell.style.color = changedValue;
});

// BACKGROUND COLOR

BGcolor.addEventListener("change", () => {
  let address = addressBar.value;
  let [rowId, colId] = getClickedCellValue(address);

  let changedValue = BGcolor.value;

  let cell = document.querySelector(`.cell[rid="${rowId}"][cid="${colId}"]`);

  sheetDB[rowId][colId].bgColor = changedValue;

  cell.style.backgroundColor = changedValue;
});

// ALIGNMENT

alignment.forEach((alignElem) => {
  alignElem.addEventListener("click", (e) => {
    let address = addressBar.value;
    let [rowId, colId] = getClickedCellValue(address);

    let cell = document.querySelector(`.cell[rid="${rowId}"][cid="${colId}"]`);

    let alignValue = e.target.classList[0];

    sheetDB[rowId][colId].alignment = alignValue;

    cell.style.textAlign = alignValue;

    switch (alignValue) {
      case "left":
        leftAlign.style.backgroundColor = activeColorProp;
        centerAlign.style.backgroundColor = inactiveColorProp;
        rightAlign.style.backgroundColor = inactiveColorProp;
        break;

      case "center":
        leftAlign.style.backgroundColor = inactiveColorProp;
        centerAlign.style.backgroundColor = activeColorProp;
        rightAlign.style.backgroundColor = inactiveColorProp;
        break;

      case "right":
        leftAlign.style.backgroundColor = inactiveColorProp;
        centerAlign.style.backgroundColor = inactiveColorProp;
        rightAlign.style.backgroundColor = activeColorProp;
        break;
    }
  });
});

// attach DB properties when cell clicked

let allCells = document.querySelectorAll(".cell");

for (let i = 0; i < allCells.length; i++) {
  addListenerToAttachCellProperties(allCells[i]);
}

function addListenerToAttachCellProperties(cell) {
  cell.addEventListener("click", () => {
    let address = addressBar.value;
    let [rowId, colId] = getClickedCellValue(address);

    let cellProp = sheetDB[rowId][colId];

    // apply cell properties

    cell.style.fontWeight = cellProp.isBold ? "bold" : "normal";
    cell.style.fontStyle = cellProp.isItalic ? "italic" : "normal";
    cell.style.textDecoration = cellProp.isUnderline ? "underline" : "none";

    cell.style.fontSize = cellProp.fontSize + "px";
    cell.style.fontFamily = cellProp.fontFamily;
    cell.style.color = cellProp.fontColor;
    cell.style.backgroundColor =
      cellProp.bgColor === "#000000" ? "transparent" : cellProp.bgColor;
    cell.style.textAlign = cellProp.alignment;

    // update toolbar UI

    bold.style.backgroundColor = cellProp.isBold
      ? activeColorProp
      : inactiveColorProp;

    italic.style.backgroundColor = cellProp.isItalic
      ? activeColorProp
      : inactiveColorProp;

    underline.style.backgroundColor = cellProp.isUnderline
      ? activeColorProp
      : inactiveColorProp;

    fontColor.value = cellProp.fontColor;
    BGcolor.value = cellProp.bgColor;
    fontSize.value = cellProp.fontSize;
    fontFamily.value = cellProp.fontFamily;

    switch (cellProp.alignment) {
      case "left":
        leftAlign.style.backgroundColor = activeColorProp;
        centerAlign.style.backgroundColor = inactiveColorProp;
        rightAlign.style.backgroundColor = inactiveColorProp;
        break;

      case "center":
        leftAlign.style.backgroundColor = inactiveColorProp;
        centerAlign.style.backgroundColor = activeColorProp;
        rightAlign.style.backgroundColor = inactiveColorProp;
        break;

      case "right":
        leftAlign.style.backgroundColor = inactiveColorProp;
        centerAlign.style.backgroundColor = inactiveColorProp;
        rightAlign.style.backgroundColor = activeColorProp;
        break;
    }
  });
}

// helper

function getClickedCellValue(address) {
  let row = Number(address.slice(1)) - 1;

  let col = address.charCodeAt(0) - 65;

  return [row, col];
}
