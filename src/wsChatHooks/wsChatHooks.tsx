import React, {ChangeEvent, useEffect, useRef, useState} from "react";
import './wsChatHooks.css'

export const WsChatHooks: React.FC =()=>{
    const messagesBlockRef = useRef<HTMLDivElement>()

    const [messageText, setMessageText] = useState<string>('');
    let [ws, setWS] = useState<WebSocket | null>(null);
    const [users, setUsers] = useState<any[]>([]);

    if(ws){
        ws.onmessage =(messageEvent: any)=>{
            let messages = JSON.parse(messageEvent.data)
            setUsers([...users, ...messages]);
            messagesBlockRef.current?.scrollTo(0, messagesBlockRef.current.scrollHeight)
        }
    }

    useEffect(()=>{
        let localWS = new WebSocket("wss://social-network.samuraijs.com/handlers/ChatHandler.ashx")
        setWS(localWS)
    }, [])
    const onMessageChange =(e: ChangeEvent<HTMLTextAreaElement>)=>{
        setMessageText(e.currentTarget.value)
    }
    const sendMessage=()=>{
        ws?.send(messageText)
        setMessageText('');
    }
    return(
        <div className='chatBlock'>
            <div className='chat'>
                <div className='messages'>
                    {users.map(u => <div className='message'>
                        <img src={u.photo} alt={u.userName}/><b>{u.userName}</b><span>{u.message}</span>
                    </div>)}
                </div>
                <div className='footer'>
                    <textarea onChange={onMessageChange} value={messageText} />
                    <button onClick={sendMessage}>Send</button>
                </div>
            </div>
        </div>
    )
}
