function makeConnections(logs) {
  return logs.reduce((e, s) => {
    return [...e, s.splits.map((x) => `${s.findIndex}->${x}`)];
  }, []);
}
function getFirst(text) {
  return text.split("->")[0];
}
function getLast(text) {
  const s = text.split("->");
  return s[s.length - 1];
}
function mergeConnection(connections, logs) {
  return connections.reduce((s, i) => {
    const posibles = i.reduce((k, r) => {
      const last = getLast(r);
      const allChilds = logs.find((x) => x.findIndex == last);
      if (!allChilds) {
        const connectItSelf = `${last}->${last}`;
        return [...k, `${r}:${connectItSelf}`];
      }
      const maped = allChilds.splits.map(
        (f) => `${r}:${allChilds.findIndex}->${f}`
      );
      return [...k, ...maped];
    }, []);
    return [...s, ...posibles];
  }, []);
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
function f(str, logs) {
  if (logs.length == 0) return str;
  const [head, ...r] = logs;
  const s = mergeConnection(str, head);
  return f([s], r);
}
function merging(logs, states = "") {
  if (logs.length == 0) return states;
  const [head, ...rest] = logs;
  const cts = makeConnections(head);
  return f(cts, rest);
}

const allPos = merging(logs)[0];
const filter = allPos.reduce((x, t) => {
  if (x.includes(t)) {
    return x;
  }
  return [...x, t];
}, []);
console.log(merging(logs)[0].length);
console.log(filter.length);
// console.log(logs);
// console.log(m(makeConnections(logs[2]), logs[3]));
// ควรเเก้ให้ลงไปทีละเส้นก่อน ให้ไปถึงอันสุดท้าย เเล้วทยอย ส่งค่ากลับไป
