// function myPowV2(x, n) {
//   const result = multiplyEachArray(
//     chuckedN(Math.abs(n), 1000000)
//       .map((y) => createCheckedArray(y)(x))
//       .map(multiplyEachArray)
//   );
//   return n > 0 ? result : 1 / result;
// }
// function myPowV1(x, n) {
//   const chucked = chuckedN(Math.abs(n), 1000000);
//   chucked.reduce((_x, y, index) => {
//     if (index == chucked.length - 1) {
//       return _x + multiplyEachArray(createCheckedArray(y)(x));
//     }
//     if (index == 0) {
//       return multiplyEachArray(y);
//     }
//     return _x + _x / index;
//   }, 0);
//   let result = 1;
//   for (let i = 1; i <= Math.abs(n); i++) {
//     result *= x;
//   }
//   return n > 0 ? result : 1 / result;
// }
// function chuckedN(n, chuck) {
//   if (n > chuck) {
//     return [chuck, ...chuckedN(n - chuck, chuck)];
//   }
//   return [n];
// }

// function createCheckedArray(x) {
//   return function (n) {
//     return Array.from({ length: x }, () => n);
//   };
// }

// function multiplyEachArray(arr) {
//   return arr.reduce((a, y) => {
//     return a * y;
//   }, 1);
// }

function break2Number(n) {
  const half = Math.floor(n / 2);
  return [half, n - half];
}

function break4Number(n, x) {
  const half = Math.floor(n / x);
  if (half == 0) {
    return break2Number(n);
  }
  let sum = 0;
  let s = [];
  while (sum < n) {
    let temp = sum + half;
    if (temp > n) {
      s.push(half - (temp - n));
    } else {
      s.push(half);
    }
    sum += half;
  }
  return s;
  //   return [half, n - half];
}
// break4Number(50, 4);
// return;
// console.log([8, 8, 8, 2].reduce((x, y) => x * y, 1));

let caches = {};
function p(x, n) {
  if (n == 0) return 1;
  if (n == 1) return x;
  if (caches[`${x} ${n}`]) return caches[`${x} ${n}`];
  const components = break4Number(n, 4);
  caches[`${x} ${components[0]}`] = p(x, components[0]);
  caches[`${x} ${components[components.length - 1]}`] = p(
    x,
    components[components.length - 1]
  );

  const accPrevious = components
    .slice(0, components.length - 2)
    .reduce((sum, y) => {
      return sum * caches[`${x} ${y}`];
    }, caches[`${x} ${components[0]}`]);
  caches[`${x} ${n}`] =
    (accPrevious > 0 ? accPrevious : x) *
    caches[`${x} ${components[components.length - 1]}`];
  return caches[`${x} ${n}`];
}

function myPow1(x, n) {
  caches = {};
  const result = p(Math.abs(x), Math.abs(n));
  if (n < 0 && x < 0) {
    if (n % 2 == 0) return result;
    else {
      return -1 / result;
    }
  }
  if (x < 0 && n % 2 != 0) return -result;
  if (x < 0 && n % 2 == 0) return result;
  return n > 0 ? result : 1 / result;
}
console.log(myPow1(-3, -5));
// console.log(myPow1(2, 10));/
// console.log(caches);

// let caches :any = {};
// function break2Number(n) {
//   const half = Math.floor(n / 2);
//   return [half, n - half];
// }
// function p(x, n) {
//   if (n == 0) return 1;
//   if (n == 1) return x;
//   if (caches[`${x} ${n}`]) return caches[`${x} ${n}`];
//   const [half, rest] = break2Number(n);
//   if (half != rest) {
//     caches[`${x} ${n}`] = p(x, half) * p(x, half) * x;
//     return caches[`${x} ${n}`];
//   }
//   caches[`${x} ${n}`] = p(x, half) * p(x, rest);
//   return caches[`${x} ${n}`];
// }
