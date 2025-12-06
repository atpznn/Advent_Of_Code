function trimLeft(rangeA, rangeB) {
  return {
    from: rangeA.to + 1,
    to: rangeB.to,
  };
}
function trimCenter(rangeA, rangeB) {
  return {
    from: rangeA.to + 1,
    to: rangeB.from - 1,
  };
}
function trimRight(rangeA, rangeB) {
  return {
    from: rangeA.from,
    to: rangeB.from - 1,
  };
}
function findNewExceptions(intercepts, newRange) {
  const filted = intercepts.filter(
    (intercept) => !isThisRangeSmallOrEqualOtherRange(intercept, newRange)
  );
  return filted.flatMap((intercept) => {
    if (isThisRangeSmallOrEqualOtherRange(newRange, intercept))
      return [trimRight(intercept, newRange), trimLeft(newRange, intercept)];

    if (isThisRangeOverlapInLeftHandSideOtherRange(intercept, newRange))
      return [trimLeft(newRange, intercept)];

    if (isThisRangeOverlapInRightHandSideOtherRange(intercept, newRange))
      return [trimRight(intercept, newRange)];

    return [];
  });
}

function isThisRangeSmallOrEqualOtherRange(thisRange, otherRange) {
  return thisRange.from >= otherRange.from && thisRange.to <= otherRange.to;
}
function isThisRangeBiggerThanOtherRange(thisRange, otherRange) {
  return thisRange.from < otherRange.from && thisRange.to > otherRange.to;
}
function isThisRangeOverlapInLeftHandSideOtherRange(thisRange, otherRange) {
  return thisRange.from > otherRange.from && thisRange.from < otherRange.to;
}
function isThisRangeOverlapInRightHandSideOtherRange(thisRange, otherRange) {
  return thisRange.to > otherRange.from && thisRange.to < otherRange.to;
}
function isThisRangeEqualOtherRange(thisRange) {
  return function (otherRange) {
    return thisRange.to == otherRange.to && thisRange.from == otherRange.from;
  };
}
function isThisRangeHaveSomeOverlap(thisRange) {
  return function (otherRange) {
    return (
      isThisRangeSmallOrEqualOtherRange(thisRange, otherRange) ||
      isThisRangeBiggerThanOtherRange(thisRange, otherRange) ||
      isThisRangeOverlapInLeftHandSideOtherRange(thisRange, otherRange) ||
      isThisRangeOverlapInRightHandSideOtherRange(thisRange, otherRange)
    );
  };
}

function mergeRangeAndException(range, otherRange) {
  return {
    from: Math.min(range.from, otherRange.from),
    exceptions: mergeList(range.exceptions, otherRange.exceptions),
    to: Math.max(range.to, otherRange.to),
  };
}

function mergeRange(oldRange, newRange) {
  const mergeToRange = mergeRangeAndException(oldRange, newRange);
  if (newRange.to < oldRange.from)
    return {
      ...mergeToRange,
      exceptions: mergeList(mergeToRange.exceptions, [
        trimCenter(newRange, oldRange),
      ]),
    };

  if (newRange.from > oldRange.to)
    return {
      ...mergeToRange,
      exceptions: mergeList(mergeToRange.exceptions, [
        trimCenter(oldRange, newRange),
      ]),
    };

  const rangeProblems = oldRange.exceptions.filter(
    isThisRangeHaveSomeOverlap(newRange)
  );
  if (rangeProblems.length == 0) return mergeToRange;

  const exceptionWithOutNewRange = oldRange.exceptions.filter(
    (x) => !rangeProblems.some(isThisRangeEqualOtherRange(x))
  );
  return {
    ...mergeToRange,
    exceptions: mergeList(
      exceptionWithOutNewRange,
      findNewExceptions(rangeProblems, newRange)
    ),
  };
}
function mergeList(...a) {
  return a.flat();
}

function isHasRangeSymbol(text) {
  return text.includes("-");
}
const test = `3-5
10-14
16-20
12-18
`;
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
function getRange(text) {
  return text.split("-").map((x) => parseInt(x));
}
function formatRangeAddEmptyException(ranges) {
  return ranges.map((x) => {
    const [from, to] = getRange(x);
    return {
      from,
      to,
      exceptions: [],
    };
  });
}
function splitRange(text) {
  return text
    .split("\n")
    .map((x) => x.trim())
    .filter((x) => x != "");
}
function mergeAllRange(ranges) {
  return ranges.reduce(
    (range1, range2) => mergeRange(range1, range2),
    ranges[0]
  );
}
function solve(text) {
  return mergeAllRange(formatRangeAddEmptyException(splitRange(text)));
}
function countRange(range) {
  const COUNT_IT_SELF = 1;
  return range.to + COUNT_IT_SELF - range.from;
}
function countException(exceptions) {
  const START_COUNTER = 0;
  return exceptions.reduce(
    (sum, exception) => sum + countRange(exception),
    START_COUNTER
  );
}
function countAllRangeAndExceptions(range) {
  return countRange(range) - countException(range.exceptions);
}
const fs = require("fs");
const filePath = "../quiz/day_5/input.txt";
const fileContent = fs.readFileSync(filePath, "utf-8");
const [rangeText] = seperateListAndSpoiledItem(fileContent);
const result = solve(rangeText);
console.log(countAllRangeAndExceptions(result));
