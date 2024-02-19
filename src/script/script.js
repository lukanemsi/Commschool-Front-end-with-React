// first
function printArray(arr) {
  for (let i = 0; i < arr.length; i++) {
    console.log(arr[i]);
  }
}

printArray([1, 2, 3, 4, 5, 6, 7]);

// third
function highestNumber() {
  result = arguments[0];

  for (let i = 1; i < arguments.length; i++) {
    if (arguments[i] > result) {
      result = arguments[i];
    }
  }
  return result;
}

console.log(highestNumber(15, 53, 22, 198, 10, 28, 16, 70, 33, 951));

// second

function displayItemByPrice(price, data, splitterFunc) {
  splittedItems = splitterFunc(price, data);

  console.log("Lower Price: " + splittedItems[0]);
  console.log("Higher Price: " + splittedItems[1]);
}

function splitter(price, data) {
  higher = [];
  lower = [];

  for (let i = 0; i < data.length; i++) {
    if (data[i].price > price) {
      higher.push(data[i]);
    } else {
      lower.push(data[i]);
    }
  }
  return [higher, lower];
}

let itemData = [
  {
    name: "Smartphone",
    price: 700.99,
  },
  {
    name: "Laptop",
    price: 1000.99,
  },
  {
    name: "Headphones",
    price: 400.99,
  },
  {
    name: "Backpack",
    price: 350.99,
  },
];

displayItemByPrice(500, itemData, splitter);
