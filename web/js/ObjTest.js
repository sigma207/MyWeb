/**
 * 
 */


function MyObj(name){
	this.name = name;
	this.id = "AAADDD";
	var obj = this;
	this.hello = function(){
		alert("hi,i am "+this.name);
	}
}
MyObj.prototype.updateName = function(newName){
	this.name = newName;
}
MyObj.prototype.say = function(){
	alert(this.name);
}