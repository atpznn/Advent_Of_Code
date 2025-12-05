const MAX_CHUNKED = 5000;
function eachArrayNeedToCreate(from, to) {
  if (to - from + 1 <= MAX_CHUNKED) {
    return [to - from];
  }
  return [MAX_CHUNKED, ...eachArrayNeedToCreate(from + MAX_CHUNKED, to)];
}
function createArrayFromCheckedTemplate(checked, from) {
  return checked.reduce(
    ({ lastArr, lastIndex }, to) => {
      return {
        lastArr: [...lastArr, createRangeFromList(lastIndex, lastIndex + to)],
        lastIndex: lastIndex + to,
      };
    },
    { lastArr: [], lastIndex: from }
  ).lastArr;
}

function solveUnit(freshIds, spoiledItem) {
  if (freshIds.length == 0) return false;
  const [freshId, ...restFreshId] = freshIds;
  if (freshId == spoiledItem) return true;
  return solveUnit(restFreshId, spoiledItem);
}
function peakHeadCheakFirst(freshIds, spoiledItem) {
  const [freshId] = freshIds;
  if (freshId > spoiledItem) return false;
  return true;
}
function eachFreshId(freshIdChecked, spoiledItem) {
  if (freshIdChecked.length == 0) return false;
  const [freshIds, ...rest] = freshIdChecked;
  if (!peakHeadCheakFirst(freshIds, spoiledItem)) return false;
  if (solveUnit(freshIds, spoiledItem)) return true;
  return eachFreshId(rest, spoiledItem);
}
function isSpoiledItem(suspenseItems, rangeText) {
  if (suspenseItems.length == 0) return [];
  const [suspenseItem, ...rest] = suspenseItems;
  const [from, to] = toRange(rangeText);
  const needToCreate = eachArrayNeedToCreate(from, to);
  const freshRange = createArrayFromCheckedTemplate(needToCreate, from);
  if (eachFreshId(freshRange, suspenseItem))
    return isSpoiledItem(rest, rangeText);
  return [suspenseItem, ...isSpoiledItem(rest, rangeText)];
}
function checkEachRange(texts, suspenseItems) {
  if (texts.length == 0) return suspenseItems;
  const [text, ...rest] = texts;
  const remain = isSpoiledItem(suspenseItems, text);
  return checkEachRange(rest, remain);
}
function solving(text) {
  const [rangeText, suspenseText] = seperateListAndSpoiledItem(text);
  const suspenseItem = convertAllItem(suspenseText.split("\n"), (x) =>
    parseInt(x)
  );
  const texts = rangeText.split("\n");
  const i = checkEachRange(texts, suspenseItem);
  return suspenseItem.reduce((arr, k) => {
    if (i.some((x) => x == k)) return arr;
    return [...arr, k];
  }, []);
}
function solveV2(text) {
  const s = rangeText.split("\n");
  const itemNeedToCreate = eachArrayNeedToCreate(10, 10000000);
  const item = createArrayFromCheckedTemplate(itemNeedToCreate, 10);
}

function createRangeFromList(from, to) {
  return Array.from({ length: to + 1 - from }, (_, index) => index + from);
}
function mergeArray(lists) {
  return lists.reduce((arr, list) => {
    return [...arr, ...list];
  }, []);
}
function isContain(list, value) {
  return list.some((s) => s === value);
}
function toRange(text) {
  return text.split("-").map((x) => parseInt(x));
}
function createAListId(text) {
  const [from, to] = toRange(text);
  return createRangeFromList(parseInt(from), parseInt(to));
}
function convertAllItem(list, fn) {
  return list.map(fn);
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
function createAllListId(text) {
  const lists = text
    .split("\n")
    .map((x) => x.trim())
    .filter((x) => x != "")
    .map((x) => createAListId(x));
  return mergeArray(lists);
}

function solve(text) {
  const [rangeItem, spoiledItem] = seperateListAndSpoiledItem(text);
  console.log(rangeItem);
  const freshIds = createAllListId(rangeItem.join("\n"));
  console.log(spoiledItem);
  console.log(freshIds);
  return convertAllItem(spoiledItem, (e) => parseInt(e)).filter((x) =>
    isContain(freshIds, x)
  );
}
const testInput = `3-5
10-14
16-20
12-18

1
5
8
11
17
32`;
const fs = require("fs");
const filePath = "../quiz/day_5/input.txt";
const fileContent = fs.readFileSync(filePath, "utf-8");
console.log(solving(fileContent));
