
document.addEventListener("DOMContentLoaded", function() {
    const calculationRadioButtons = document.getElementsByName("calculation");
    const weightInput = document.getElementById("weightInput");
    const calculateButton = document.getElementById("calculateButton");
    const output = document.getElementById("output");
    const image = document.getElementById("images");

    calculateButton.addEventListener("click", function() {
        const selectedCalculation = document.querySelector("input[name='calculation']:checked").value;
        const enteredWeight = parseFloat(weightInput.value);

        if (isNaN(enteredWeight)) {
            output.innerHTML = "Please enter a valid weight.";
            return;
        }

        if (selectedCalculation === "requiredPlates") {
            calculateRequiredPlates(enteredWeight);
        } else if (selectedCalculation === "totalWeight") {
            calculateTotalWeight(enteredWeight);
        }
    });
});

function calculateRequiredPlates(desiredWeight) {
    const barWeight = 45;
    const plateWeights = [45, 25, 10, 5, 2.5];
    let remainingWeight = (desiredWeight - barWeight) / 2;
    let plateCounts = {};

    for (const plate of plateWeights) {
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
        for (const plate in plateCounts) {
            outputText += `${plateCounts[plate]} x ${plate} lb plates<br>`;
        }
        document.getElementById("output").innerHTML = outputText;
        document.getElementById("images").innerHTML = outputText;
    } else {
        document.getElementById("output").innerHTML = "It's not possible to achieve the desired weight with the given plates.";
    }
}


function calculateTotalWeight(oneSideWeight) {
    const barWeight = 45;
    const totalWeight = (oneSideWeight * 2) + barWeight;
    document.getElementById("output").innerHTML = `Total weight: ${totalWeight} lbs`;
}