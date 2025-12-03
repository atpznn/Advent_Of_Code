function cleanText(text) {
  return text.trim();
}

function splitStrWithChar(str, char) {
  return str
    .trim()
    .split(char)
    .map((x) => cleanText(x));
}

function mapToId(line) {
  const [first, last] = splitStrWithChar(line, "-");
  return { first, last };
}

function checkedStringWithIndex(text, index) {
  const head = text.slice(0, index);
  const tail = text.slice(index, text.length);
  return [head, tail];
}

function getHalf(len) {
  return Math.floor(len / 2);
}

function isWordHasInvalidPatternV1(word) {
  const [head, tail] = checkedStringWithIndex(word, getHalf(word.length));
  return head == tail;
}
function isWordHasInvalidPatternV2(index, word) {
  if (index == word.length) return false;
  const [pattern] = checkedStringWithIndex(word, index);
  if (isStrCompleteRepeatPattern(word, pattern)) return true;
  return isWordHasInvalidPattern(index + 1, word);
}

const isStrCompleteRepeatPattern = (str, pattern) =>
  str.replaceAll(pattern, "") == "";
const isLeadingWithZeroes = (text) => !text.startsWith("0");
const onlyInvalidNumber = (num) => isWordHasInvalidPatternV1(num);

function getRangeNumber({ first, last }) {
  return Array.from(
    { length: parseInt(last) - parseInt(first) + 1 },
    (_, index) => `${parseInt(first) + parseInt(index)}`
  );
}
function processTextToInvalidIds(text) {
  return splitStrWithChar(text, ",")
    .map(mapToId)
    .map(getRangeNumber)
    .reduce(
      (answer, range) => [
        ...answer,
        ...range.filter(onlyInvalidNumber).filter(isLeadingWithZeroes),
      ],
      []
    );
}
function summarizeInvelidId(arr) {
  return arr.reduce((sum, str) => sum + parseInt(str), 0);
}
const testInput = `11-22,95-115,998-1012,1188511880-1188511890,222220-222224,
1698522-1698528,446443-446449,38593856-38593862,565653-565659,
824824821-824824827,2121212118-2121212124`;
// console.log(processTextToInvalidIds(fileURLToPath));

const fs = require("fs");
const filePath = "../quiz/day_2/input.txt";
const fileContent = fs.readFileSync(filePath, "utf-8");
console.log(summarizeInvelidId(processTextToInvalidIds(fileContent)));
// console.log(summarizeInvelidId(processTextToInvalidIds(fileContent)));
