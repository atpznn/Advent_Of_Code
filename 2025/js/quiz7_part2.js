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
  }, line);
  return addNewLaser + line.slice(addNewLaser.length);
}
function solve(text) {
  const lines = splitToLines(text);
  const [head, body] = splitLinesToHeadAndBody(lines);
  const startLaserIndex = findStartIndex(head);
  //   const body0 = parseLineToLaser([startLaserIndex], body[0]);

  const t = body.reduce(
    ({ newLines, logs, splitIndexes, countSplit }, line, index) => {
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
        if (splitForm.includes(4)) {
          console.log("asdasd");
        }
        if (logs.length != 0) {
          const notFoundSpliter = logs[logs.length - 1].reduce((state, cur) => {
            const t = splitForm.filter((x) => cur.splits.some((s) => s == x));
            if (t.length == 1) {
              return [
                ...state,
                {
                  findIndex: cur.splits.filter((k) => k != t[0])[0],
                  splits: cur.splits.filter((k) => k != t[0]),
                },
              ];
            }
            return state;
            // const notSplit = splitForm.reduce((a, i) => {
            //   if (cur.splits.every((s) => s == i)) {
            //     return [...a, { findIndex: cur.findIndex, splits: [i] }];
            //   }
            //   return a;
            // }, []);
            // return [...state, ...notSplit];
          }, []);
          console.log("s"), notFoundSpliter;
          return {
            newLines: `${newLines}\n${body}`,
            splitIndexes: newIndexed,
            countSplit: countSplit + hasHeadHitLaser.length,
            logs: [...logs, [...notFoundSpliter, ...foundSplit]],
          };
        }
        return {
          newLines: `${newLines}\n${body}`,
          splitIndexes: newIndexed,
          countSplit: countSplit + hasHeadHitLaser.length,
          logs: [...logs, foundSplit],
        };
      }
      const body = seperateLaser(splitIndexes, line);
      return {
        newLines: `${newLines}\n${body}`,
        splitIndexes: splitIndexes,
        countSplit,
        logs,
      };
    },
    {
      newLines: "",
      splitIndexes: [startLaserIndex],
      countSplit: 0,
      foundTimeline: [],
      logs: [],
      foundTimeV1: 1,
    }
  );
  console.log(t.newLines);
  console.log(t.countSplit);
  t.logs.map((x) => console.log(x));
  return t;
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
// const [head, body] = splitLinesToHeadAndBody(splitToLines(testText));
// const focus = body.filter((x, i) => i % 2 != 0);
// console.log(solve(testText));
// function d(f) {
//   const [head, ...body] = splitLinesToHeadAndBody(f);
//   const s = findSplitIndexInLine(head);
//   return d(body) + d(body);
//   return;
// }
// const walkLogs = focus.map((x) => findSplitIndexInLine(x));
// console.log(focus);
// console.log(walkLogs);
// console.log(s(walkLogs));
// function s(walkLogs) {
//   const [head, ...body] = splitLinesToHeadAndBody(walkLogs);
//   const lineleft = head[0].splits[0];
//   return lineleft + s(...body);
//   // return;
// }
// Those 40 minutes passed by pretty quickly.
// This was very annoying to come up with, but a Reddit meme pointed me in the right direction.
// Thank you, u/waskerdu!
// https://www.reddit.com/r/adventofcode/comments/1pgcauz/2025_day_7_part_2_yes_im_reposting_this/
// https://adventofcode.com/2025/day/7#part2
// hiimjasmine00 December 7, 2025 3:17am (03:17-05:00) EST

const input = fileContent
  .replace(/\r/g, "")
  .split("\n")
  .filter((x) => x.length > 0)
  .map((x) => x.split(""));
const outputs = {};

function beginBeam(x, startY) {
  const key = `${x},${startY}`;
  if (outputs[key]) return outputs[key];
  let output = 0;
  for (let y = startY; y < input.length; y++) {
    if (input[y][x] == "^") {
      output += beginBeam(x - 1, y);
      output += beginBeam(x + 1, y);
      break;
    }
  }
  outputs[key] = output == 0 ? 1 : output;
  return outputs[key];
}
let split = 0;
startLoop: for (let y = 0; y < input.length; y++) {
  const row = input[y];
  for (let x = 0; x < row.length; x++) {
    if (row[x] == "S") {
      split = beginBeam(x, y);
      break startLoop;
    }
  }
}

// console.log(split);
// console.log(count(focus));
function count(lines, index = 0) {
  if (lines.length == 0) return 1;
  const [head, rest] = splitLinesToHeadAndBody(lines);
  const foundSpliterIndex = findSplitIndexInLine(head);
  return foundSpliterIndex.reduce((sum, spliter) => {
    const left = count(rest, spliter.splits[0]);
    const right = count(rest, spliter.splits[1]);
    return left + right;
  }, 0);
}

const logs = [
  [{ findIndex: 7, splits: [6, 8] }],
  [
    { findIndex: 6, splits: [5, 7] },
    { findIndex: 8, splits: [7, 9] },
  ],
  [
    { findIndex: 5, splits: [4, 6] },
    { findIndex: 7, splits: [6, 8] },
    { findIndex: 9, splits: [8, 10] },
  ],
  [
    { findIndex: 4, splits: [3, 5] },
    { findIndex: 6, splits: [5, 7] },
    { findIndex: 10, splits: [9, 11] },
  ],
  [
    { findIndex: 3, splits: [2, 4] },
    { findIndex: 5, splits: [4, 6] },
    { findIndex: 9, splits: [8, 10] },
    { findIndex: 11, splits: [10, 12] },
  ],
  [
    { findIndex: 2, splits: [1, 3] },
    { findIndex: 6, splits: [5, 7] },
    { findIndex: 12, splits: [11, 13] },
  ],
  [
    { findIndex: 1, splits: [0, 2] },
    { findIndex: 3, splits: [2, 4] },
    { findIndex: 5, splits: [4, 6] },
    { findIndex: 7, splits: [6, 8] },
    { findIndex: 9, splits: [8, 10] },
    { findIndex: 13, splits: [12, 14] },
  ],
];
const t = solve(testText);

const allPosible = t.logs.reduce((state, logs) => {
  const p = logs.reduce((state, log) => {
    return [...state, ...log.splits.map((x) => log.findIndex + "->" + x)];
  }, []);
  const ps = toUnique(
    logs.reduce((state, log) => {
      return [...state, log.findIndex];
    }, [])
  );
  const parent = state.filter((x) => {
    const gs = x.split("->");
    const g = gs[gs.length - 1];
    return ps.some((s) => s == g);
  });

  // const currentState = log.splits.map((x) => log.findIndex + "->" + x);

  const j = p.reduce((state, log) => {
    const parents = parent.filter((x) => {
      const gs = x.split("->");
      const g = gs[gs.length - 1];
      const first = log.split("->")[0];
      return g == first;
    });
    if (parents.length == 0) {
      return [...state, log];
    }
    return [...state, ...parents.map((x) => x + ":" + log)];
  }, []);
  // log.findIndex;
  return [...j];
}, []);
console.log(allPosible.length);
console.log(
  allPosible.reduce((state, log) => {
    if (state.some((s) => s == log)) {
      return state;
    }
    return [...state, log];
  }, [])
);
console.table(allPosible);
console.table(
  allPosible.reduce((state, log) => {
    if (state.some((s) => s == log)) {
      return state;
    }
    return [...state, log];
  }, [])
);
