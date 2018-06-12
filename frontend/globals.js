class Global {
    
    constructor(){
        this._env = this._getEnv();
        this._path = "";
        this._server = "";
        if(this._env == "DEV"){
            this._server = "http://localhost:80";
            this._path = "file:///C:/Users/Nim%20Wijetunga/Documents/PresentEasy/frontend";
        }else{
            this._path = "https://presenteasy.herokuapp.com";
            this._server = this._path;
        }
        console.log(this._path);
    }


    _getEnv(){
        if(window.location.href.indexOf("heroku") !== -1)return "PROD";
        return "DEV";
    }

    _getPath(file){
        return this._path + file; 
    }

    _redirect(){
        if(document.cookie != "" && $.cookie().username != "null")return;
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
