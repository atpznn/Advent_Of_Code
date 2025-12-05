function getRange(text) {
  return text.split("-").map((x) => parseInt(x));
}
function isHasRangeSymbol(text) {
  return text.includes("-");
}
function seperateListAndSpoiledItem(text) {
  const texts = text
    .split("\n")
    .filter((x) => x != "")
    .map((x) => x.replace("\r", ""));
  return [
    texts.filter(isHasRangeSymbol).join("\n"),
    texts.filter((x) => !isHasRangeSymbol(x)).join("\n"),
  ];
}

function parseSuspect(text) {
  return text
    .split("\n")
    .map((x) => x.trim())
    .filter((x) => x != "")
    .map((x) => parseInt(x));
}
function isFresh(value, rangeText) {
  const [first, last] = getRange(rangeText);
  return value >= first && value <= last;
}
function filterSuspecters(suspecters, freshids) {
  return suspecters.filter((x) => !freshids.some((s) => s == x));
}
const fs = require("fs");
const filePath = "../quiz/day_5/input.txt";
const fileContent = fs.readFileSync(filePath, "utf-8");

const textTest = `3-5
10-14
16-20
12-18
50-70 

1
5
8
11
17
32`;
const [rangeText, suspectText] = seperateListAndSpoiledItem(textTest);
const suspecters = parseSuspect(suspectText);
function isFreshInSomeOneRange(value, rangeTexts) {
  const ranges = rangeTexts.split("\n");
  return ranges.some((x) => isFresh(value, x));
}
const fresh = suspecters.filter((x) => isFreshInSomeOneRange(x, rangeText));
console.log(fresh.length);
// console.log(filterSuspecters(suspecters, fresh).length);
