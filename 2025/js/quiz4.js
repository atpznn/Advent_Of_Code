const { count } = require("console");

const text = `..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@.`;
function createToArray(text) {
  return text.split("\n").reduce((arr, x) => {
    return [
      ...arr,
      x.split("").reduce((_s, v) => {
        return [..._s, v];
      }, []),
    ];
  }, []);
}
function filterOutboundPosition(position, state) {
  return position.filter(
    ({ x, y }) =>
      (x >= 0 && y >= 0) || (y < state.length && x < state[y]?.length)
  );
}
function adjustcencyTemplate(position) {
  return [
    { x: position[0] - 1, y: position[1] },
    { x: position[0] + 1, y: position[1] },
    { x: position[0] - 1, y: position[1] - 1 },
    { x: position[0], y: position[1] - 1 },
    { x: position[0] + 1, y: position[1] - 1 },
    { x: position[0] - 1, y: position[1] + 1 },
    { x: position[0], y: position[1] + 1 },
    { x: position[0] + 1, y: position[1] + 1 },
  ];
}
function isPaper(state, position) {
  if (state[position[1]] == undefined) return false;
  if (state[position[1]][position[2]]) return false;
  const item = state[position[1]][position[0]];
  if (item == "@") return true;
  return false;
}
function getCountPaperAtThisAdjectcy(state, position) {
  const tiles = filterOutboundPosition(adjustcencyTemplate(position), state);
  return tiles.reduce((sum, { x, y }) => {
    if (isPaper(state, [x, y])) return 1 + sum;
    return sum;
  }, 0);
}

const fs = require("fs");
const { emitWarning } = require("process");
const filePath = "../quiz/day_4/input.txt";
const fileContent = fs.readFileSync(filePath, "utf-8");
// function
function readRemove(state) {
  return state.reduce((acc, x) => {
    return x.reduce((_acc, y) => (y == "x" ? _acc + 1 : _acc), acc);
  }, 0);
}
function clearSymbol(state) {
  return state.reduce((acc, x) => {
    return [...acc, x.reduce((_acc, y) => [..._acc, y == "x" ? "." : y], [])];
  }, []);
}
const map = createToArray(fileContent);
// console.table(map);
function tryToRemoveUntilNotSomethingChange(oldState) {
  const newState = oldState
    .reduce((sum, x, indexY) => {
      return [
        ...sum,
        x.reduce((xumY, y, indexX) => {
          const count = getCountPaperAtThisAdjectcy(oldState, [indexX, indexY]);
          return [...xumY, { indexY, indexX, symbol: y, count }];
        }, []),
      ];
    }, [])
    .map((y) =>
      y.map((x) => (x.count < 4 && x.symbol == "@" ? "x" : x.symbol))
    );
  const stateReadyToUse = clearSymbol(newState);
  //   console.log(readRemove(newState));
  console.table(stateReadyToUse);
  //   console.table(newState);
  //   console.table(oldState);
  const isEqual = isEqualState(stateReadyToUse, oldState);
  console.log("eq", isEqual);
  if (!isEqualState(stateReadyToUse, oldState)) {
    return (
      readRemove(newState) + tryToRemoveUntilNotSomethingChange(stateReadyToUse)
    );
  }
  return readRemove(newState);
  //   console.log(newState);
  //   console.log();
}
function compareRow(rowNew, rowOld) {
  if (rowNew.length == 0 && rowOld.length == 0) return true;
  const [cellNew, ...otherCellNew] = rowNew;
  const [cellOld, ...otherCellOld] = rowOld;
  if (cellNew != cellOld) return false;
  return compareRow(otherCellNew, otherCellOld);
}
function isEqualState(newState, oldState) {
  if (newState.length == 0 && oldState.length == 0) return true;
  const [rowNew, ...otherRowNew] = newState;
  const [rowOld, ...otherRowOld] = oldState;
  if (!compareRow(rowNew, rowOld)) return false;
  return isEqualState(otherRowNew, otherRowOld);
}
console.log(tryToRemoveUntilNotSomethingChange(map));
return;
console.log(
  map
    .reduce((sum, x, indexY) => {
      return [
        ...sum,
        x.reduce((xumY, y, indexX) => {
          const count = getCountPaperAtThisAdjectcy(map, [indexX, indexY]);
          return [...xumY, { indexY, indexX, y, count }];
          //   if (count < 4) {
          // return 1 + xumY;
          //   }
          //   return xumY;
        }, []),
      ];
    }, [])
    // .map((y) => y.map((x) => (x.count <= 4 && x.y == "@" ? "x" : x.y)))
    // .join("\n")

    .reduce((acc, x) => {
      return x.reduce(
        (_acc, y) => (y.y == "@" && y.count < 4 ? _acc + 1 : _acc),
        acc
      );
    }, 0)
);

// console.log(getCountPaperAtThisAdjectcy(map, [0, 0]));
// console.log([1, 1, 2][-2]);
