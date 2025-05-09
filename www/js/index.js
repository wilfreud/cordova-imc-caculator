document.documentElement.classList.toggle("light");

function init() {
  // Configuration for history size
  const MAX_HISTORY_SIZE = 3; // Default maximum history entries

  const calculateBtn = document.getElementById("calculateBtn");
  const weightInput = document.getElementById("weight");
  const heightInput = document.getElementById("height");
  const resultDisplay = document.getElementById("result");
  const historyList = document.getElementById("historyList");

  // Load calculation history from localStorage
  let calculationHistory = [];
  try {
    const savedHistory = localStorage.getItem("bmiHistory");
    if (savedHistory) {
      calculationHistory = JSON.parse(savedHistory);
      // Apply size limit on load as well
      if (calculationHistory.length > MAX_HISTORY_SIZE) {
        calculationHistory = calculationHistory.slice(0, MAX_HISTORY_SIZE);
        localStorage.setItem("bmiHistory", JSON.stringify(calculationHistory));
      }
      displayHistory();
    }
  } catch (error) {
    console.error("Error loading history:", error);
  }

  calculateBtn.addEventListener("click", calculateBMI);

  [weightInput, heightInput].forEach((input) => {
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") calculateBMI();
    });
  });

  function calculateBMI() {
    console.log("Calculating BMI...");
    const weight = parseFloat(weightInput.value);
    const height = parseFloat(heightInput.value);

    if (!weight || !height || height <= 0) {
      showResult("Entrée invalide", "text-red-500");
      return;
    }

    const bmi = weight / (height * height);
    const bmiValue = bmi.toFixed(2);
    const interpretation = interpretBMI(bmi);

    showResult(`${bmiValue} (${interpretation})`, "text-[#A53860]");

    // Save to history
    addToHistory(weight, height, bmiValue, interpretation);
  }

  function interpretBMI(bmi) {
    if (bmi < 18.5) return "Insuffisance pondérale";
    if (bmi < 25) return "Poids normal";
    if (bmi < 30) return "Surpoids";
    if (bmi < 35) return "Obésité modérée";
    if (bmi < 40) return "Obésité sévère";
    return "Obésité morbide";
  }

  function showResult(text, textColorClass) {
    resultDisplay.textContent = text;
    resultDisplay.className = `text-center text-lg font-medium ${textColorClass}`;
  }

  function addToHistory(weight, height, bmi, interpretation) {
    // Create history entry with timestamp
    const now = new Date();
    const timestamp =
      now.toLocaleDateString("fr-FR") +
      " " +
      now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

    const historyEntry = {
      timestamp: timestamp,
      weight: weight,
      height: height,
      bmi: bmi,
      interpretation: interpretation,
    };

    // Add to history array with size limit
    calculationHistory.unshift(historyEntry);
    if (calculationHistory.length > MAX_HISTORY_SIZE) {
      calculationHistory = calculationHistory.slice(0, MAX_HISTORY_SIZE);
    }

    // Save to localStorage
    try {
      localStorage.setItem("bmiHistory", JSON.stringify(calculationHistory));
    } catch (error) {
      console.error("Error saving history:", error);
    }

    // Update display
    displayHistory();
  }

  function displayHistory() {
    // Clear existing history display
    historyList.innerHTML = "";

    if (calculationHistory.length === 0) {
      const emptyMessage = document.createElement("p");
      emptyMessage.className = "text-gray-500 text-center py-3 text-sm italic";
      emptyMessage.textContent = "Aucun historique disponible";
      historyList.appendChild(emptyMessage);
      return;
    }

    // Add each history entry as an individual pink box
    calculationHistory.forEach((entry) => {
      const historyItem = document.createElement("div");
      // Make each item a pink box with proper styling
      historyItem.className =
        "bg-[#F8E7F6] border border-[#DD88CF] rounded p-3 m-3 shadow-sm hitem";

      // Main result with value and interpretation on same line
      const resultText = document.createElement("div");
      resultText.className = "flex justify-between items-center";

      const bmiValue = document.createElement("span");
      bmiValue.className = "font-medium text-[#4B164C]";
      bmiValue.textContent = `${entry.bmi} (${entry.interpretation})`;

      const timeStamp = document.createElement("span");
      timeStamp.className = "text-xs text-gray-500";
      timeStamp.textContent = entry.timestamp;

      resultText.appendChild(bmiValue);
      resultText.appendChild(timeStamp);

      // Details with measurements
      const details = document.createElement("div");
      details.className = "text-xs text-gray-600 mt-1";
      details.textContent = `Poids: ${entry.weight} kg, Taille: ${entry.height} m`;

      historyItem.appendChild(resultText);
      historyItem.appendChild(details);
      historyList.appendChild(historyItem);
    });
  }
}

document.addEventListener("deviceready", init);
document.addEventListener("DOMContentLoaded", init);
