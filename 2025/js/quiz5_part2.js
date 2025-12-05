function trimLeft(thisRange, otherRange) {
  return {
    from: thisRange.to + 1,
    to: otherRange.to,
  };
}
function trimRight(thisRange, otherRange) {
  return {
    from: thisRange.from,
    to: otherRange.from - 1,
  };
}
function findNewExceptions(intercepts, newRange) {
  const filted = intercepts.filter(
    (intercept) => !isThisRangeSmallOrEqualOtherRange(intercept, newRange)
  );
  return filted.flatMap((intercept) => {
    if (isThisRangeSmallOrEqualOtherRange(newRange, intercept)) {
      return [trimRight(intercept, newRange), trimLeft(newRange, intercept)];
    }
    if (isThisRangeOverlapInLeftHandSideOtherRange(intercept, newRange)) {
      return [trimLeft(newRange, intercept)];
    }
    if (isThisRangeOverlapInRightHandSideOtherRange(intercept, newRange)) {
      return [trimRight(intercept, newRange)];
    }
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
function isThisRangeHaveSomeOverlap(thisRange, otherRange) {
  return (
    isThisRangeSmallOrEqualOtherRange(thisRange, otherRange) ||
    isThisRangeBiggerThanOtherRange(thisRange, otherRange) ||
    isThisRangeOverlapInLeftHandSideOtherRange(thisRange, otherRange) ||
    isThisRangeOverlapInRightHandSideOtherRange(thisRange, otherRange)
  );
}
function mergeRange(oldRange, newRange) {
  if (newRange.to < oldRange.from) {
    return {
      from: Math.min(oldRange.from, newRange.from),
      exceptions: [
        ...oldRange.exceptions,
        ...newRange.exceptions,
        { from: newRange.to + 1, to: oldRange.from - 1 },
      ],
      to: Math.max(oldRange.to, newRange.to),
    };
  }
  if (newRange.from > oldRange.to) {
    return {
      from: Math.min(oldRange.from, newRange.from),
      exceptions: [
        ...oldRange.exceptions,
        ...newRange.exceptions,
        { from: oldRange.to + 1, to: newRange.from - 1 },
      ],
      to: Math.max(oldRange.to, newRange.to),
    };
  }

  const rangeProblems = oldRange.exceptions.filter((exception) => {
    return isThisRangeHaveSomeOverlap(newRange, exception);
  });
  if (rangeProblems.length == 0) {
    return {
      from: Math.min(oldRange.from, newRange.from),
      exceptions: mergeList(oldRange.exceptions, newRange.exceptions),
      to: Math.max(oldRange.to, newRange.to),
    };
  }
  const exceptionWithOutNewRange = oldRange.exceptions.filter(
    (x) => !rangeProblems.some((s) => s.from == x.from && s.to == x.to)
  );
  const newExceptions = findNewExceptions(rangeProblems, newRange);
  return {
    from: Math.min(oldRange.from, newRange.from),
    exceptions: mergeList(exceptionWithOutNewRange, newExceptions),
    to: Math.max(oldRange.to, newRange.to),
  };
}
function mergeList(a, b) {
  return [...a, ...b];
}
function sortRange(range1, range2) {
  if (range1.from < range2.from) {
    return [range1, range2];
  }
  if (range1.from == range2.from) {
    if (range1.to < range2.to) {
      return [range1, range2];
    }
  }
  return [range2, range1];
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
function solve(text) {
  const ranges = text
    .split("\n")
    .map((x) => x.trim())
    .filter((x) => x != "");
  const mapRoTange = ranges.map((x) => {
    const [from, to] = getRange(x);
    return {
      from,
      to,
      exceptions: [],
    };
  });
  // function merging()
  const result = mapRoTange.reduce(
    (range1, range2) => mergeRange(range1, range2),
    mapRoTange[0]
  );
  return result;
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
function countAllFreshIngredient(range) {
  return countRange(range) - countException(range.exceptions);
}
const fs = require("fs");
const filePath = "../quiz/day_5/input.txt";
const fileContent = fs.readFileSync(filePath, "utf-8");
const [rangeText] = seperateListAndSpoiledItem(fileContent);
const result = solve(rangeText);
console.log(countAllFreshIngredient(result));
