function formatToList(text) {
  const [numberText, operations] = seperatePart(text);
  const numberFormated = numberText
    .map((x) => cleanEmptyListString(splitEachChar(x)))
    .map((x) => x.map((s) => parseInt(s)));
  const operationsFormated = cleanEmptyListString(splitEachChar(operations));
  return [...numberFormated, operationsFormated];
}
function seperatePart(texts) {
  const operations = texts.slice(texts.length - 1);
  const numbers = texts.filter((x) => x != operations);
  return [numbers, ...operations];
}

function calculateWithSymbol(symbol, [...values]) {
  const [first, ...rest] = values;
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

function isEmpty(state) {
  return state.some((x) => x.length == 0);
}
function splitEachChar(str) {
  return str.split(" ");
}
function cleanEmptyListString(str) {
  return str.map((s) => s.replace(" ", "")).filter((x) => x != "");
}
function splitText(text) {
  return text.split("\n");
}
function summarize(stateFormated) {
  if (isEmpty(stateFormated)) return 0;
  const [head, tail] = splitHeadAndTail(stateFormated);
  const [numbers, symbol] = seperatePart(head);
  return calculateWithSymbol(symbol, numbers) + summarize(tail);
}

const testText = `123 328  51 64 
 45 64  387 23 
  6 98  215 314
*   +   *   +  `;
const fs = require("fs");
const filePath = "../quiz/day_6/input.txt";
const fileContent = fs.readFileSync(filePath, "utf-8");
console.log(summarize(formatToList(splitText(fileContent))));
