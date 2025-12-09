const testText = `162,817,812
57,618,57
906,360,560
592,479,940
352,342,300
466,668,158
542,29,236
431,825,988
739,650,466
52,470,668
216,146,977
819,987,18
117,168,530
805,96,715
346,949,466
970,615,88
941,993,340
862,61,35
984,92,344
425,690,689`;
function splitText(text) {
  return text
    .split("\n")
    .filter((x) => x != "")
    .map((x) => x.replaceAll("\r", ""));
}
function getXyz(text) {
  const [x, y, z] = text.split(",").map((x) => parseInt(x));
  return [x, y, z];
}
function headBody(lines) {
  const [head, ...rest] = lines;
  return [head, rest];
}
function euclidean3d(xyz1, xyz2) {
  const [x1, y1, z1] = xyz1;
  const [x2, y2, z2] = xyz2;
  return Math.sqrt(
    Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2) + Math.pow(z1 - z2, 2)
  );
}
function boxClosePosition(text1, lines) {
  const currentXyz = getXyz(text1);
  return lines.reduce(
    ({ xyz, distance }, item) => {
      const newDistance = euclidean3d(currentXyz, getXyz(item));
      if (distance == null) return { xyz: item, distance: newDistance };
      if (newDistance <= distance) return { xyz: item, distance: newDistance };
      return { xyz, distance };
    },
    { xyz: "", distance: null }
  );
}
function getPairs(lines) {
  return lines.reduce((list, line) => {
    const comparer = lines.filter((x) => x != line);
    const currentPair = boxClosePosition(line, comparer);
    return [
      ...list,
      { distance: currentPair.distance, xyz: [currentPair.xyz, line] },
    ];
  }, []);
}

function sortingByDistance(pairs) {
  return pairs.sort((x, y) => x.distance - y.distance);
}
function deduplicatePaired(paireds) {
  return paireds.reduce((list, paired) => {
    if (list.some((s) => s.distance == paired.distance)) {
      return list;
    }
    return [...list, paired];
  }, []);
}

function isPairEqual(pair1, pair2) {
  const [xyz1_pair1, xyz2_pair1] = pair1;
  const [xyz1_pair2, xyz2_pair2] = pair2;
  return (
    (xyz1_pair1 == xyz1_pair2 && xyz2_pair1 == xyz2_pair2) ||
    (xyz1_pair1 == xyz2_pair2 && xyz2_pair1 == xyz1_pair2)
  );
}

function isPairContain(pair1, pair2) {
  if (pair1.length == 0 || pair2.length == 0) return false;
  const [xyz1_pair1, xyz2_pair1] = headBody(pair1);
  if (pair2.includes(xyz1_pair1)) return true;
  return isPairContain(xyz2_pair1, pair2);
}

function mergeBox(pair1, pair2) {
  if (pair1.length == 0 || pair2.length == 0) return [];
  const [head1, body1] = headBody(pair1);
  if (isPairContain([head1], pair2)) {
    return [...body1, ...pair2];
  }
  return [head1, ...mergeBox(body1, pair2)];
}
function grouping(paireds) {
  return paireds.reduce((list, pair) => {
    if (list.length == 0) return [pair];
    const s = list.find((x) => isPairContain(x, pair));
    if (!s) {
      return [...list, pair];
    }
    return [...list.filter((x) => x != s), mergeBox(s, pair)];
  }, []);
}
const fs = require("fs");
const filePath = "../quiz/day_8/input.txt";
const fileContent = fs.readFileSync(filePath, "utf-8");
const waired = splitText(testText);
const paired = getPairs(waired);
const pairFilted = deduplicatePaired(sortingByDistance(paired));
// console.log(grouping(pairFilted));
// console.log(sortingByDistance(paired));

// console.log(pairFilted);
console.log(p(pairFilted));
function removeThisWire(xyz, pair) {
  return { distance: 0, xyz: pair.xyz.filter((x) => x != xyz) };
}
function p(paired) {
  if (paired.length == 0) return [];
  const [head, body] = headBody(paired);
  const g = head.xyz.reduce((state, xyz) => {
    const otherPairs = body.filter(
      (x) =>
        isPairContain([xyz], x.xyz) &&
        (x.distance >= head.distance || x.distance == 0)
    );
    const fws = otherPairs
      .map((x) => removeThisWire(xyz, x))
      .filter((x) => x.xyz != xyz);
    const removed = body.filter((x) => {
      return !(
        fws.some((s) => isPairContain(s.xyz, x.xyz))
        // gs.some((s) => isPairContain(s.xyz, x.xyz))
      );
    });
    const m = fws.reduce((state, pair) => {
      return mergeBox(state, [xyz, ...pair.xyz]);
    }, head.xyz);

    return [...state, { ...head, xyz: m }, ...p([...removed, ...fws])];
    // });
    // const otherPairs = body.filter(
    //   (x) =>
    //     isPairContain([xyz1], x.xyz) &&
    //     (x.distance >= head.distance || x.distance == 0)
    // );
    // const otherPairs2 = body.filter(
    //   (x) =>
    //     isPairContain([xyz2], x.xyz) &&
    //     (x.distance >= head.distance || x.distance == 0)
    // );
    // const fws = otherPairs2
    //   .map((x) => removeThisWire(xyz2, x))
    //   .filter((x) => x.xyz != xyz2);
    // const gs = otherPairs
    //   .map((x) => removeThisWire(xyz1, x))
    //   .filter((x) => x.xyz != xyz1);
    // 4; // v wrong
    // const removed = body.filter((x) => {
    //   return !(
    //     fws.some((s) => isPairContain(s.xyz, x.xyz)) ||
    //     gs.some((s) => isPairContain(s.xyz, x.xyz))
    //   );
    // });

    // const m = fws.reduce((state, pair) => {
    //   return mergeBox(state, [xyz2, ...pair.xyz]);
    // }, head.xyz);
    // const gff = gs.reduce((state, pair) => {
    //   return mergeBox(state, [xyz1, ...pair.xyz]);
    // }, m);
    // return [{ ...head, xyz: gff }, ...p([...removed, ...fws, ...gs])];
  });
  return g;
}
