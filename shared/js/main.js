/**
 * Set currently selected link as active.
 * 
 * @param choice - represents link to be set active.
 */
function changeLink(choice) {
    let options = ['dashboard', 'inbound', 'outbound'];
    if (typeof (options.find((element) => element == choice)) != 'undefined') {
        options.forEach(function (option) {
            if (option == choice) {
                document.getElementById(choice).classList.add("nowactive");
                window.history.pushState(choice, `state${choice}`, `#${choice}`);
                localStorage.setItem('state', choice);

            } else {
                document.getElementById(option).classList.remove("nowactive");
            }
        });
    } else {
        options = ['about', 'home', 'login'];
        options.forEach(function (option) {
            if (option == choice) {
                document.getElementById(choice).classList.add('active-page');
                window.history.pushState(choice, `state${choice}`, `#${choice}`);
                localStorage.setItem('state', choice);
            } else {
                document.getElementById(option).classList.remove('active-page');
            }
        });
    }

}

/**
 * Fetch an HTML file specified by the url and inject it into specified section.
 * @param url - url to be fetched.
 * @param section - section into which HTML file is injected
 */
function getFile(url, section) {
    const req = new XMLHttpRequest();
    req.open('GET', url, false);
    req.send(null);
    document.getElementById(section).innerHTML = req.responseText;
}

let initialStock;

/**
 * Initialisation on page load
 */
let currentStock;
window.onload = function () {
    changeLink('home');
    const loginFlag = localStorage.getItem('login-flag');
    if (!loginFlag) {
        localStorage.setItem('login-flag', '0');
    }
    currentStock = JSON.parse(localStorage.getItem('currentStock'));
    router('home');
    let checkflag = localStorage.getItem("inbound");
    if (!checkflag) {
        const inbound = [];
        localStorage.setItem('inbound', JSON.stringify(inbound));
        localStorage.setItem('inbound-count', '0');
        const outbound = [];
        localStorage.setItem('outbound', JSON.stringify(outbound));
        localStorage.setItem('outbound-count', '0');
        setCurrentStock();
    }
    initialStock = initialStockArrayConverter();
};

/**
 * Initialising Current Stock with initial stock values
 */
function setCurrentStock() {
    const req = new XMLHttpRequest();
    req.open('GET', 'shared/json/initial-stock.json', false);
    req.send(null);
    const initialStock = JSON.parse(req.responseText);
    currentStock = initialStock.supplies;
    localStorage.setItem('currentStock', JSON.stringify(currentStock));
}

const optionlinks = ['dashboard', 'inbound', 'outbound'];

function locationHashChanged() {
    const link = (location.hash).substring(1);
    if (localStorage.getItem('login-flag') === '1') {
        getFile('dashboard/html/dashboard.html', 'content');
        if (typeof (optionlinks.find(x => x === link)) != 'undefined') {
            changeLink('home');
        }
        if (link != 'login') {
            router(link);
        } else {
            router('dashboard');
        }
    } else if (localStorage.getItem('login-flag') === '0') {
        if (typeof (optionlinks.find(x => x === link)) != 'undefined') {
            router('Not Found');
        } else {
            router(link);
        }
    }
}

window.onhashchange = locationHashChanged;

function initialStockArrayConverter() {
    arrayOfItems = [];
    const req = new XMLHttpRequest();
    req.open('GET', 'shared/json/initial-stock.json', false);
    req.send(null);
    const stock = JSON.parse(req.responseText).supplies;
    for (category in stock) {
        for (item in stock[category]) {
            if (typeof (stock[category][item]) == "object") {
                for (subCategoryItems in stock[category][item]) {
                    arrayOfItems.push([subCategoryItems,item,category,stock[category][item][subCategoryItems]]);
                }
            } else {
                arrayOfItems.push([item,category,stock[category][item]]);
            }
        }
    }
    return arrayOfItems;
}
