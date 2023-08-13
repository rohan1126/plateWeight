document.addEventListener("DOMContentLoaded", function () {
  const calculationRadioButtons = document.getElementsByName("calculation");
  const weightInput = document.getElementById("weightInput");
  const calculateButton = document.getElementById("calculateButton");
  const output = document.getElementById("output");
  const checkboxesContainer = document.getElementById("checkboxesContainer");

  // Add event listeners for calculation radio buttons
  calculationRadioButtons.forEach((radio) => {
    radio.addEventListener("change", function () {
      checkboxesContainer.style.display =
        radio.value === "requiredPlates" || "totalWeight" ? "block" : "none";
    });
    1;
  });

  // Trigger the change event on "Required Plates" radio button to show checkboxes on load
  calculationRadioButtons[0].dispatchEvent(new Event("change"));

  calculateButton.addEventListener("click", function () {
    const selectedCalculation = document.querySelector(
      "input[name='calculation']:checked"
    ).value;
    const enteredWeight = parseFloat(weightInput.value);

    if (isNaN(enteredWeight)) {
      output.innerHTML = "Please enter a valid weight.";
      return;
    }

    const selectedPlateWeights = getSelectedPlateWeights();

    if (selectedCalculation === "requiredPlates") {
      calculateRequiredPlates(enteredWeight, selectedPlateWeights);
    } else if (selectedCalculation === "totalWeight") {
      calculateTotalWeight(enteredWeight, selectedPlateWeights);
    }
  });
});

function getSelectedPlateWeights() {
  const selectedPlateWeights = [];
  const plateWeightCheckboxes = document.querySelectorAll(
    "input[name='plateWeight']:checked"
  );

  plateWeightCheckboxes.forEach((checkbox) => {
    selectedPlateWeights.push(parseFloat(checkbox.value));
  });

  return selectedPlateWeights;
}

function calculateRequiredPlates(desiredWeight, selectedPlateWeights) {
  const barWeight = 45;
  let remainingWeight = (desiredWeight - barWeight) / 2;
  let plateCounts = {};

  for (const plate of selectedPlateWeights) {
    const count = Math.floor(remainingWeight / plate);
    if (count > 0) {
      plateCounts[plate] = count;
      remainingWeight -= count * plate;
    }
    if (remainingWeight === 0) {
      break;
    }
  }

  if (remainingWeight === 0) {
    let outputText = "Plate breakdown:<br>";
    let imageHtml = "";

    for (const plate in plateCounts) {
      outputText += `${plateCounts[plate]} x ${plate} lb plates<br>`;
      imageHtml +=
        `<img src="plate_${plate}.jpg" alt="${plate} lb Plate">`.repeat(
          plateCounts[plate]
        );
    }

    document.getElementById("output").innerHTML = outputText;
    document.getElementById("images").innerHTML = imageHtml;
  } else {
    document.getElementById("output").innerHTML =
      "It's not possible to achieve the desired weight with the given plates.";
    document.getElementById("images").innerHTML = ""; // Clear images if not possible
  }
}

function calculateTotalWeight(oneSideWeight) {
  const barWeight = 45;
  const totalWeight = oneSideWeight * 2 + barWeight;
  document.getElementById(
    "output"
  ).innerHTML = `Total weight: ${totalWeight} lbs`;
}
