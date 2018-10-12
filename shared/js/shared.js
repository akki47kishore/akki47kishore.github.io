let newItemCount = 0;

/**
 * Validation of Inbound/Outbound Entries.
 *
 * @param name
 * @param date
 * @param itemQuantitiesSet - Array of quantities of various items.
 */
function validate(name, date, itemQuantitiesSet) {
    let numberOfErrors = 0;
    if (name === '') {
        document.getElementById('name').focus();
        document.getElementById('error-message').innerHTML = '*Please Enter Name';
        return 0;
    }
    if (date === '') {
        document.getElementById('date').focus();
        document.getElementById('error-message').innerHTML = '*Please Enter Date';
        return 0;
    }
    if (newItemCount === 0) {
        document.getElementById('error-message').innerHTML = '*Please Add some elements to continue';
        return 0;
    }
    for (const key in itemQuantitiesSet) {
        quantity = itemQuantitiesSet[key].value;
        if (quantity === '') {
            itemQuantitiesSet[key].style.background = 'pink';
            numberOfErrors += 1;
        } else if (parseInt(quantity) <= 0) {
            itemQuantitiesSet[key].style.background = 'pink';
            numberOfErrors += 1;
        }
    }
    if (numberOfErrors !== 0) {
        document.getElementById('error-message').innerHTML = '*Please fill all fields. Avoid negative numbers and Zero';
        return 0;
    } else {
        return 1;
    }
}

/**
 * Converts a word to sentence case.
 *
 * @param word  - word to be converted to sentence case.
 */
function sentenceCase(word) {
    word = word.toString();
    word = word.replace(word.charAt(0), word.charAt(0).toUpperCase());
    return word;
}

/**
 * creating a new {item - quantity - button}  set for retrieving input
 */
function addNewElement(container) {
    let input = `<select class='new-item-name' id='new-item-name${newItemCount}'> `;
    initialStock.forEach((element) => {
        if (element[3]) {
            input += `<option value='${element[2]}_${element[1]}_${element[0]}'>${element[0]}</option>`;
        } else if (element[2]) {
            input += `<option value='${element[1]}_${element[0]}'>${element[0]}</option>`;
        }
    });
    input += `</select>
    <input type = 'number' class='new-item-quantity' id='new-item-quantity${newItemCount}' onkeyup="changeFieldColor(${newItemCount},'new-item-quantity')"> </input>
    <button type='button' class='remove-button' id='new-remove-button${newItemCount}' onclick="removeNewElement('${container}','new-item-quantity'+${newItemCount},'new-item-name'+${newItemCount},'new-remove-button${newItemCount}')"><b>-</b></button>`;
    newItemCount += 1;
    document.getElementById('error-message').innerHTML = '';
    const parent = document.getElementById(container);
    parent.insertAdjacentHTML('beforeend', input);
}

/**
 * Display Outbound/Inbound Modal.
 */
const openModal = (type) => {
    document.getElementById(`${type}-modal`).style.display = 'block';
    document.body.classList.add('hide-body');
    return 1;
};

/**
 * Display Inbound Modal.
 */
const addInbound = () => {
    document.getElementById('inbound-modal').style.display = 'block';
    document.body.classList.add('hide-body');
    return 1;
};

/**
 * Removing an {item - quantity - button}  set
 * @param section
 */
function removeNewElement(section, quantity, name, button) {
    const parent = document.getElementById(section);
    if (document.getElementById(name)) {
        parent.removeChild(document.getElementById(name));
        parent.removeChild(document.getElementById(quantity));
        parent.removeChild(document.getElementById(button));
        newItemCount -= 1;
        document.getElementById('error-message').innerHTML = '';
    }
}

/**
 * Calculate sum of elements of an array
 * @param  accumulator - stores sum
 * @param  currentValue - stores current element
 */
const arraySum = (accumulator, currentValue) => accumulator + currentValue;

function initialise() {
    const inboundOutboundFormat = Object.assign({
        name: '',
        date: ''
    }, {
        supplies: currentStock
    });
    initialStock.forEach((element) => {
        if (element[3]) {
            inboundOutboundFormat.supplies[element[2]][element[1]][element[0]] = 0;
        } else if (element[2]) {
            inboundOutboundFormat.supplies[element[1]][element[0]] = 0;
        }
    });
    return inboundOutboundFormat;
}

