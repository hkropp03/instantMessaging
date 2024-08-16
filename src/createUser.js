import React, {useState} from "react"
import {useNavigate, Link} from "react-router-dom"
import './styles.css'

function CreateUser(){

    const[username, setUsername] = useState("")
    const[password, setPassword] = useState("")
    const navigate = useNavigate();
    const loginAttempt = async(event) =>{
      event.preventDefault()
      setUsername("")
      setPassword("")
      let loginString = username + "-" + password
      fetch(`http://127.0.0.1:8000/createUser/${loginString}`)
      .then(response => response.json())
      .then(data => {
          if(data === true){
            navigate(`/homePage/${username}`);
          }
          else{
            console.log("user already exists")
          }
       })
    }

    const handleUsername = (e) => {
        setUsername(e.target.value)
    }
    
    const handlePassword = (e) => {
        setPassword(e.target.value)
    }

    return (
      <div class = 'div'>
        <form onSubmit = {loginAttempt} className = "form">
          <input onChange = {handleUsername} type="text" value = {username} autoComplete="off"/>
          <input onChange = {handlePassword} type="text" value = {password} autoComplete="off"/>
          <button type = "submit">Create</button>
        </form>
        <h1 class = "centerAlign">Have an account? Log in</h1>
        <Link to = {'/'} className = "centerAlign">Log in</Link>
      </div>
    )
}

export default CreateUser;