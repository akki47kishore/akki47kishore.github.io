/**
 * Adding new Inbound Stock.
 */
function addNewInbound() {
    const inboundOutboundFormat = initialise();
    const itemNamesSet = document.getElementsByClassName('new-item-name');
    const itemQuantitiesSet = document.getElementsByClassName('new-item-quantity');
    let quantity;
    const name = document.getElementById('name').value;
    const date = document.getElementById('date').value;
    currentStock = JSON.parse(localStorage.getItem('currentStock'));
    if (itemNamesSet) {
        // validation of input
        const result = validate(name, date, itemQuantitiesSet);
        if (result === 0) {
            return 0;
        }

        // assigning values to new inbound object
        for (const key in itemNamesSet) {
            if (typeof (key) !== 'undefined') {
                let itemIndex = itemNamesSet[key].value;
                if (itemIndex) {
                    quantity = parseInt(itemQuantitiesSet[key].value);
                    itemIndex = itemIndex.split('_');
                    const itemType = itemIndex[0];
                    if (typeof (itemIndex[2]) === 'undefined') {
                        inboundOutboundFormat.supplies[itemType][itemIndex[1]] += quantity;
                        currentStock[itemType][itemIndex[1]] += quantity;
                    } else {
                        const itemsubType = itemIndex[1];
                        inboundOutboundFormat.supplies[itemType][itemsubType][itemIndex[2]] += quantity;
                        currentStock[itemType][itemsubType][itemIndex[2]] += quantity;
                    }
                }
            }
        }
    }
    inboundOutboundFormat.name = name;
    inboundOutboundFormat.date = date;
    let incoming = [];
    incoming = JSON.parse(localStorage.getItem('inbound'));
    let incomingCount = parseInt(localStorage.getItem('inbound-count'));
    incoming[incomingCount] = `inb${incomingCount}`;
    localStorage.setItem('inbound', JSON.stringify(incoming));
    localStorage.setItem(`inb${incomingCount}`, JSON.stringify(inboundOutboundFormat));
    incomingCount += 1;
    localStorage.setItem('inbound-count', incomingCount);
    localStorage.setItem('currentStock', JSON.stringify(currentStock));
    document.body.classList.remove('hide-body');
    router('inbound');
}
