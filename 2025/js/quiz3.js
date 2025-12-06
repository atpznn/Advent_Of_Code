// recursive เบือกไหม ไม่เลือก ขยับ เเล้วล่นไปเรื่อยๆ
function findMoreThanRestInWord(current, text, index = 0) {
  if (text.length == 0) return null;
  const [head, ...rest] = text.split("");
  if (parseInt(current) < parseInt(head)) return index;
  return findMoreThanRestInWord(current, rest.join(""), index + 1);
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

const text = `
987654321111111
811111111111119
234234234234278
818181911112111`;

const fs = require("fs");
const filePath = "../quiz/day_3/input.txt";
const fileContent = fs.readFileSync(filePath, "utf-8");

console.log(
  fileContent
    .trim()
    .split("\n")
    .map((x) => x.trim())
    .map((x) => wantToPick(12)(x).join(""))
    .reduce((x, y) => {
      return x + parseInt(y);
    }, 0)
);
