const { arrayBuffer } = require("stream/consumers");

function createADimension([...position], value = 0) {
  if (position.length == 0) return [];
  const [head, ...rest] = position;
  return Array.from({ length: head }, () => {
    if (rest.length == 0) {
      return value;
    }
    return createADimension(rest, value);
  });
}
// to do create a chucked array with array props checked
console.log(createADimension([2, 2], 10));
