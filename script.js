// scripts.js
document.getElementById('billForm').addEventListener('submit', function(event) {
    event.preventDefault();
    calculateBill();
});

function calculateBill() {
    const totalBill = parseFloat(document.getElementById('totalBill').value);
    const numPeople = parseInt(document.getElementById('numPeople').value);
    const includeGST = document.getElementById('includeGST').checked;
    const includeServiceCharge = document.getElementById('includeServiceCharge').checked;

    let totalWithCharges = totalBill;
    if (includeGST) {
        totalWithCharges += totalBill * 0.09;
    }
    if (includeServiceCharge) {
        totalWithCharges += totalBill * 0.10;
    }

    let individualAmounts = Array(numPeople).fill(totalWithCharges / numPeople);

    document.querySelectorAll('.individual-item').forEach(item => {
        const personIndex = parseInt(item.dataset.personIndex);
        const itemAmount = parseFloat(item.value);
        individualAmounts[personIndex] += itemAmount / numPeople;
    });

    displayResult(individualAmounts);
}

function addIndividualItem() {
    const numPeople = parseInt(document.getElementById('numPeople').value);
    const individualItemsSection = document.getElementById('individualItemsSection');

    const itemContainer = document.createElement('div');
    itemContainer.classList.add('section');
    itemContainer.classList.add('individual-item-container');

    const personSelect = document.createElement('select');
    personSelect.classList.add('person-select');
    for (let i = 0; i < numPeople; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `Person ${i + 1}`;
        personSelect.appendChild(option);
    }

    const itemInput = document.createElement('input');
    itemInput.type = 'number';
    itemInput.step = '0.01';
    itemInput.classList.add('individual-item');

    itemContainer.appendChild(personSelect);
    itemContainer.appendChild(itemInput);

    individualItemsSection.appendChild(itemContainer);

    personSelect.addEventListener('change', function() {
        itemInput.dataset.personIndex = personSelect.value;
    });

    itemInput.dataset.personIndex = personSelect.value;
}

function displayResult(individualAmounts) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '<h2>Bill Breakdown</h2>';
    individualAmounts.forEach((amount, index) => {
        resultDiv.innerHTML += `<p>Person ${index + 1}: SGD ${amount.toFixed(2)}</p>`;
    });
}
