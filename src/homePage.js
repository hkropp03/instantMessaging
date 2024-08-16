import {useParams, Link, useNavigate} from 'react-router-dom'
import {useState, useEffect} from "react"
import './styles.css'
function HomePage(){
    const params = useParams();
    const navigate = useNavigate();
    const user = params["username"]
    const [chatList, setChatList] = useState([])
    const [userList, setUserList] = useState([])
    useEffect(() => {
        getChats()
    }, [])
    
    const getChats = async() => {
        let response = await fetch(`http://127.0.0.1:8000/fetchChats/${user}`)
        let data = await response.json()
        console.log(data)
        setChatList(data)
        console.log(chatList)
    }

    const newChat = async(event) =>{
        try{
            var users = userList.split(" ").join('').split(',')
        }
        catch{
            console.log("no user entered")
        }
        console.log(users)
        console.log(users)
        users.push(user)
        const requestData = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({'users': users})
        }
        await fetch(`http://127.0.0.1:8000/newChat/`, requestData)
            .then(response => response.json())
            .then(data => {
                if(data !== false){
                    console.log(data)
                    navigate(`/chat/${user}/${data}`);
                }
                else{console.log("user doesn't exist")}
            })
    }

    const handleUsers = (e) => {
        setUserList(e.target.value)
      }

    return(
        <div>
            <div class = "homeDiv">
                <h1>{user}'s chats</h1>
                <input onChange = {handleUsers} type="text" value = {userList} autoComplete="off" placeholder='Enter user(s)' class = "newChat"/>
                <button onClick = {newChat} class = "newChat" >create new chat</button>
            </div>
            <ul className='chats'>
                {chatList?.map((chatID) => (
                    <Link to = {`/chat/${user}/${chatID}`}><li className="chat-number">Chat: {chatID}</li></Link>
                ))}
            </ul> 
        </div>
    )
}

export default HomePage