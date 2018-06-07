// var PATH = "file:///C:/Users/Nim%20Wijetunga/Documents/PresentEasy/frontend"

class Global {
    
    constructor(){
        this._path = "file:///C:/Users/Nim%20Wijetunga/Documents/PresentEasy/frontend";
    }

    _getPath(file){
        return this._path + file; 
    }

    _redirect(){
        if(document.cookie != "" && $.cookie().username != "null")return;
        console.log("Here");
        let loc = window.location.href;
        if(loc.indexOf("index.html") == -1){
            window.location.href = this._path + "/index.html";
        }
    
    }
    
}

let global = new Global();

$(document).ready(function (e) {
    global._redirect();
});
