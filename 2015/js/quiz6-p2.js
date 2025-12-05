function createADimension(x, y, value = 0) {
  return Array.from({ length: y }, () =>
    Array.from({ length: x }, () => value)
  );
}

function toggle(state, target) {
  return state.map((d, x) => {
    return d.map((f, y) => {
      if (x == target[1] && y == target[0]) return !f;
      return f;
    });
  });
}

function thought(from, to, fn) {
  return Array.from({ length: to[1] - from[1] + 1 }, () =>
    Array.from({ length: to[0] - from[0] + 1 }, () => 0)
  ).map((x, indexY) => {
    return x.map((state, indexX) => {
      return {
        x: from[0] + indexX,
        y: from[1] + indexY,
        fn,
      };
    });
  });
}
function turnOff() {
  return false;
}

function turnOn() {
  return true;
}

function isToggle(text) {
  return text.includes("toggle");
}
function isTurnOn(text) {
  return text.includes("turn on");
}
function isTurnOff(text) {
  return text.includes("turn off");
}
function splitWithChar(str, char) {
  return str.split(char);
}
function removeToggle(str) {
  return splitWithChar(str, "toggle")[1];
}
function removeTurnOn(str) {
  return splitWithChar(str, "turn on")[1];
}
function removeTurnOff(str) {
  return splitWithChar(str, "turn off")[1];
}
function parseTextToPosition(str) {
  return str.split(",").map((x) => parseInt(x));
}
function doActionAtTarget(state, target, fn) {
  const newState = state.map((d, x) => {
    return d.map((f, y) => {
      if (x == target[1] && y == target[0]) {
        return fn(f);
      }
      return f;
    });
  });
  return newState;
}
function splitIner(list, x1, x2) {
  return list.map((l) => {
    const head = l.slice(0, x1);
    const body = l.slice(x1, x2 + 1);
    const tail = l.slice(x2 + 1);
    return [head, body, tail];
  });
}
function doAction(value, fn) {
  const newState = target.map((d) => {
    return d.map((f) => {
      return fn(f);
    });
  });
  return newState;
}
function splitTo3Part(list, first, last) {
  const head = list.slice(0, first.y);
  //   const [_h, computed, _l] = splitIner(body, first.x, last.x);
  const body = list.slice(first.y, last.y + 1);
  const tail = list.slice(last.y + 1);
  return [head, splitIner(body, first.x, last.x), tail];
}
// console.log(
//   action(
//     createADimension(5, 5),
//     thought([1, 1], [2, 2], (e) => true)
//   )
// );
// return;
function action(state, actionList) {
  const first = actionList[0][0];
  const last =
    actionList[actionList.length - 1][
      actionList[actionList.length - 1].length - 1
    ];
  const [head, body, tail] = splitTo3Part(state, first, last);
  const d = body.map((d, y) => {
    const [_h, _b, _l] = d;
    const result = [
      ..._h,
      ..._b.map((h, x) => {
        const re = actionList[y][x].fn(h);
        return re;
      }),
      ..._l,
    ];
    return result;
  });
  const f = [...head, ...d, ...tail];
  return f;
  const computed = targets.map((arr, y) =>
    arr.map((data, x) => actionList[y][x].fn(data))
  );
  const result = [...head, [..._h, ...computed, ..._t], ...tail];
  return result;
  return actionList.reduce((stateOne, x) => {
    return x.reduce((_state, y) => {
      return doActionAtTarget(_state, [y.x, y.y], y.fn);
    }, stateOne);
  }, state);
}
function actionWithTextCommand(state, str) {
  if (isToggle(str)) {
    const toggleStatement = removeToggle(str);
    const [from, to] = getThoughtRange(toggleStatement);
    const wantToActions = thought.bind(
      null,
      parseTextToPosition(from),
      parseTextToPosition(to)
    );
    const actionToggle = (e) => {
      return e + 2;
    };
    return action(state, wantToActions(actionToggle));
  }
  if (isTurnOff(str)) {
    const toggleStatement = removeTurnOff(str);
    const [from, to] = getThoughtRange(toggleStatement);
    const wantToActions = thought.bind(
      null,
      parseTextToPosition(from),
      parseTextToPosition(to)
    );
    const actionToggle = (e) => (e < 1 ? 0 : e - 1);
    return action(state, wantToActions(actionToggle));
  }
  if (isTurnOn(str)) {
    const toggleStatement = removeTurnOn(str);
    const [from, to] = getThoughtRange(toggleStatement);
    const wantToActions = thought.bind(
      null,
      parseTextToPosition(from),
      parseTextToPosition(to)
    );
    const actionToggle = (e) => e + 1;
    return action(state, wantToActions(actionToggle));
  }
  return state;
}
function getThoughtRange(str) {
  const [from, to] = splitWithChar(str, "through");
  return [from, to];
}
// console.log(getThoughtRange(removeToggle(text)));
const state = createADimension(1000, 1000);
const fs = require("fs");
const filePath = "../quiz/day_6/input.txt";
const fileContent = fs.readFileSync(filePath, "utf-8");
// const text = "toggle 461,550 through 564,900";
const result = fileContent.split("\n").reduce(
  ({ state, light }, command) => {
    // console.log(command);
    const newState = actionWithTextCommand(state, command);
    return {
      state: newState,
      light:
        light +
        newState.reduce((sumx, x) => {
          return x.reduce((sumy, y) => {
            if (y) return 1 + sumy;
            return sumy;
          }, sumx);
        }, 0),
    };
  },
  { state, light: 0 }
);
console.log(
  "total light power after do commands",
  result.state.reduce((sumx, x) => {
    return x.reduce((sumy, y) => {
      // console.log(y);
      return y + sumy;
    }, sumx);
  }, 0)
);
// console.log(
//   actionWithTextCommand(
//     actionWithTextCommand(
//       actionWithTextCommand(state, "turn on 0,0 through 999,999"),
//       "toggle 0,0 through 999,0"
//     ),
//     "turn off 499,499 through 500,500"
//   ).reduce((sumx, x) => {
//     return x.reduce((sumy, y) => {
//       if (y) return 1 + sumy;
//       return sumy;
//     }, sumx);
//   }, 0)
// );
// console.table(thought([1, 2], [2, 5], 0));
