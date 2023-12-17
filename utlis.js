// Function to generate random real numbers within a specified range
function getRandomNumber(min, max, isInteger = false) {
  const randomNumber = Math.random() * (max - min) + min;
  return isInteger ? Math.floor(randomNumber) : randomNumber;
}

// Generate a sample dataset
function generateSampleData(size) {
  const xs = [];
  const ys = [];

  for (let i = 0; i < size; i++) {
    const a = getRandomNumber(1, 10, true); // Replace 1 and 10 with your desired range for 'a'
    const b = getRandomNumber(1, 10, true); // Replace 1 and 10 with your desired range for 'b'
    const c = getRandomNumber(1, 10, true); // Replace 1 and 10 with your desired range for 'c'

    // Calculate y = a + b + c
    const y = a + b + c;

    xs.push([a, b, c]);
    ys.push([y]);
  }

  return [xs, ys];
}
