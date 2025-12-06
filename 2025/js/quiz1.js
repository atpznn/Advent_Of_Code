const ROTARY_DIAL_SIZE = 100;
const LEFT_SYMBOL = "L";
const RIGHT_SYMBOL = "R";
function moveLeftFromCurrentStateTo(current, value) {
  const differenceValue = current - value;
  if (differenceValue < 0) return ROTARY_DIAL_SIZE - Math.abs(differenceValue);
  return differenceValue;
}
function moveRightFromCurrentStateTo(current, value) {
  const afterSum = current + value;
  if (afterSum == ROTARY_DIAL_SIZE) return 0;
  if (afterSum > ROTARY_DIAL_SIZE) return afterSum - ROTARY_DIAL_SIZE;
  return afterSum;
}
function splitStrWithChar(str, ch) {
  return str.split(ch);
}
function removeAnyEmpty(list) {
  return list.filter((x) => x != "").map((x) => x.trim());
}
function splitAndRemove(str, ch) {
  return removeAnyEmpty(splitStrWithChar(str, ch));
}
function isStrHasThisChar(str, char) {
  return str.includes(char);
}
function getValueAfterSplit(data) {
  return data[0];
}
function splitNumberAndSymbol(text) {
  const symbols = [LEFT_SYMBOL, RIGHT_SYMBOL];
  const useSymbol = symbols.find((x) => text.includes(x));
  if (!useSymbol) return { symbol: "", value: 0 };
  if (isStrHasThisChar(text, useSymbol))
    return {
      symbol: useSymbol,
      value: parseInt(
        getValueAfterSplit(removeAnyEmpty(splitStrWithChar(text, useSymbol)))
      ),
    };
}

function dividedBy(value, divideBy) {
  return value % divideBy;
}

function stateAfterMove(afterMoveState, foundZero) {
  if (afterMoveState == 0) {
    return {
      foundZero: foundZero + 1,
      currentState: afterMoveState,
    };
  }
  return {
    foundZero: foundZero,
    currentState: afterMoveState,
  };
}
function findMoveAction(char) {
  if (char == RIGHT_SYMBOL) return moveRightFromCurrentStateTo;
  if (char == LEFT_SYMBOL) return moveLeftFromCurrentStateTo;
  return null;
}
function totalRoundPassZero(value) {
  return Math.floor(value / ROTARY_DIAL_SIZE);
}
function passZeroValue(char, oldValue, newValue) {
  if (isPassZero(char, oldValue, newValue)) return 1;
  return 0;
}
function isPassZero(char, oldValue, newValue) {
  if (char == RIGHT_SYMBOL)
    return newValue < oldValue && oldValue != ROTARY_DIAL_SIZE;
  if (char == LEFT_SYMBOL) return newValue > oldValue && oldValue != 0;
  return false;
}
function computeStateAndPassZero(symbolValue, oldState, newState) {
  const total = totalRoundPassZero(symbolValue.value);
  const passZero = passZeroValue(
    symbolValue.symbol,
    oldState.currentState,
    newState.currentState
  );
  if (passZero != 0 && newState.currentState == 0) {
    return {
      ...newState,
      foundZero: newState.foundZero + total,
    };
  }
  return {
    ...newState,
    foundZero: newState.foundZero + passZero + total,
  };
}
function tryDialingPad(symbolValues) {
  return symbolValues.reduce(
    ({ foundZero, currentState }, symbolValue) => {
      const valuetoMove = dividedBy(symbolValue.value, ROTARY_DIAL_SIZE);
      const moveAction = findMoveAction(symbolValue.symbol);
      if (moveAction != null) return { foundZero, currentState };
      return computeStateAndPassZero(
        symbolValue,
        { foundZero, currentState },
        stateAfterMove(moveAction(currentState, valuetoMove), foundZero)
      );
    },
    {
      foundZero: 0,
      currentState: 50,
    }
  );
}
function findPassword({ foundZero }) {
  return foundZero;
}
const testInput = `
L68
L30
R48
L5
R60
L55
L1
L99
R14
L82`;

const fs = require("fs");
const filePath = "../quiz/day_1/input.txt";
const fileContent = fs.readFileSync(filePath, "utf-8");
const answer = findPassword(
  tryDialingPad(
    splitAndRemove(testInput, "\n").map((x) => splitNumberAndSymbol(x))
  )
);

console.log(answer);
