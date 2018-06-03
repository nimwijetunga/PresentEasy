var admin = require('firebase-admin');

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://presenteasy-1527999938845.firebaseio.com"
});

var ref = admin.app().database().ref();
var usersRef = ref.child('users');
var userRef = usersRef.push();

var add_user = function (username, password) {
    return new Promise(function (resolve, reject) {
        usersRef.push({
            email: username,
            password: password
        });
        resolve(true);
    });
}

var user_exists = function (username, password) {
    return new Promise(function (resolve, reject) {
        let exists = false;
        usersRef.on('value', function (snap) {
            snap.forEach(function (child) {
                let val = child.val();
                let email = val.email;
                let pass = val.password;
                if (username == email) resolve(pass);//User exists
            });
            resolve(false);//User doesn't exists
        });
    });
}

module.exports = {
    login: async function (username, password) {
        let res = await user_exists(username, password);
        if (!res) {
            return await add_user(username, password);
        } else {
            if (res == password) return true;
            else return false;
        }
    }
}