const textTexts = `[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1)
[...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) 
[.###.#] (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2)`;

function makeIndex(textCleaned) {
  if (textCleaned.length == 0) return [];
  const [head, ...rest] = textCleaned;
  const text = rest.join("");
  if (head == "#") return [1, ...makeIndex(text)];
  return [0, ...makeIndex(text)];
}
function indexTargetToGoal(target) {
  const textCleaned = target.replace("[", "").replace("]", "");
  return textCleaned;
}

function startStateFromIndex(indexes) {
  return indexes
    .split("")
    .map((x) => ".")
    .join("");
}
function toggle(state, command) {
  return command.reduce((state, index) => {
    const current = state.slice(index, index + 1);
    if (current == ".")
      return state.slice(0, index) + "#" + state.slice(index + 1);
    return state.slice(0, index) + "." + state.slice(index + 1);
  }, state);
}

function diffState(state, goal, index = 0) {
  if (state.length == 0 || goal.length == 0) return [];
  const [h, ...hs] = state;
  const [g, ...gs] = goal;
  if (h == g) return diffState(hs, gs, index + 1);
  return [index, ...diffState(hs, gs, index + 1)];
}
function solve(state, target, commands) {
  if (state == target) return [];
  const goal = makeIndex(target);
  const start = makeIndex(state);
  const diff = diffState(start, goal);

  const bestCommand =
    commands.find((x) => x[0] == diff[0] && x[1] == diff[1]) ??
    commands.find((x) => x.some((f) => f == 0)) ??
    command[0];
  const newState = toggle(state, bestCommand);
  return [bestCommand, ...solve(newState, target, commands)];
}
textTexts
  .split("\n")
  .filter((x) => x.trim() != "")
  .map((textText) => {
    const addSymbolToMarkSpliter = textText.replace(" ", "|");
    const splitToLines = addSymbolToMarkSpliter.split("|");
    const [target, buttons] = splitToLines;
    const commands = buttons
      .replaceAll("(", "")
      .replaceAll(")", "")
      .split(" ")
      .filter((x) => x.trim() != "")
      .map((x) => x.trim())
      .reduce((state, x) => {
        return [...state, x.split(",").map((x) => parseInt(x))];
      }, []);
    const goalState = indexTargetToGoal(target);
    const startState = startStateFromIndex(goalState);
    const success = solve(startState, goalState, commands);
    console.log(success);
    return success;
  });
