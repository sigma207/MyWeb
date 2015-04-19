/**
 * Created by user on 2015/4/1.
 */

function InfoObj(name,value){
    this.name = name;
    this.value = value;
}

function BrowserInformation(){
    this.infoList = new Array();
    this.infoObj = function(name,value){
        this.name = name;
        this.value = value;
    };
    this.getInfoObj = function (name,value) {
        return new InfoObj(name,value);
    };
    this.collectInformation = function(){
        this.infoList.push(this.getInfoObj("language",window.navigator.userLanguage || window.navigator.language));
        this.infoList.push(this.getInfoObj("userAgent",window.navigator.userAgent));
        this.infoList.push(this.getInfoObj("onLine ",window.navigator.onLine));
        return this.infoList;
        //this.infoList.push(this.getInfoObj("onLine ",browser.version));
    };
}