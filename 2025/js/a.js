const fs = require("fs");
const filePath = "../quiz/day_5/input.txt";
const fileContent = fs.readFileSync(filePath, "utf-8");
const test = `3-5
10-14
16-20
12-18
70-80
1-1
74-75
74-75
74-75
74-75
55-55
90-100
85-91
100-120
95-100
92-110

1
2
3
4
`;
const input = test
  .replace(/\r/g, "")
  .split("\n\n")
  .filter((x) => x.length > 0)
  .map((x) => x.split("\n"));
console.log(input);
const ranges = input[0].map((x) => x.split("-").map((x) => parseInt(x)));
const del = [];
for (let i = 0; i < ranges.length; i++) {
  const range = ranges[i];
  for (let j = 0; j < i; j++) {
    const minimum = ranges[j];
    if (minimum.length == 0) continue;
    const value = minimum[1] + 1;
    if (range[0] >= minimum[0] && range[0] <= minimum[1] && range[1] >= value)
      range[0] = value;
  }
  for (let j = 0; j < i; j++) {
    const maximum = ranges[j];
    if (maximum.length == 0) continue;
    const value = maximum[0] - 1;
    if (range[1] >= maximum[0] && range[1] <= maximum[1] && range[0] <= value)
      range[1] = value;
  }
  for (let j = 0; j < ranges.length; j++) {
    if (j == i) continue;
    const child = ranges[j];
    if (child.length == 0) continue;
    if (range[0] <= child[0] && range[1] >= child[1])
      del.push(child.splice(0, child.length));
    else if (range[0] >= child[0] && range[1] <= child[1]) {
      del.push(range.splice(0, range.length));
      break;
    }
  }
}

let fresh = 0;
for (const range of ranges) {
  if (range.length == 0) continue;
  fresh += range[1] - range[0] + 1;
}
console.log(ranges);
console.log(del);
console.log(fresh);
