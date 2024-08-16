import React, {useState} from "react"
//import Message from "./components";
function App() {
  const[username, setUsername] = useState("")
  const[password, setPassword] = useState("")
  const loginAttempt = async(event) =>{
    event.preventDefault()
    setUsername("")
    setPassword("")
    let loginString = username + "-" + password
    fetch(`http://127.0.0.1:8000/login/${loginString}`)
    .then(response => response.json())
    .then(data => {
        if(data == "yes"){
            console.log('yes')
        }
        else{
            console.log("nope!")
        }
    });
  }

  function establishConn(username){
    var ws = new WebSocket(`ws://localhost:8000/ws/${username}`);
    console.log("established websocket connection!")
  }

  const handleUsername = (e) => {
    setUsername(e.target.value)
  }

  const handlePassword = (e) => {
    setPassword(e.target.value)
  }

  return(
    <div>
      <form onSubmit = {loginAttempt}>
        <input onChange = {handleUsername} type="text" value = {username} autoComplete="off"/>
        <input onChange = {handlePassword} type="text" value = {password} autoComplete="off"/>
        <button type = "submit">Send</button>
    </form>
    </div>
  )
}

export default App;
