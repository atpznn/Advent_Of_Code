function cleanEmptyListString(str) {
  return str.map((s) => s.replace(" ", "")).filter((x) => x != "");
}
function seperatePart(texts) {
  const operations = texts.splice(texts.length - 1);
  const numbers = texts.filter((x) => x != operations);
  return [numbers, ...operations];
}
function makeNumberUnitWithCephalopodMethod(numberText) {
  return numberText.reduce((num, digit) => num + (digit == 0 ? "" : digit), "");
}
function cephalopodsNumber(stringNumbers) {
  if (isEmpty(stringNumbers)) return [];
  const [head, rest] = splitHeadAndTail(stringNumbers);
  const number = parseInt(makeNumberUnitWithCephalopodMethod(head));
  return [number, ...cephalopodsNumber(rest)];
}

function calculateWithSymbol(symbol, [...values]) {
  const maxNumber = Math.max(...values);
  const mapToStr = values
    .map((x) => x.toString().padStart(maxNumber.toString().length, "0"))
    .map((f) => f.split(""));
  const [first, ...rest] = cephalopodsNumber(mapToStr);
  if (symbol == "-") return rest.reduce((acc, value) => acc - value, first);
  if (symbol == "+") return rest.reduce((acc, value) => acc + value, first);
  if (symbol == "*") return rest.reduce((acc, value) => acc * value, first);
  if (symbol == "/") return rest.reduce((acc, value) => acc / value, first);
}
function splitHeadAndTail(states) {
  return states.reduce((state, order) => {
    const [head, ...rest] = order;
    const [_head, ..._rest] = state;
    if (state.length == 0) return [[head], [rest]];
    return [
      [..._head, head],
      [..._rest.flat(), rest],
    ];
  }, []);
}

function splitText(text) {
  return text.split("\n");
}
const fs = require("fs");
const filePath = "../quiz/day_6/input.txt";
const fileContent = fs.readFileSync(filePath, "utf-8");
// console.log(formatToList(splitText(testText)));
// console.log(createAStructureForCalculate(formatToList(splitText(testText))));

const testText = `123 328  51 64 
 45 64  387 23 
  6 98  215 314
*   +   *   +  `;
function splitAndKeepSpace(text) {
  return text.match(/(\S+)\s*/g);
}

function fillAllSpaceWithZero(text) {
  return text.replaceAll(" ", "0");
}
function toIndexes(operations) {
  const restHead = operations
    .slice(0, operations.length - 1)
    .map((x) => x.replace(" ", ""));
  const last = operations.slice(operations.length - 1);
  return [...restHead, ...last].map((x) => x.length);
}
function parseTextToNumber(numbers) {
  return function (from, to) {
    return numbers.map((str) => {
      const stringToTrim = str.slice(from, to);
      return stringToTrim;
    });
  };
}
function splitNumberTextWithIndexes(numberText, indexes) {
  return indexes.reduce(
    ({ numbers, prevLength }, indexToStoreNumber) => {
      const from = prevLength;
      const to = from + indexToStoreNumber;
      return {
        numbers: [...numbers, parseTextToNumber(numberText)(from, to)],
        prevLength: prevLength + indexToStoreNumber + 1,
      };
    },
    { numbers: [], prevLength: 0 }
  ).numbers;
}
function parseTextToState(text) {
  const [numbers, operations] = seperatePart(splitText(text));
  const filZero = splitAndKeepSpace(operations);
  const indexToSplit = toIndexes(filZero);

  const splitEachNumber = splitNumberTextWithIndexes(numbers, indexToSplit);
  const formatedNumber = splitEachNumber.map((x) =>
    x.map(fillAllSpaceWithZero)
  );
  const mergeSymbol = [
    ...formatedNumber,
    cleanEmptyListString(operations.split(" ")),
  ];
  return mergeSymbol;
}

function isEmpty(state) {
  return state.every((x) => x.length == 0);
}
function summaryV2(mergeSymbol) {
  if (isEmpty(mergeSymbol)) return 0;
  const [states, operations] = seperatePart(mergeSymbol);
  const [operation, ...restOperations] = operations;
  const [state, ...restState] = states;
  const merge = [...restState, restOperations];
  return calculateWithSymbol(operation, state) + summaryV2(merge);
}

console.log(summaryV2(parseTextToState(testText)));
