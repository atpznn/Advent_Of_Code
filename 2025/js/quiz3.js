// function findIndexMax(str) {
//   const maxFirstBat = Math.max(
//     ...str
//       .slice(0, str.length - 1)
//       .split("")
//       .map((x) => parseInt(x))
//   );
//   const findIndexMaxBat = str.split("").findIndex((x) => x == maxFirstBat);
//   const remainBat = str.slice(findIndexMaxBat + 1, str.length);
//   const nextCell = Math.max(...remainBat.split("").map((x) => parseInt(x)));
//   const nextCellIndex = str.split("").findIndex((x) => x == nextCell);

//   return {
//     maxFirstBat,
//     findIndexMaxBat,
//     nextCellIndex,
//     value: str[findIndexMaxBat] + str[nextCellIndex],
//   };
// }
const text = `
987654321111111
811111111111119
234234234234278
818181911112111`;

const fs = require("fs");
const filePath = "../quiz/day_3/input.txt";
const fileContent = fs.readFileSync(filePath, "utf-8");
// console.log(
//   fileContent
//     .trim()
//     .split("\n")
//     .map((x) => x.trim())
//     .map(findIndexMax)
//     .reduce((x, y) => {
//       return x + parseInt(y.value);
//     }, 0)
// );

function v2() {
  return text
    .trim()
    .split("\n")
    .map((x) => x.trim())
    .reduce((r, y) => {
      const s = y.split("").map((x) => x.trim());
      const result = s.reduce(
        ({ pre, cell, pick, forcePick }, y, index) => {
          if (forcePick) {
            return {
              pre,
              pick: y,
              cell: cell + y,
              forcePick: true,
            };
          }
          if (pick > y) {
            return {
              pick: y,
              cell: cell + `${pick}`,
              forcePick: s.length - index <= 12 - cell.length,
            };
          }
          return {
            pick: parseInt(y),
            cell: cell,
            forcePick: s.length - index <= 12 - cell.length,
          };
        },
        { pre: parseInt(s[0]), pick: -1, cell: "", forcePick: false }
      );
      return [...r, result];
    }, [])
    .reduce((x, y) => {
      console.log(y);
      return x + parseInt(y.cell);
    }, 0);
}
// const s = "".split("");
// console.log(v2());

// recursive เบือกไหม ไม่เลือก ขยับ เเล้วล่นไปเรื่อยๆ
function findMoreThanRestInWord(current, text, index = 0) {
  if (text.length == 0) return null;
  const [head, ...rest] = text.split("");
  if (parseInt(current) < parseInt(head)) return index;
  return findMoreThanRestInWord(current, rest.join(""), index + 1);
}
function isNextHasSameValue(current, text, index = 0) {
  if (text.length == 0) return null;
  const [head, ...rest] = text.split("");
  if (parseInt(current) == parseInt(head)) return index;
  return findMoreThanRestInWord(current, rest.join(""), index + 1);
}
function findMax(text) {
  return Math.max(...text.map((x) => parseInt(x))) || 0;
}
function group(text) {
  if (text.length == 0) return [];
  const [head, ...rest] = text.split("");
  if (head == rest[0]) return group(rest.join(""));
  return [head, ...group(rest.join(""))];
}
function wantToPick(len) {
  return function selectiveMostWord(word, collected = []) {
    if (collected.length == len) return collected;
    if (word.length <= 0) return collected;

    const [head, ...rest] = word.split("");
    const moreThanCurrentNextIndex = findMoreThanRestInWord(
      head,
      rest.join("")
    );
    // หากไม่มีใครด้านหลังมากกว่าำนวนปัจจุบันก็ ให้ใส่ของที่ถืออยู่เลยลงไป
    if (moreThanCurrentNextIndex == null) {
      return selectiveMostWord(rest.join(""), [...collected, head]);
    }
    // หากสามารถข้ามไปหาค่าที่มากกว่าปัจจุบันได้เเล้วยังมีจำนวนคงเหลือพอสำหรับใส่ให้ครบตามต้องการ ให้ข้ามไป
    const requireItem = len - collected.length;
    const remainItemIfJumpToNextMoreThanCurrent =
      word.length - moreThanCurrentNextIndex;
    if (remainItemIfJumpToNextMoreThanCurrent > requireItem) {
      return selectiveMostWord(rest.slice(moreThanCurrentNextIndex).join(""), [
        ...collected,
      ]);
    }
    //มีจำนวนมากกว่าด้านหลังจริงเเต่ว่า หากข้ามไป จะมีไอเทมไม่พอสำหรับข้ามไปหยิบ ใส่ของที่เลือกมา ณ ปัจจุบันเลย
    return selectiveMostWord(rest.join(""), [...collected, head]);
  };
}

console.log(
  text
    .trim()
    .split("\n")
    .map((x) => x.trim())
    .map((x) => [x, wantToPick(2)(x).join("")])
    .reduce((x, y) => {
      console.log(y);
      return x + parseInt(y[1]);
    }, 0)
);
