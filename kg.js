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

        if (isNaN(enteredWeight) || enteredWeight > 300) {
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
        selectedPlateWeights.push(parseFloat(checkbox.value)); // Push selected weights
    });

    return selectedPlateWeights;
}

function calculateRequiredPlates(desiredWeight, selectedPlateWeights) {
    const barWeight = 20; // 20 kg for the barbell
    let remainingWeight = (desiredWeight - barWeight) / 2; // Divide by 2 for one side of the bar
    let platesNeeded = {};

    // Sort selectedPlateWeights array in descending order
    selectedPlateWeights.sort((a, b) => b - a);

    for (const plate of selectedPlateWeights) {
        const count = Math.floor(remainingWeight / plate);
        if (count > 0) {
            platesNeeded[plate] = count;
            remainingWeight -= count * plate;
        }
        if (remainingWeight === 0) {
            break;
        }
    }

    if (remainingWeight === 0) {
        let outputText = "Plate breakdown:<br>";
        let imageHtml = "";
        let weightlbs = (Math.floor(desiredWeight * 2.2)) + "lbs";

        for (const plate of selectedPlateWeights) { // Iterate over sorted plate weights
            if (platesNeeded[plate] !== undefined) { // Check if plate is needed
                
                outputText += `${platesNeeded[plate]} x ${plate} kg plates<br>`;
                
                const scaledHeight = Math.round(100 * (plate / 20)); // Assuming the barbell's weight is 20 kg
                imageHtml +=
                    `<img src="imageskg/plate_${plate}.jpg" alt="${plate} kg Plate" ">`
                        .repeat(platesNeeded[plate]);
            }
        }

        document.getElementById("output").innerHTML = outputText;
        document.getElementById("lbsout").innerHTML = weightlbs
        document.getElementById("images").innerHTML = imageHtml; // Add images
    } else {
        document.getElementById("output").innerHTML =
            "It's not possible to achieve the desired weight with the given plates.";
        document.getElementById("images").innerHTML = ""; // Clear images if not possible
    }
}



function calculateTotalWeight(oneSideWeight) {
    const barWeight = 20; // 20 kg for the barbell
    const totalWeight = oneSideWeight * 2 + barWeight;
    document.getElementById(
        "output"
    ).innerHTML = `Total weight: ${totalWeight.toFixed(2)} kg`;
}

function convert() {
    const lbsInput = document.getElementById("lbsnum").value; // Extracting the value
    const converted = document.getElementById("converted");
    const kgValue = lbsInput / 2.2; // Conversion factor from lbs to kg

    // Display the converted value
    converted.textContent = `${lbsInput} lbs is approximately ${kgValue.toFixed(2)} kg`;
}


function darkModeToggle() {
    var element = document.body;
    element.classList.toggle("dark-mode");
}
