var admin = require('firebase-admin');

var serviceAccount = require('../serviceAccountKey.json');

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
        }, (error) => {
            reject(false);
        });
        resolve(true);
    });
}

var find_user_info = function (username) {
    return new Promise(function (resolve, reject) {
        usersRef.on('value', function (snap) {
            snap.forEach(function (child) {
                let val = child.val();
                let email = val.email;
                let pass = val.password;
                let img = [];
                let key = child.key;
                if (val.img != undefined) img = val.img;
                let user_obj = {
                    username: email,
                    password: pass,
                    img: img,
                    key: key
                }
                if (username == email) resolve(user_obj);//User exists
            });
            reject(false);//User doesn't exists
        });
    });
}

module.exports = {
    login: async function (username, password) {
        let res = await find_user_info(username).catch((err) => {
            return false;
        })
        if (!res) {
            return await add_user(username, password).catch((err) => {
                return false;
            });
        } else {
            if (res.password == password) return true;
            else return false;
        }
    },
    update_user_img: async function (username, img_url) {
        let user = await find_user_info(username).catch((err) => {
            return false;
        });
        if (!user) return false;
        let images = user.img;
        if (user.img != null) images.push(img_url);
        else images = [img_url];
        let update = {
            img: images
        };

        var usersRef = ref.child('users/' + user.key);

        return new Promise(function (resolve, reject) {
            usersRef.update(update, (err) => {
                if (err) reject(false);
                else resolve(true);
            })
        });
    },
    get_user_profile: async function (username) {
        let res = await find_user_info(username).catch((err) => {
            return false;
        });
        if (!res) return false;
        let profile = {
            username: res.username,
            img: res.img
        };
        return profile;
    },
    delete_img: async function (username, img) {
        let user = await find_user_info(username).catch((err) => {
            return false;
        })

        if (!user || user.img == undefined) return false;

        let index = -1;
        for (var i in user.img) {
            if (user.img[i] == img) {
                index = i;
                break;
            }
        }
        if (index == -1) return false;

        return new Promise(function (resolve, reject) {
            ref.child('users').child(user.key).child('img').child(index).remove((err) => {
                if (err) reject(false);
                else resolve(true);
            });
        });
    }
}