/**
 * Assigning new Outbound data.
 */
function addNewOutbound() {
    const inboundOutboundFormat = initialise();
    const itemNamesSet = document.getElementsByClassName('new-item-name');
    const itemQuantitiesSet = document.getElementsByClassName('new-item-quantity');
    let itemIndex;
    let quantity;
    currentStock = JSON.parse(localStorage.getItem('currentStock'));
    const temp = JSON.parse(JSON.stringify(currentStock));
    const name = document.getElementById('name').value;
    const date = document.getElementById('date').value;
    if (itemNamesSet) {
        const result = validate(name, date, itemQuantitiesSet);
        if (result === 0) {
            return 0;
        }
        for (let key in itemNamesSet) {
            itemIndex = itemNamesSet[key].value;
            quantity = parseInt(itemQuantitiesSet[key].value);
            if (itemIndex && newItemCount != 0) {
                quantity = parseInt(itemQuantitiesSet[key].value);
                itemIndex = itemIndex.split('_');
                let itemType = itemIndex[0];

                if (typeof (itemIndex[2]) == 'undefined') {
                    if ((temp[itemType][itemIndex[1]] - quantity) >= 0) {
                        inboundOutboundFormat.supplies[itemType][itemIndex[1]] += quantity;
                        temp[itemType][itemIndex[1]] -= quantity;
                    } else {
                        document.getElementById("error-message").innerHTML = `*Not enough Stock for ${itemIndex[1]}.Only ${ currentStock[itemType][itemIndex[1]]} left`;
                        return 0;
                    }

                } else {
                    let itemSubType = itemIndex[1];
                    if ((temp[itemType][itemSubType][itemIndex[2]] - quantity) >= 0) {
                        temp[itemType][itemSubType][itemIndex[2]] -= quantity;
                        inboundOutboundFormat.supplies[itemType][itemSubType][itemIndex[2]] += quantity;
                    } else {
                        document.getElementById("error-message").innerHTML = `*Not enough Stock for ${itemIndex[2]}. Only ${currentStock[itemType][itemSubType][itemIndex[2]]} left`;
                        return 0;
                    }

                }

            } else if (newItemCount == 0) {
                document.getElementById("error-message").innerHTML = `*Please Add some elements to continue`;
                return 0;
            }
        }
    }
    initialStock.forEach(element => {
        if(element[3]){
            currentStock[element[2]][element[1]][element[0]] -= inboundOutboundFormat.supplies[element[2]][element[1]][element[0]];
        }else if(element[2]){
            currentStock[element[1]][element[0]] -= inboundOutboundFormat.supplies[element[1]][element[0]];
        }
    });
    inboundOutboundFormat.name = name;
    inboundOutboundFormat.date = date;
    let outgoing = [];
    outgoing = JSON.parse(localStorage.getItem('outbound'));
    let outgoingCount = parseInt(localStorage.getItem('outbound-count'));
    outgoing[outgoingCount] = `out${outgoingCount}`;
    localStorage.setItem('outbound', JSON.stringify(outgoing));
    localStorage.setItem(`out${outgoingCount}`, JSON.stringify(inboundOutboundFormat));
    outgoingCount += 1;
    localStorage.setItem('outbound-count', outgoingCount);
    localStorage.setItem('currentStock', JSON.stringify(currentStock));
    document.body.classList.remove('hide-body');
    router('outbound');
}
