let ctrlKey;
document.addEventListener("keydown", (e) => {
  ctrlKey = e.ctrlKey;
  console.log("control key was pressed");
});
document.addEventListener("keyup", (e) => {
  ctrlKey = e.ctrlKey;
});

let cutButton = document.querySelector(".cut");
let copyButton = document.querySelector(".copy");
let pasteButton = document.querySelector(".paste");

for (let i = 0; i < rows; i++) {
  for (let j = 0; j < cols; j++) {
    let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);

    handleSelectedCells(cell);
  }
}

let selectedRange = [];

function handleSelectedCells(cell) {
  cell.addEventListener("click", (e) => {
    if (!ctrlKey) return;
    if (selectedRange.length >= 2) {
      defaultSelectedCellUI();
      selectedRange = [];
    }

    cell.style.border = "3px solid #218c74";

    let rid = Number(cell.getAttribute("rid"));
    let cid = Number(cell.getAttribute("cid"));

    selectedRange.push([rid, cid]);
  });
}

function defaultSelectedCellUI() {
  for (let i = 0; i < selectedRange.length; i++) {
    let cell = document.querySelector(
      `.cell[rid="${selectedRange[i][0]}"][cid="${selectedRange[i][1]}"]`,
    );
    cell.style.border = "1px solid lightgrey";
  }
}

let copyData = [];

copyButton.addEventListener("click", (e) => {
  if (selectedRange.length < 2) return;

  // 1. Reset copyData so you don't keep appending to old copies
  copyData = [];

  // 2. Normalize coordinates (ensures it works even if selected backwards)
  let startRow = Math.min(selectedRange[0][0], selectedRange[1][0]);
  let endRow = Math.max(selectedRange[0][0], selectedRange[1][0]);
  let startCol = Math.min(selectedRange[0][1], selectedRange[1][1]);
  let endCol = Math.max(selectedRange[0][1], selectedRange[1][1]);

  // 3. Use <= to include the last row/column of the selection
  for (let i = startRow; i <= endRow; i++) {
    let copyRow = [];
    for (let j = startCol; j <= endCol; j++) {
      // Create a deep copy of the object to avoid reference issues
      let cellProp = JSON.parse(JSON.stringify(sheetDB[i][j]));
      copyRow.push(cellProp);
    }
    copyData.push(copyRow);
  }

  console.log("Data Copied:", copyData);
  defaultSelectedCellUI();
});

cutButton.addEventListener("click", (e) => {
  if (rangeStorage.length < 2) return;

  let [strow, stcol, endrow, endcol] = [
    rangeStorage[0][0],
    rangeStorage[0][1],
    rangeStorage[1][0],
    rangeStorage[1][1],
  ];

  for (let i = strow; i <= endrow; i++) {
    for (let j = stcol; j <= endcol; j++) {
      let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);

      // DB
      let cellProp = sheetDB[i][j];
      cellProp.value = "";
      cellProp.bold = false;
      cellProp.italic = false;
      cellProp.underline = false;
      cellProp.fontSize = 14;
      cellProp.fontFamily = "monospace";
      cellProp.fontColor = "#000000";
      cellProp.BGcolor = "#000000";
      cellProp.alignment = "left";

      // UI
      cell.click();
    }
  }

  defaultSelectedCellsUI();
});

pasteButton.addEventListener("click", (e) => {
  if (copyData.length === 0) return;

  // Get the starting point for the paste (the active cell in address bar)
  let address = addressBar.value;
  let [targetRow, targetCol] = decodeRIDCIDFromAddress(address);

  // Loop through the stored copyData
  for (let i = 0; i < copyData.length; i++) {
    for (let j = 0; j < copyData[i].length; j++) {
      let r = targetRow + i;
      let c = targetCol + j;

      // Ensure we don't paste outside the grid boundaries
      if (r >= rows || c >= cols) continue;

      let cell = document.querySelector(`.cell[rid="${r}"][cid="${c}"]`);
      let data = copyData[i][j];
      let cellProp = sheetDB[r][c];

      // Assign all properties
      cellProp.value = data.value;
      cellProp.bold = data.bold;
      cellProp.italic = data.italic;
      cellProp.underline = data.underline;
      cellProp.fontSize = data.fontSize;
      cellProp.fontFamily = data.fontFamily;
      cellProp.fontColor = data.fontColor;
      cellProp.BGcolor = data.BGcolor;
      cellProp.alignment = data.alignment;

      // Trigger UI update - clicking the cell usually handles
      // the visual refresh in most implementations
      cell.click();
    }
  }
});