/**
 * Append details of each item to its corresponding section.
 * @param type - specifies whether "inbound" or "outbound" or "current -stock".
 * @param id - specifies inbound/outbound id.
 */

function showDetails(...args) {
    let data;
    const type = args[0];
    const id = args[1];
    let table;
    document.body.classList.add('hide-body');

    if (type === 'inbound') {
        data = JSON.parse(localStorage.getItem(`inb${id}`));
        document.getElementById('inbound-details-modal').style.display = 'block';
        document.getElementById('nameSection').innerHTML = `   ${sentenceCase(data.name)}`;
        document.getElementById('dateSection').innerHTML = `    ${data.date}`;
        data = data.supplies;
        table = 'inbound-item-details';
    } else if (type === 'outbound') {
        data = JSON.parse(localStorage.getItem(`out${id}`));
        document.getElementById('outbound-details-modal').style.display = 'block';
        document.getElementById('nameSection').innerHTML = `${sentenceCase(data.name)}`;
        document.getElementById('dateSection').innerHTML = `${sentenceCase(data.date)}`;
        data = data.supplies;
        table = 'outbound-item-details';
    } else {
        document.getElementById('stock-details-modal').style.display = 'block';
        data = currentStock;
        table = 'stock-details';
    }

    $(`#${table}`).dataTable().fnDestroy();
    const detailsTable = $(`#${table}`).DataTable({
        ordering: true,
        searching: true,
        responsive: true,
        paging: false,
        createdRow: (row) => {
            $('td', row).eq(1).addClass('highlighted');
            $('td', row).eq(0).addClass('highlighted-item');
        }
    });
    detailsTable.clear().draw();
    let category = '';
    let subcategory = [];
    let categorySum = 0;
    let subcategorySum = 0;

    itemList.forEach((element) => {
        category = data[element];
        subcategory = Object.keys(category);
        let node;
        categorySum = 0;
        let childRows = '';
        if (typeof (category[subcategory[0]]) === 'object') {
            for (const type of subcategory) {
                subcategorySum = 0;
                subcategorySum = Object.values(category[type]).reduce(arraySum);
                if (subcategorySum > 0) {
                    categorySum += subcategorySum;
                    node = Object.keys(category[type]).filter(x => category[type][x] > 0);
                    node = node.map(x => `<section class='cloth-items'>${sentenceCase(x)}</section> <section class = 'cloth-items-value'>${category[type][x]}</section>`);
                    node.unshift(`<section class = 'clothType'>${sentenceCase(type)}</section><section class = 'clothType-data'>${subcategorySum}</section>`);
                    childRows += node;
                    childRows = childRows.replace(/,/g, ' ');
                }
            }
            if (categorySum !== 0) {
                detailsTable.row.add([sentenceCase(element).bold(), categorySum]);
                detailsTable.row(':last').child(childRows);
            }
        } else {
            categorySum = Object.values(category).reduce(arraySum);
            if (categorySum !== 0) {
                detailsTable.row.add([sentenceCase(element).bold(), categorySum]);
                node = Object.keys(category).filter(x => category[x] > 0);
                childRows += node.map(x => `<section class='data'>${sentenceCase(x)}</section> <section class = 'data-value'>${category[x]}</section>`);
                childRows = childRows.replace(/,/g, ' ');
                detailsTable.row(':last').child(childRows);
            }
        }
    });
    detailsTable.draw(false);

    $(`#${table} tbody`).on('click', 'tr', function () {
        const rowchild = detailsTable.row(this).child;
        if (rowchild.isShown()) {
            rowchild.hide();
        } else {
            rowchild.show();
        }
    });
}

/**
 * Hide the specified modal.
 *
 * @param  modalId - specifies the modal.
 */
const closeModal = (modalId) => {
    document.getElementById(modalId).style.display = 'none';
    const error = document.getElementById('error-message');
    if (error) {
        error.innerHTML = '';
    }
    document.body.classList.remove('hide-body');
};

const changeFieldColor = (id, element) => document.getElementById(element + id).style.background = 'transparent';
