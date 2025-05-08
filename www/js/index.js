document.documentElement.classList.toggle("light");

function init() {
  const calculateBtn = document.getElementById("calculateBtn");
  const weightInput = document.getElementById("weight");
  const heightInput = document.getElementById("height");
  const resultDisplay = document.getElementById("result");

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
    resultDisplay.className = `mt-6 text-center text-lg font-medium ${textColorClass}`;
  }
}

document.addEventListener("deviceready", init);
document.addEventListener("DOMContentLoaded", init);
