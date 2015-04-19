/**
 * 此程式只負責處理連線控制
 * 下面三種資料會以Event dispatch出去，需自行監聽需要的Event
 * 	1.從Server端傳來的data
 * 	2.當前的狀態變動(readyState)
 * 	3.其它資訊的log
 */
function WebSocketManager(host){
	this.webSocket;
	this.host = host;
	var wsm = this;
	/**
	 * 從Server端傳來的data
	 */
	this.handleData = function(data){
		var evt = new Event("WebSocketDataEvent");
		evt.data = data;
		document.dispatchEvent(evt);
	}
	/**
	 * 當前的狀態變動(readyState)
	 */
	this.dispatchState = function(){
		var evt = new Event("WebSocketStateEvent");
		evt.readyState = wsm.webSocket.readyState;
		document.dispatchEvent(evt);
	}
	/**
	 * 其它資訊的log
	 */
	this.addLog = function(msg){
		var evt = new Event("WebSocketLogEvent");
		console.log(msg);
		evt.msg = msg;
		document.dispatchEvent(evt);
	}
	
	this.connect = function(){
		if(typeof(wsm.host)!="undefined"){
			try{
				wsm.webSocket = new WebSocket(wsm.host);
				wsm.dispatchState();//還未連線(readyState=0)
				wsm.webSocket.addEventListener("open",wsm.onOpen,false);
				wsm.webSocket.addEventListener("message",wsm.onMessage,false);
				wsm.webSocket.addEventListener("close",wsm.onClose,false);
				wsm.webSocket.addEventListener("error",wsm.onError,false);
			}catch(exception){
				wsm.addLog(exception);
			}
		}else{
			alert("host is undefined!");
		}
	}
	
	this.onOpen = function(evt){
		wsm.dispatchState();//連線成功(readyState=1)
	}
	
	this.onClose = function(evt){
		wsm.dispatchState();//連線已關閉(readyState=3)
		wsm.addLog("close code="+evt.code+",reason="+evt.reason);
	}
	
	this.onError = function(evt){
		wsm.addLog("Error:"+evt);
	}
	
	this.onMessage = function(evt){
		wsm.handleData(evt.data);
	}
	
	this.send = function(data){
		try{
			wsm.webSocket.send(data);
		}catch(Exception){
			wsm.addLog(exception);
		}
	}
	
	this.close = function(evt){
		wsm.addLog("User closes");
		try{
			wsm.webSocket.close(1000,"使用者手動關閉連線");
			wsm.dispatchState();//連線關閉中(readyState=2)
		}catch(Exception){
			wsm.addLog(exception);
		}
	}
}
