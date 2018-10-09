/**
 * Trigger validation on pressing enter in password field.
 * 
 * @param e - key up event. 
 */
function checkSubmit(e) {
    let code = (e.keyCode ? e.keyCode : e.which);
    if (code == 13) {                               //keycode for 'Enter'
        validator();
    }
}

/**
 * Performs validation on submition of login form.
 */
function validator() {
    let username = document.getElementById('username').value;
    let pass = document.getElementById('password').value;
    let flag = false;
    if (username != '' && pass != '') {
        fetch('login/json/login.json')
            .then(response => response.json())
            .then((data) => {
                for (user of data.users) {
                    if (user.name == username && user.password == pass) {
                        flag = true; 
                        break;                        
                    }
                }
                if  (flag) {
                    changeLink('home');
                    changeDashboard();
                } else {
                    document.getElementById('message').innerHTML =  '*Invalid username or password';
                    document.getElementById('username').style.background = '#fff000';
                    document.getElementById('password').style.background = '#fff000';
                }
            }).catch(err => console.error(err));

    } else {

        if (username == '') {
            document.getElementById('message').innerHTML =  '*Username cannot be Empty';
            document.getElementById('username').style.background = '#fff000';
        } else {
            document.getElementById('message').innerHTML =  '*Password cannot be Empty';
            document.getElementById('password').style.background = '#fff000';
        }
        return false;
    }
}

/**
 * Change the view to dashboard.
 */
function changeDashboard(){
    localStorage.setItem('login-flag', '1');
    localStorage.setItem('counter', '0');
    document.getElementById('login').innerHTML = '<b>Logout</b>';
    getFile('dashboard/html/dashboard.html','content');
    router('dashboard');
}
