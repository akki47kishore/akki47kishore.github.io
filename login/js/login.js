/**
 * Change the view to dashboard.
 */
function changeDashboard() {
    localStorage.setItem('login-flag', '1');
    localStorage.setItem('counter', '0');
    document.getElementById('login').innerHTML = '<b>Logout</b>';
    getFile('dashboard/html/dashboard.html', 'content');
    router('dashboard');
}

/**
 * Performs validation on submition of login form.
 */
function validator() {
    const username = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    let flag = [];
    if (username !== '' && pass !== '') {
        fetch('login/json/login.json')
            .then(response => response.json())
            .then((data) => {
                flag = data.users.filter(user => (user.name === username && user.password === pass));
                if (flag.length === 1) {
                    changeLink('home');
                    changeDashboard();
                } else {
                    document.getElementById('message').innerHTML = '*Invalid username or password';
                    document.getElementById('username').style.background = '#fff000';
                    document.getElementById('password').style.background = '#fff000';
                }
            }).catch(err => console.error(err));
    } else {
        if (username === '') {
            document.getElementById('message').innerHTML = '*Username cannot be Empty';
            document.getElementById('username').style.background = '#fff000';
        } else {
            document.getElementById('message').innerHTML = '*Password cannot be Empty';
            document.getElementById('password').style.background = '#fff000';
        }
        return false;
    }
}

/**
 * Trigger validation on pressing enter in password field.
 * @param e - key up event.
 */
function checkSubmit(e) {
    const code = (e.keyCode ? e.keyCode : e.which);
    if (code === 13) { // keycode for 'Enter'
        validator();
    }
}
