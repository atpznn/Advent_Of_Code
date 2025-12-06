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

function removeMakedPosition(state) {
  return state.reduce((acc, x) => {
    return [...acc, x.reduce((_acc, y) => [..._acc, y == "x" ? "." : y], [])];
  }, []);
}
function markPositionPaperHasMoved(state) {
  return state.map((y) => y.map((x) => (isPaperCanMove(x) ? "x" : x.symbol)));
}
function tryToRemoveUntilNotSomethingChange(oldState) {
  const newState = markPositionPaperHasMoved(
    addCounterEachPaperInState(oldState)
  );
  const removedMakedState = removeMakedPosition(newState);
  if (!isEqualState(removedMakedState, oldState)) {
    return (
      countItemWantToRemove(newState, isMarkedPosition) +
      tryToRemoveUntilNotSomethingChange(removedMakedState)
    );
  }
  return countItemWantToRemove(newState, isMarkedPosition);
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
function addCounterEachPaperInState(state) {
  return state.reduce((sum, x, indexY) => {
    return [
      ...sum,
      x.reduce((xumY, symbol, indexX) => {
        const count = getCountPaperAtThisAdjectcy(state, [indexX, indexY]);
        return [...xumY, { indexY, indexX, symbol, count }];
      }, []),
    ];
  }, []);
}
function isPaperCanMove(state) {
  return state.symbol == "@" && state.count < 4;
}
function countItemWantToRemove(state, fn) {
  return state.reduce((acc, x) => {
    return x.reduce((_acc, y) => (fn(y) ? _acc + 1 : _acc), acc);
  }, 0);
}
const isMarkedPosition = (y) => y == "x";
const paperHasMorethanFour = (state) => isPaperCanMove(state);

function countPaperHasMoved(state) {
  return countItemWantToRemove(state, paperHasMorethanFour);
}
const fs = require("fs");
const filePath = "../quiz/day_4/input.txt";
const fileContent = fs.readFileSync(filePath, "utf-8");
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

const map = createToArray(fileContent);
//solvepart1
console.log(tryToRemoveUntilNotSomethingChange(map));
//solvepart2
console.log(countPaperHasMoved(addCounterEachPaperInState(map)));
