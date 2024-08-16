import React, {useState} from "react"
import {useNavigate, Link} from "react-router-dom"
import './styles.css'
function Login() {
    const[username, setUsername] = useState("")
    const[password, setPassword] = useState("")
    const navigate = useNavigate();
    const loginAttempt = async(event) =>{
      event.preventDefault()
      setUsername("")
      setPassword("")
      let loginString = username + "-" + password
      fetch(`http://127.0.0.1:8000/login/${loginString}`)
      .then(response => response.json())
      .then(data => {
          if(data === true){
              navigate(`/homePage/${username}`);
          }
          else{
              console.log("nope!")
          }
      });
    }
  
    const handleUsername = (e) => {
      setUsername(e.target.value)
    }
  
    const handlePassword = (e) => {
      setPassword(e.target.value)
    }
  
    return(
      <div class = 'div'>
          <form onSubmit = {loginAttempt} className = "form">
            <input class = "textColor" onChange = {handleUsername} type="text" value = {username} autoComplete="off"/>
            <input onChange = {handlePassword} type="text" value = {password} autoComplete="off"/>
            <button type = "submit">Login</button>
        </form>
        <h1 class = "centerAlign">No account? Create one here.</h1>
        <Link to = {'/createUser'} className = "centerAlign">Create an account</Link>
      </div>
    )
  }
  
  export default Login;