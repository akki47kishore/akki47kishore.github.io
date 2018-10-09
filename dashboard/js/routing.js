const routes = [{
        name: 'dashboard',
        path: 'dashboard/html/graph.html',
        script: 'dashboard/js/graph.js'
    },
    {
        name: 'inbound',
        path: 'inbound/html/inbound.html',
        script: 'inbound/js/inbound.js'

    },
    {
        name: 'outbound',
        path: 'outbound/html/outbound.html',
        script: 'outbound/js/outbound.js'
    },
    {
        name: 'home',
        path: 'shared/html/main.html',
        script: ''
    },
    {
        name: 'about',
        path: 'about/html/about.html',
        script: ''
    },
    {
        name: 'login',
        path: 'login/html/login.html',
        script: ''
    }

];

/**
 * Routing function that displays the corresponding view for a given route. 
 * @param  routeName - specifies the route selected.
 */
function router(routeName) {
    let route = routes.find(x => x.name === routeName);
    if (typeof (route) != 'undefined') {
        changeLink(route.name);
        if (route.script != '') {
            let parent = document.getElementById('JSscripts');
            let child = document.createElement('script');
            child.src = route.script;
            parent.innerHTML = '';
            parent.appendChild(child);
            child.onload = function () {
                getFile(route.path, 'dashboard-container');
                if (route.name == 'dashboard') {
                    drawGraphs();
                } else {
                    let tablename, stockData;
                    stockData = JSON.parse(localStorage.getItem(route.name));
                    tablename = `#${route.name}-table`;
                    if (stockData && stockData.length > 0) {
                        let dataSet = [];
                        let x;
                        stockData.forEach((element, index) => {
                            x = JSON.parse(localStorage.getItem(element));
                            dataSet.push([index + 1, sentenceCase(x.name), x.date]);
                        });
                        let table = $(tablename).DataTable({
                            ordering: true,
                            searching: true,
                            data: dataSet,
                            scrollY: 300,
                            colReorder: true,
                            responsive: true,
                            columns: [{
                                    title: 'No.'
                                },
                                {
                                    title: 'Name'
                                },
                                {
                                    title: 'Date'
                                }
                            ]
                        });
                        table.on('click', 'tr', function () {
                            let id = table.row(this).data();
                            if (id) {
                                id = id[0] - 1;
                                showDetails(route.name, id);
                            }
                        });
                        table.page.len(10).draw();
                        let selectbox = document.getElementsByName(`${route.name}-table_length`);
                        selectbox = selectbox[0];
                        selectbox.classList.add('pagination-option');
                    }
                }
            }
        } else if (route.name == 'about') {
            getFile(route.path, 'content');

        } else if (route.name == 'login') {
            const loginFlag = localStorage.getItem('login-flag');
            if (loginFlag === '1') {
                localStorage.setItem('login-flag', '0');
                document.getElementById('login').innerHTML = '<b>Login</b>';
            }
            getFile(route.path, 'content');

        } else if (route.name == 'home') {
            const loginFlag = localStorage.getItem('login-flag');
            if (loginFlag === '0') {
                getFile(route.path, 'content');
            } else {
                changeDashboard();
            }
        }
    } else {
        document.getElementById('content').innerHTML = `<img src ='assets/404-Page.png' class='page-not-found'></img>`;
    }
}

/**
 * Display Current Stock modal.
 */
function changeToCurrentStock() {
    showDetails('stock-details');
}
