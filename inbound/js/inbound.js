
/**
 * Adding new Inbound Stock. 
 */
function addNewInbound() {
    let inboundOutboundFormat = initialise();
    let itemNamesSet = document.getElementsByClassName('new-item-name');
    let itemQuantitiesSet = document.getElementsByClassName('new-item-quantity');
    let quantity;

    let name = document.getElementById("name").value;
    let date = document.getElementById("date").value;
    currentStock = JSON.parse(localStorage.getItem("currentStock"));
    if (itemNamesSet) {
        // validation of input
        let result = validate(name, date, itemQuantitiesSet);
        if(result == 0){
            return 0;
        }

        // assigning values to new inbound object
        for (let key in itemNamesSet) {
            let itemIndex = itemNamesSet[key].value;
            if (itemIndex) {
                quantity = parseInt(itemQuantitiesSet[key].value);
                itemIndex = itemIndex.split("_");
                let itemType = itemIndex[0];
                if (typeof(itemIndex[2])=='undefined') {
                    inboundOutboundFormat.supplies[itemType][itemIndex[1]] += quantity;
                    currentStock[itemType][itemIndex[1]] += quantity;
                } else {
                    let itemsubType = itemIndex[1];
                    inboundOutboundFormat.supplies[itemType][itemsubType][itemIndex[2]] += quantity;
                    currentStock[itemType][itemsubType][itemIndex[2]] += quantity;
                }
            } 
        }
    }
    inboundOutboundFormat.name = name;
    inboundOutboundFormat.date = date;
    let incoming = [];
    incoming = JSON.parse(localStorage.getItem("inbound"));
    let incomingCount = parseInt(localStorage.getItem("inbound-count"));
    incoming[incomingCount] = `inb${incomingCount}`;
    localStorage.setItem("inbound", JSON.stringify(incoming));
    localStorage.setItem(`inb${incomingCount}`, JSON.stringify(inboundOutboundFormat));
    incomingCount++;
    localStorage.setItem("inbound-count", incomingCount);
    localStorage.setItem("currentStock", JSON.stringify(currentStock));
    document.body.classList.remove("hide-body");
    router('inbound');
}

