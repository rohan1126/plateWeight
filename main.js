document.addEventListener("DOMContentLoaded", function () {
  const calculationRadioButtons = document.getElementsByName("calculation");
  const weightInput = document.getElementById("weightInput");
  const calculateButton = document.getElementById("calculateButton");
  const output = document.getElementById("output");
  const checkboxesContainer = document.getElementById("checkboxesContainer");

  calculationRadioButtons.forEach((radio) => {
    radio.addEventListener("change", function () {
      checkboxesContainer.style.display =
        radio.value === "requiredPlates" || "totalWeight" ? "block" : "none";
      weightInput.value = ""; // Clear the input field when switching options
      output.innerHTML = ""; // Clear the output
      document.getElementById("images").innerHTML = ""; // Clear the images
    });
  });

  // Trigger the change event on "Required Plates" radio button to show checkboxes on load
  calculationRadioButtons[0].dispatchEvent(new Event("change"));

  calculateButton.addEventListener("click", function () {
    const selectedCalculation = document.querySelector(
      "input[name='calculation']:checked"
    ).value;
    const enteredWeight = parseFloat(weightInput.value);

    if (isNaN(enteredWeight) || enteredWeight > 499) {
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

    const plateWeights = Object.keys(plateCounts)
      .map((plate) => parseFloat(plate))
      .sort((a, b) => b - a); // Sort plate weights in reverse order

    const largestPlateWeight = plateWeights[0]; // Get the weight of the largest plate

    for (const plate of plateWeights) {
      const scale = plate / largestPlateWeight; // Calculate the scaling factor
      let scaledHeight = Math.round(100 * scale);

      // Set a minimum
      if (plate === 10 && scaledHeight < 40) {
        scaledHeight = 60;
      } else if (plate === 5 && scaledHeight < 30) {
        scaledHeight = 50;
      } else if (plate === 2.5 && scaledHeight < 20) {
        scaledHeight = 40;
      }

      outputText += `${plateCounts[plate]} x ${plate} kg plates<br>`;
      imageHtml +=
        `<img src="images/plate_${plate}.jpg" alt="${plate} lb Plate" style="height: ${scaledHeight}px;">`.repeat(
          plateCounts[plate]
        );
    }

    document.getElementById("output").innerHTML = outputText;
    document.getElementById("images").innerHTML = imageHtml; // Add images
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
function darkModeToggle() {
  var element = document.body;
  element.classList.toggle("dark-mode");
}
