document.getElementById('billForm').addEventListener('submit', function(event) {
    event.preventDefault();
    if (validateTotalBill()) {
        calculateBill();
    }
});

document.getElementById('numPeople').addEventListener('change', updatePersonSelectOptions);
document.getElementById('totalNettBill').addEventListener('change', validateTotalBill);

function updatePersonSelectOptions() {
    const numPeople = parseInt(document.getElementById('numPeople').value);
    const nameInputsDiv = document.getElementById('nameInputs');

    // Clear existing name input fields
    nameInputsDiv.innerHTML = '';

    // Add new name input fields based on the current number of people
    for (let i = 0; i < numPeople; i++) {
        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.placeholder = `Person ${i + 1} Name`;
        nameInput.classList.add('person-name');
        nameInput.dataset.personIndex = i;
        nameInput.addEventListener('input', updateDropdownOptions);
        nameInputsDiv.appendChild(nameInput);
    }

    validateTotalBill();
    updateDropdownOptions(); // Ensure dropdown options are updated immediately
}

function updateDropdownOptions() {
    const names = document.querySelectorAll('.person-name');
    const personSelects = document.querySelectorAll('.person-select');

    personSelects.forEach(select => {
        const selectedValue = select.value;
        select.innerHTML = '';
        names.forEach((nameInput, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = nameInput.value || `Person ${index + 1}`;
            select.appendChild(option);
        });
        select.value = selectedValue;
    });

    // Update bill breakdown if the names change
    calculateBill();
}

function addIndividualItem() {
    const numPeople = parseInt(document.getElementById('numPeople').value);
    const names = document.querySelectorAll('.person-name');
    const individualItemsSection = document.getElementById('individualItemsSection');

    const itemContainer = document.createElement('div');
    itemContainer.classList.add('section');
    itemContainer.classList.add('individual-item-container');

    const personSelect = document.createElement('select');
    personSelect.classList.add('person-select');
    for (let i = 0; i < numPeople; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = names[i].value || `Person ${i + 1}`;
        personSelect.appendChild(option);
    }

    const gstCheckbox = document.createElement('input');
    gstCheckbox.type = 'checkbox';
    gstCheckbox.classList.add('gst-checkbox');
    gstCheckbox.addEventListener('change', validateTotalBill);
    const gstLabel = document.createElement('label');
    gstLabel.textContent = 'Add GST (9%)?';
    gstLabel.appendChild(gstCheckbox);

    const serviceChargeCheckbox = document.createElement('input');
    serviceChargeCheckbox.type = 'checkbox';
    serviceChargeCheckbox.classList.add('service-charge-checkbox');
    serviceChargeCheckbox.addEventListener('change', validateTotalBill);
    const serviceChargeLabel = document.createElement('label');
    serviceChargeLabel.textContent = 'Add Service Charge (10%)?';
    serviceChargeLabel.appendChild(serviceChargeCheckbox);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-button');

    deleteButton.addEventListener('click', function() {
        itemContainer.remove();
        validateTotalBill();
    });

    const itemInput = document.createElement('input');
    itemInput.defaultValue = 0.00;
    itemInput.type = 'number';
    itemInput.step = '0.01';
    itemInput.min = '0.00';
    itemInput.classList.add('individual-item');
    itemInput.addEventListener('input', validateTotalBill);

    const personSelectContainer = document.createElement('div');
    personSelectContainer.classList.add('button-style');

    personSelectContainer.appendChild(personSelect);
    personSelectContainer.appendChild(itemInput);
    personSelectContainer.appendChild(gstLabel);
    personSelectContainer.appendChild(serviceChargeLabel);
    personSelectContainer.appendChild(deleteButton);

    itemContainer.appendChild(personSelectContainer);

    individualItemsSection.appendChild(itemContainer);

    personSelect.addEventListener('change', function() {
        itemInput.dataset.personIndex = personSelect.value;
    });

    itemInput.dataset.personIndex = personSelect.value;
}

function validateTotalBill() {
    const totalNettBill = parseFloat(document.getElementById('totalNettBill').value);
    if (totalNettBill < 0) {
        alert('The total nett bill cannot be negative.');
        return false;
    }

    const itemInputs = document.querySelectorAll('.individual-item');
    let sum = 0;

    itemInputs.forEach(input => {
        let itemCost = parseFloat(input.value) || 0;
        const gstCheckbox = input.parentElement.querySelector('.gst-checkbox');
        const serviceChargeCheckbox = input.parentElement.querySelector('.service-charge-checkbox');

        if (gstCheckbox && gstCheckbox.checked) {
            itemCost += itemCost * 0.09; // Add 9% GST
        }

        if (serviceChargeCheckbox && serviceChargeCheckbox.checked) {
            itemCost += itemCost * 0.1; // Add 10% service charge
        }

        sum += itemCost;
    });

    if (sum > totalNettBill) {
        alert('The sum of individual items exceeds the total nett bill value.');
        return false;
    }

    return true;
}

updatePersonSelectOptions();

function calculateBill() {
    const totalNettBill = parseFloat(document.getElementById('totalNettBill').value);
    const numPeople = parseInt(document.getElementById('numPeople').value);

    let totalIndividualCosts = 0;
    const individualItemInputs = document.querySelectorAll('.individual-item');
    individualItemInputs.forEach(input => {
        let itemCost = parseFloat(input.value) || 0;
        const gstCheckbox = input.parentElement.querySelector('.gst-checkbox');
        const serviceChargeCheckbox = input.parentElement.querySelector('.service-charge-checkbox');

        if (gstCheckbox && gstCheckbox.checked) {
            itemCost += itemCost * 0.09; // Add 9% GST
        }

        if (serviceChargeCheckbox && serviceChargeCheckbox.checked) {
            itemCost += itemCost * 0.1; // Add 10% service charge
        }

        totalIndividualCosts += itemCost;
    });

    let remainingAmount = totalNettBill - totalIndividualCosts;
    let sharedItemCostPerPerson = remainingAmount / numPeople;

    const individualAmounts = Array(numPeople).fill(sharedItemCostPerPerson);
    individualItemInputs.forEach(input => {
        const personIndex = parseInt(input.dataset.personIndex);
        let itemAmount = parseFloat(input.value) || 0;
        const gstCheckbox = input.parentElement.querySelector('.gst-checkbox');
        const serviceChargeCheckbox = input.parentElement.querySelector('.service-charge-checkbox');

        if (gstCheckbox && gstCheckbox.checked) {
            itemAmount += itemAmount * 0.09; // Add 9% GST
        }

        if (serviceChargeCheckbox && serviceChargeCheckbox.checked) {
            itemAmount += itemAmount * 0.1; // Add 10% service charge
        }

        individualAmounts[personIndex] += itemAmount;
    });

    displayResult(individualAmounts);
}

function displayResult(individualAmounts) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '<h2>Bill Breakdown</h2>';
    const names = document.querySelectorAll('.person-name');
    individualAmounts.forEach((amount, index) => {
        const personName = names[index].value || `Person ${index + 1}`;
        resultDiv.innerHTML += `<p>${personName}: SGD ${amount.toFixed(2)}</p>`;
    });
}
