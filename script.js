// scripts.js
document.getElementById('billForm').addEventListener('submit', function(event) {
    event.preventDefault();
    calculateBill();
});

document.getElementById('numPeople').addEventListener('change', updatePersonSelectOptions);

function updatePersonSelectOptions() {
    const numPeople = parseInt(document.getElementById('numPeople').value);
    const personSelects = document.querySelectorAll('.person-select');

    personSelects.forEach(select => {
        // Clear existing options
        while (select.firstChild) {
            select.removeChild(select.firstChild);
        }

        // Add new options based on the current number of people
        for (let i = 0; i < numPeople; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = `Person ${i + 1}`;
            select.appendChild(option);
        }

        // Update the data-personIndex attribute based on the new options
        const selectedValue = parseInt(select.dataset.personIndex);
        if (selectedValue < numPeople) {
            select.value = selectedValue;
        } else {
            select.value = 0;
            select.dataset.personIndex = 0;
        }
    });
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

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-button');

    deleteButton.addEventListener('click', function() {
        itemContainer.remove();
    });

    const itemInput = document.createElement('input');
    itemInput.type = 'number';
    itemInput.step = '0.01';
    itemInput.classList.add('individual-item');

    const gstCheckbox = document.createElement('input');
    gstCheckbox.type = 'checkbox';
    gstCheckbox.classList.add('gst-checkbox');
    const gstLabel = document.createElement('label');
    gstLabel.textContent = 'GST (9%)';
    gstLabel.appendChild(gstCheckbox);

    const serviceChargeCheckbox = document.createElement('input');
    serviceChargeCheckbox.type = 'checkbox';
    serviceChargeCheckbox.classList.add('service-charge-checkbox');
    const serviceChargeLabel = document.createElement('label');
    serviceChargeLabel.textContent = 'Service Charge (10%)';
    serviceChargeLabel.appendChild(serviceChargeCheckbox);

    const personSelectContainer = document.createElement('div');
    personSelectContainer.classList.add('button-style');

    personSelectContainer.appendChild(personSelect);
    personSelectContainer.appendChild(deleteButton);

    itemContainer.appendChild(personSelectContainer);
    itemContainer.appendChild(itemInput);
    itemContainer.appendChild(gstLabel);
    itemContainer.appendChild(serviceChargeLabel);

    individualItemsSection.appendChild(itemContainer);

    personSelect.addEventListener('change', function() {
        itemInput.dataset.personIndex = personSelect.value;
    });

    itemInput.dataset.personIndex = personSelect.value;
}

// Call updatePersonSelectOptions initially to populate the options based on the current value of numPeople
updatePersonSelectOptions();

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



function displayResult(individualAmounts) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '<h2>Bill Breakdown</h2>';
    individualAmounts.forEach((amount, index) => {
        resultDiv.innerHTML += `<p>Person ${index + 1}: SGD ${amount.toFixed(2)}</p>`;
    });
}
