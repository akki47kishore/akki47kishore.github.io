/**
 * Toggles the slide(graph) to be shown.
 * @param  n - slide number.
 */
function showSlides(n) {
    let i;
    const slides = document.getElementsByClassName('slides');
    const dots = document.getElementsByClassName('dot');
    if (slides && slides.length > 0) {
        if (n > slides.length) {
            slideIndex = 1;
        }
        if (n < 1) {
            slideIndex = slides.length;
        }
        for (i = 0; i < slides.length; i += 1) {
            slides[i].style.display = 'none';
        }
        for (i = 0; i < dots.length; i += 1) {
            dots[i].className = dots[i].className.replace(' active', '');
        }
        slides[slideIndex - 1].style.display = 'block';
        dots[slideIndex - 1].className += ' active';
    }
}

// Next/previous controls
function plusSlides(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}
/**
 * This function takes the an array of objects of type "inbound" or "outbound" and returns an array
 of the form [[item,categorySum]]
 * @param  arrayName  - array passed.
 */
function findSum(arrayName) {
    const array = JSON.parse(localStorage.getItem(arrayName));
    const data = [];
    array.forEach((element) => {
        data.push(JSON.parse(localStorage.getItem(element)));
    });
    const stock = [];
    const curStock = JSON.parse(localStorage.getItem('currentStock'));
    for (const item in curStock) {
        stock.push(data.map((data => data.supplies[item])));
    }
    let categorySum = 0;
    let flag = 0;
    const rows = [];
    let i = 0;
    for (const itemCategory of stock) {
        for (const items of itemCategory) {
            for (const value in items) {
                if (typeof (items[value]) === 'object') {
                    categorySum += (Object.values(items[value])).reduce(arraySum);
                } else {
                    flag = 1;
                    break;
                }
            }
            if (flag === 1) {
                categorySum += (Object.values(items)).reduce(arraySum);
            }
        }
        flag = 0;
        rows.push([itemList[i], categorySum]);
        i += 1;
        categorySum = 0;
    }
    return rows;
}

function drawChartCurrent() {
    const data = new google.visualization.DataTable();
    data.addColumn('string', 'Item');
    data.addColumn('number', 'Percentage');
    const req = new XMLHttpRequest();
    req.open('GET', 'shared/json/initial-stock.json', false);
    req.send(null);
    const initialStock = JSON.parse(req.responseText).supplies;
    let inboundSum = [0, 0, 0, 0];
    let outboundSum = [0, 0, 0, 0];
    const incoming = JSON.parse(localStorage.getItem('inbound'));
    const outgoing = JSON.parse(localStorage.getItem('outbound'));
    if (incoming && incoming.length > 0) {
        inboundSum = findSum('inbound').map(x => x[1]);
    }
    if (outgoing && outgoing.length > 0) {
        outboundSum = findSum('outbound').map(x => x[1]);
    }
    const initialSum = [];
    let subCategorySum = 0;
    let flag = 0;
    for (const itemCategory in initialStock) {
        for (const itemsubCategory in initialStock[itemCategory]) {
            if (typeof (initialStock[itemCategory][itemsubCategory]) === 'object') {
                subCategorySum += (Object.values(initialStock[itemCategory][itemsubCategory])).reduce(arraySum);
            } else {
                flag = 1;
                break;
            }
        }
        if (flag === 0) {
            initialSum.push(subCategorySum);
            subCategorySum = 0;
        } else if (flag === 1) {
            initialSum.push((Object.values(initialStock[itemCategory])).reduce(arraySum));
        }
        flag = 0;
    }
    let rows = [];
    rows = itemList.map((value, index) => [value, initialSum[index] + inboundSum[index] - outboundSum[index], ]);
    data.addRows(rows);
    // Set chart options
    const options = {
        title: 'CURRENT STOCK',
        width: 950,
        height: 600,
        pieHole: 0.3,
        pieSliceText: 'value',
        pieSliceTextStyle: {
            color: 'black'
        },
        backgroundColor: 'transparent'
    };

    // Instantiate and draw the chart.
    const chart = new google.visualization.PieChart(document.getElementById('current'));
    chart.draw(data, options);
}

function drawChartInbound() {
    const incoming = JSON.parse(localStorage.getItem('inbound'));
    if (incoming && incoming.length > 0) {
        const data = new google.visualization.DataTable();
        data.addColumn('string', 'Inbound');
        data.addColumn('number', 'Percentage');
        const rows = findSum('inbound');

        data.addRows(rows);

        const options = {
            title: 'INBOUND',
            width: 950,
            height: 600,
            pieSliceText: 'value',
            backgroundColor: 'transparent',
            pieSliceTextStyle: {
                color: 'black'
            },
            pieHole: 0.3

        };
        const chart = new google.visualization.PieChart(document.getElementById('inbound-slide'));
        chart.draw(data, options);
    }
}

function drawChartOutbound() {
    const outgoing = JSON.parse(localStorage.getItem('outbound'));
    if (outgoing && outgoing.length > 0) {
        const data = new google.visualization.DataTable();
        data.addColumn('string', 'Outbound');
        data.addColumn('number', 'Percentage');
        const rows = findSum('outbound');
        data.addRows(rows);

        const options = {
            title: 'OUTBOUND',
            width: 950,
            height: 600,
            pieSliceText: 'value',
            backgroundColor: 'transparent',
            pieSliceTextStyle: {
                color: 'black'
            },
            pieHole: 0.3

        };
        const chart = new google.visualization.PieChart(document.getElementById('outbound-slide'));
        chart.draw(data, options);
    }
}

function drawCharts() {
    drawChartCurrent();
    drawChartInbound();
    drawChartOutbound();
}

function drawGraphs() {
    google.charts.load('current', {
        packages: ['corechart']
    });
    google.charts.setOnLoadCallback(drawCharts);
    showSlides(1);
}
