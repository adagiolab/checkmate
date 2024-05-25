// scripts.js
document.getElementById('billForm').addEventListener('submit', function(event) {
    event.preventDefault();
    calculateBill();
});

document.getElementById('numPeople').addEventListener('change', updatePersonSelectOptions);
document.getElementById('totalNettBill').addEventListener('change', validateTotalBill);

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

    validateTotalBill();
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

    const gstCheckbox = document.createElement('input');
    gstCheckbox.type = 'checkbox';
    gstCheckbox.classList.add('gst-checkbox');
    gstCheckbox.addEventListener('change', validateTotalBill);
    const gstLabel = document.createElement('label');
    gstLabel.textContent = 'GST (9%)';
    gstLabel.appendChild(gstCheckbox);

    const serviceChargeCheckbox = document.createElement('input');
    serviceChargeCheckbox.type = 'checkbox';
    serviceChargeCheckbox.classList.add('service-charge-checkbox');
    serviceChargeCheckbox.addEventListener('change', validateTotalBill);
    const serviceChargeLabel = document.createElement('label');
    serviceChargeLabel.textContent = 'Service Charge (10%)';
    serviceChargeLabel.appendChild(serviceChargeCheckbox);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-button');

    deleteButton.addEventListener('click', function() {
        itemContainer.remove();
        validateTotalBill();
    });

    const personSelectContainer = document.createElement('div');
    personSelectContainer.classList.add('button-style');

    personSelectContainer.appendChild(personSelect);
    personSelectContainer.appendChild(gstLabel);
    personSelectContainer.appendChild(serviceChargeLabel);
    personSelectContainer.appendChild(deleteButton);

    const itemInput = document.createElement('input');
    itemInput.type = 'number';
    itemInput.step = '0.01';
    itemInput.classList.add('individual-item');
    itemInput.addEventListener('input', validateTotalBill);

    itemContainer.appendChild(personSelectContainer);
    itemContainer.appendChild(itemInput);

    individualItemsSection.appendChild(itemContainer);

    personSelect.addEventListener('change', function() {
        itemInput.dataset.personIndex = personSelect.value;
    });

    itemInput.dataset.personIndex = personSelect.value;
}

function validateTotalBill() {
    const totalNettBill = parseFloat(document.getElementById('totalNettBill').value);
    const itemInputs = document.querySelectorAll('.individual-item');
    let sum = 0;

    itemInputs.forEach(input => {
        sum += parseFloat(input.value) || 0;
    });

    const gstCheckbox = document.querySelector('.gst-checkbox');
    const serviceChargeCheckbox = document.querySelector('.service-charge-checkbox');

    if (gstCheckbox.checked) {
        sum += sum * 0.09; // Add 9% GST
    }

    if (serviceChargeCheckbox.checked) {
        sum += sum * 0.1; // Add 10% service charge
    }

    if (sum > totalNettBill) {
        alert('The sum of individual items exceeds the total nett bill value.');
        return false;
    } else {
        return true;
    }
}

// Call updatePersonSelectOptions initially to populate the options based on the current value of numPeople
updatePersonSelectOptions();

function calculateBill() {
    const totalBill = parseFloat(document.getElementById('totalNettBill').value);
    const numPeople = parseInt(document.getElementById('numPeople').value);
    const gstCheckbox = document.querySelector('.gst-checkbox');
    const serviceChargeCheckbox = document.querySelector('.service-charge-checkbox');

    let totalWithCharges = totalBill;

    // Subtract individual item costs
    const individualItemInputs = document.querySelectorAll('.individual-item');
    individualItemInputs.forEach(input => {
        totalWithCharges -= parseFloat(input.value) || 0;
    });

    // Subtract GST
    if (gstCheckbox.checked) {
        totalWithCharges -= totalBill * 0.09;
    }

    // Subtract service charge
    if (serviceChargeCheckbox.checked) {
        totalWithCharges -= totalBill * 0.10;
    }

    // Calculate cost of shared items per person
    const sharedItemCostPerPerson = totalWithCharges / numPeople;

    // Calculate total amount each person owes
    const individualAmounts = Array(numPeople).fill(sharedItemCostPerPerson);
    individualItemInputs.forEach(input => {
        const personIndex = parseInt(input.dataset.personIndex);
        const itemAmount = parseFloat(input.value);
        individualAmounts[personIndex] += itemAmount;
    });

    displayResult(individualAmounts);
}
