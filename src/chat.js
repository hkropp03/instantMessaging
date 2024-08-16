import {useParams} from 'react-router-dom'
import {useState, useEffect} from "react"
import './styles.css'

function Chat(){
    const params = useParams();
    const userName = params["user"]
    const id = params["chatID"]
    const [messageList, setMessageList] = useState([])
    const [newMessage, setNewMessage] = useState([])
    const [newString, setNewString] = useState('')
    const [ws, setWS] = useState({})
    
    useEffect(() => {
        getMessages()
        const ws = new WebSocket(`ws://localhost:8000/ws/${userName}`)
        setWS(ws)
        if(ws){
            ws.onopen = (event) =>{
                console.log('websocket opened')
            }
        }
    }, [])

    ws.onmessage = (event) =>{
        const jsonOb = JSON.parse(event.data)
        if(jsonOb.chatID === id){
            const message = `${jsonOb.fromUser}: ${jsonOb.message}`
            setNewMessage([...newMessage, message]) 
        }
    }

    const getMessages = async() => {
        console.log(id)
        let response = await fetch(`http://127.0.0.1:8000/fetchHist/${id}`)
        let data = await response.json()
        console.log(data)
        setMessageList(data)
        console.log(messageList)
    }

    const pushMessage = async() => {
        const requestData = JSON.stringify({'message': newString, 'chatID': id, 'sender': userName})
        ws.send(requestData)
    }

    return(
        <>
            <h1>Chat {id}</h1>
            <input value = {newString} 
            onChange = {e => setNewString(e.target.value)}
            />
            <button onClick = {() => {
                setNewMessage([...newMessage, `${userName}: ${newString}`]);
                pushMessage()
            }}>Send</button>
            <ul>
                {messageList?.map((message) => (
                    <li className="messageLog">{message}</li>
                ))}
                {newMessage.map(newMessage => (
                <li>{newMessage}</li>
                ))}
            </ul> 
        </>
    )
}

export default Chat;