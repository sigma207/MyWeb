package com.sigma.ws;

import java.io.IOException;
import java.util.Set;
import java.util.concurrent.CopyOnWriteArraySet;
import java.util.concurrent.atomic.AtomicInteger;

import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

@ServerEndpoint(value="/chat")
public class ChatEntPoint {
    private static final String GUEST_PREFIX = "訪客";
    private static final AtomicInteger connectionIds = new AtomicInteger(0);
    private static final Set<ChatEntPoint> clientSet = new CopyOnWriteArraySet<ChatEntPoint>();
    private final String nickName;
    private Session session;
    public ChatEntPoint() {
        System.out.println(toString()+"初始化!");
        nickName = GUEST_PREFIX+connectionIds.getAndIncrement();
    }

    @OnOpen
    public void start(Session session){
        this.session = session;
        clientSet.add(this);
        String message = String.format("[%s %s]", nickName,"加入了AA聊天室!");
        broadcast(message);
    }

    @OnClose
    public void end(){
        clientSet.remove(this);
        String message = String.format("[%s %s]", nickName,"離開了AA聊天室!");
        broadcast(message);
    }

    @OnMessage
    public void incoming(String message){
        String filteredMessage = String.format("%s: %s", nickName,filter(message));
        broadcast(filteredMessage);
    }

    @OnError
    public void OnError(Throwable t) throws Throwable{
        System.out.println("WebSocket服務端錯誤:"+t);
    }

    private static void broadcast(String msg) {
        System.out.println(msg);
        for(ChatEntPoint client:clientSet){
            try{
                synchronized (client) {
                    client.session.getBasicRemote().sendText(msg);
                    System.out.println("向客戶"+client+"發送消息完成");
                }
            }catch(IOException e){
                System.out.println("向客戶"+client+"發送消息出錯");
                clientSet.remove(client);
                try{
                    client.session.close();
                }catch(IOException e1){}
                String message = String.format("[%s %s]", client.nickName,"已經被斷開連接");
                broadcast(message);
            }
        }

    }

    private static String filter(String message) {
        if(message==null)return null;
        char[] content = new char[message.length()];
        message.getChars(0, message.length(), content, 0);
        StringBuilder result = new StringBuilder(content.length+50);
        for (int i = 0; i < content.length; i++) {
            switch(content[i]){
                case '<':
                    result.append("&lt;");
                    break;
                case '>':
                    result.append("&gt;");
                    break;
                case '&':
                    result.append("&amp;");
                    break;
                case '"':
                    result.append("&quot;");
                    break;
                default:
                    result.append(content[i]);
                    break;
            }
        }
        return result.toString();
    }


}
