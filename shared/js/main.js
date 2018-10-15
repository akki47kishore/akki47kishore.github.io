let initialStock;
let itemList = [];
let slideIndex = 1;
let currentStock;

/**
 * Set currently selected link as active.
 *
 * @param choice - represents link to be set active.
 */
function changeLink(choice) {
    let options = ['dashboard', 'inbound', 'outbound'];
    if (typeof (options.find(element => element === choice)) !== 'undefined') {
        options.forEach((option) => {
            if (option === choice) {
                document.getElementById(choice).classList.add('nowactive');
                window.history.pushState(choice, `state${choice}`, `#${choice}`);
                localStorage.setItem('state', choice);
            } else {
                document.getElementById(option).classList.remove('nowactive');
            }
            return 1;
        });
    } else {
        options = ['about', 'home', 'login'];
        options.forEach((option) => {
            if (option === choice) {
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

function initialStockArrayConverter() {
    let arrayOfItems = [];
    const req = new XMLHttpRequest();
    req.open('GET', 'shared/json/initial-stock.json', false);
    req.send(null);
    const stock = JSON.parse(req.responseText).supplies;
    let subcategory ;
    itemList = Object.keys(stock);
    itemList.forEach((element) =>{
        subcategory = Object.keys(stock[element]);
        if(typeof (stock[element][subcategory[0]]) !== 'object'){
            arrayOfItems = arrayOfItems.concat(subcategory.map(x => [x,element,stock[element][x]]));
        }else {
            for(const subCategoryTypes of subcategory){
                subCategoryItems =  Object.keys(stock[element][subCategoryTypes]);
                arrayOfItems = arrayOfItems.concat(subCategoryItems.map(x => [x,subCategoryTypes,element,stock[element][subCategoryTypes][x]]));
            }
        }
    });
    console.log(arrayOfItems);
    return arrayOfItems;
}

/**
 * Initialisation on page load
 */
window.onload = function () {
    changeLink('home');
    const loginFlag = localStorage.getItem('login-flag');
    if (!loginFlag) {
        localStorage.setItem('login-flag', '0');
    }
    currentStock = JSON.parse(localStorage.getItem('currentStock'));
    router('home');
    const checkflag = localStorage.getItem('inbound');
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


const optionlinks = ['dashboard', 'inbound', 'outbound'];

function locationHashChanged() {
    const link = (location.hash).substring(1);
    if (localStorage.getItem('login-flag') === '1') {
        getFile('dashboard/html/dashboard.html', 'content');
        if (typeof (optionlinks.find(x => x === link)) !== 'undefined') {
            changeLink('home');
        }
        if (link !== 'login') {
            router(link);
        } else {
            router('dashboard');
        }
    } else if (localStorage.getItem('login-flag') === '0') {
        if (typeof (optionlinks.find(x => x === link)) !== 'undefined') {
            router('Not Found');
        } else {
            router(link);
        }
    }
}

window.onhashchange = locationHashChanged;
