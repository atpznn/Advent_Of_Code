function findStartIndex(text) {
  if (text.length == 0) return 0;
  const [head, ...rest] = text;
  if (head == "S") return 0;
  return 1 + findStartIndex(rest.join(""));
}
function splitToLines(text) {
  return text.split("\n").filter((x) => x.trim() != "");
}
function splitLinesToHeadAndBody(lines) {
  const [head, ...body] = lines;
  return [head, body];
}
function parseLineToLaser(indexes, line) {
  const addNewLaser = indexes.reduce((newline, index) => {
    return newline + line.slice(newline.length, index) + "|";
  }, "");
  return addNewLaser + line.slice(addNewLaser.length);
}
function toUnique(indexes) {
  return [...new Set(indexes)];
}
function findSplitIndexInLine(line, index = 0) {
  if (line.length == 0) return [];
  const [head, ...rest] = line;
  if (head == "^")
    return [
      { findIndex: index, splits: [index - 1, index + 1] },
      ...findSplitIndexInLine(rest.join(""), index + 1),
    ];
  return findSplitIndexInLine(rest.join(""), index + 1);
}
function seperateLaser(laserIndexes, line) {
  const addNewLaser = laserIndexes.reduce((newline, index) => {
    return newline.slice(0, index) + "|" + newline.slice(index + 1);
    const left = line.slice(newline.length, index);
    const center = line.slice(index + 1, index + 2);
    const newL = newline + left + "|" + center;
    return newL;
  }, line);
  return addNewLaser + line.slice(addNewLaser.length);
}
function solve(text) {
  const lines = splitToLines(text);
  const [head, body] = splitLinesToHeadAndBody(lines);
  const startLaserIndex = findStartIndex(head);
  //   const body0 = parseLineToLaser([startLaserIndex], body[0]);

  const t = body.reduce(
    ({ newLines, splitIndexes, countSplit }, line, index) => {
      if (index % 2 != 0) {
        const foundSplit = findSplitIndexInLine(line);
        const laserIndex = toUnique(foundSplit.flatMap((x) => x.splits));
        const splitForm = toUnique(foundSplit.map((x) => x.findIndex));
        const remainNotSplited = splitIndexes.filter((x) => {
          return !splitForm.some((s) => s == x);
        });
        const hasHeadHitLaser = splitIndexes.filter((x) =>
          splitForm.some((s) => s == x)
        );
        const newIndexed = [
          ...laserIndex.filter((x) => !splitIndexes.some((f) => f == x)),
          ...remainNotSplited, //   ...splitIndexes.filter((x) => !indexes.some((s) => s == x)),
        ].sort((x, y) => x - y);
        const body = seperateLaser(newIndexed, line);
        return {
          newLines: `${newLines}\n${body}`,
          splitIndexes: newIndexed.sort((x, y) => x - y),
          countSplit: countSplit + hasHeadHitLaser.length,
        };
      }
      const body = seperateLaser(splitIndexes, line);
      return {
        newLines: `${newLines}\n${body}`,
        splitIndexes: splitIndexes,
        countSplit: countSplit,
      };
    },
    {
      newLines: "",
      splitIndexes: [startLaserIndex],
      countSplit: 0,
    }
  );
  console.log(t.newLines);
  console.log(t.countSplit);
  console.log(t.splitIndexes);
  //   const index1 = findSplitIndexInLine(body[1]);
  //   const body1 = seperateLaser(index1, body[1]);
  //   const body2 = seperateLaser(index1, body[2]);
  //   const index3 = findSplitIndexInLine(body[3]);
  //   const body3 = seperateLaser(index3, body[3]);
  //   const body4 = seperateLaser(index3, body[4]);
  //   const index5 = findSplitIndexInLine(body[5]);
  //   const body5 = findSplitIndexInLine(index5, body[5]);
  //   return [head, body0, body1, body2, body3, body4, body5].join("\n");
}
const testText = `
.......S.......
...............
.......^.......
...............
......^.^......
...............
.....^.^.^.....
...............
....^.^...^....
...............
...^.^...^.^...
...............
..^...^.....^..
...............
.^.^.^.^.^...^.
...............`;
const fs = require("fs");
const filePath = "../quiz/day_7/input.txt";
const fileContent = fs.readFileSync(filePath, "utf-8");
console.log(solve(testText));
