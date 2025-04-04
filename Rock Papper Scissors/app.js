// Import brain.js if using a module system
// const brain = require('brain.js');

let userScore = 0;
let compScore = 0;
let totalGames = 0;

const choices = document.querySelectorAll(".choice");
const msg = document.querySelector("#msg");
const userScorePara = document.querySelector("#user-score");
const comScorePara = document.querySelector("#comp-score");
const resetBtn = document.querySelector(".reset-btn");
const gamesCount = document.querySelector("#count");

// Initialize LSTM model
const net = new brain.recurrent.LSTMTimeStep({
  inputSize: 1,
  hiddenLayers: [10], // You can adjust this for better performance
  outputSize: 1,
});

// Training data
const pattern = [];
const patternLength = 10;

// Encode choices for LSTM model
const encodeChoice = (choice) => {
  switch (choice) {
    case "rock":
      return 0; // Rock encoded as 0
    case "paper":
      return 1; // Paper encoded as 1
    case "scissors":
      return 2; // Scissors encoded as 2
    default:
      return 0;
  }
};

// Decode prediction to choice
const decodeChoice = (encoded) => {
  if (encoded < 0.5) return "rock";
  if (encoded < 1.5) return "paper";
  return "scissors";
};

// Generate AI's choice using LSTM
const genCompChoiceAI = () => {
  if (pattern.length < patternLength) {
    // If not enough data, choose randomly
    const options = ["rock", "paper", "scissors"];
    const randomInd = Math.floor(Math.random() * 3);
    return options[randomInd];
  } else {
    // Train the model with user move patterns
    net.train([pattern]);

    // Predict the user's next move
    const prediction = net.run(pattern);
    const predictedMove = decodeChoice(prediction);

    // Counter the predicted move
    switch (predictedMove) {
      case "rock":
        return "paper"; // Paper beats Rock
      case "paper":
        return "scissors"; // Scissors beat Paper
      case "scissors":
        return "rock"; // Rock beats Scissors
      default:
        return "rock";
    }
  }
};

// Handle user choices
choices.forEach((choice) => {
  choice.addEventListener("click", () => {
    const userChoice = choice.getAttribute("id");
    playGame(userChoice);
  });
});

// Play the game
const playGame = (userChoice) => {
  console.log("User choice:", userChoice);

  // Add the user's move to the pattern
  if (pattern.length >= patternLength) {
    pattern.shift(); // Remove oldest move to maintain fixed length
  }
  pattern.push([encodeChoice(userChoice)]); // Push encoded user choice

  // Generate AI's choice
  const compChoice = genCompChoiceAI();
  console.log("AI choice:", compChoice);

  // Determine the game result
  if (userChoice === compChoice) {
    totalGames++;
    gamesCount.innerText = totalGames;
    drawGame();
  } else {
    const userWin = checkWinner(userChoice, compChoice);
    showWinner(userWin);
  }
};

// Check winner
const checkWinner = (userChoice, compChoice) => {
  if (
    (userChoice === "rock" && compChoice === "scissors") ||
    (userChoice === "paper" && compChoice === "rock") ||
    (userChoice === "scissors" && compChoice === "paper")
  ) {
    totalGames++;
    gamesCount.innerText = totalGames;
    return true; // User wins
}
    totalGames++;
    gamesCount.innerText = totalGames;
  return false; // AI wins
};

// Display winner
const showWinner = (userWin) => {
  if (userWin) {
    userScore++;
    userScorePara.innerText = userScore;
    updateMessage("You win!", "green");
  } else {
    compScore++;
    comScorePara.innerText = compScore;
    updateMessage("You lose!", "red");
  }
};

// Draw game
const drawGame = () => {
  updateMessage("Game Draw! Play Again", "#081b31");
};

// Update message with a visual effect
const updateMessage = (text, color) => {
  setTimeout(() => {
    msg.innerText = text;
    msg.style.background = `linear-gradient(45deg, ${color}, #000)`;
    msg.style.color = "#fff";
  }, 200); // Slight delay for effect
};

// Reset game
const resetGame = () => {
  userScore = 0;
  compScore = 0;
  pattern.length = 0; // Clear AI's memory
  userScorePara.innerText = userScore;
  comScorePara.innerText = compScore;
  gamesCount.innerText = 0
  msg.innerText = "Play your move";
  msg.style.background = "transparent"; // Reset background
  msg.style.color = "#000";
};

// Event listener for reset button
resetBtn.addEventListener("click", resetGame);
