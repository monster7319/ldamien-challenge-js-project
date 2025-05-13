const screen = document.getElementById("screen");
const buttons = document.querySelectorAll(".btn");
const historyList = document.getElementById("historyList");

let currentInput = "";
let lastResult = "";

buttons.forEach(button => {
  button.addEventListener("click", () => {
    const number = button.dataset.number;
    const action = button.dataset.action;

    if (number !== undefined) {
      if (number === "." && currentInput.includes(".")) return;
      currentInput += number;
      updateScreen(currentInput);
    }

    if (action) {
      switch (action) {
        case "clear":
          currentInput = "";
          updateScreen("0");
          break;
        case "back":
          currentInput = currentInput.slice(0, -1);
          updateScreen(currentInput || "0");
          break;
        case "add":
        case "subtract":
        case "multiply":
        case "divide":
          if (endsWithOperator(currentInput)) return;
          currentInput += getOperator(action);
          updateScreen(currentInput);
          break;
        case "equals":
          if (endsWithOperator(currentInput)) return;
          try {
            let result = eval(currentInput);
            if (!isFinite(result)) throw Error("Division par 0");
            addToHistory(currentInput, result);
            currentInput = result.toString();
            updateScreen(currentInput);
          } catch (e) {
            updateScreen("Erreur");
            currentInput = "";
          }
          break;
      }
    }
  });
});

function updateScreen(value) {
  screen.textContent = value;
}

function endsWithOperator(str) {
  return /[+\-*/]$/.test(str);
}

function getOperator(action) {
  return { add: "+", subtract: "-", multiply: "*", divide: "/" }[action];
}

function addToHistory(expr, result) {
  const li = document.createElement("li");
  li.textContent = `${expr} = ${result}`;
  historyList.prepend(li);
}
