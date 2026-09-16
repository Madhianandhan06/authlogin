import React from 'react'
import { useState } from 'react'

const App = () => {

  const [notify, setNotify] = useState('')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [signup, setSignup] = useState(null)
  const [login, setLogin] = useState(null)

  const [token, setToken] = useState('')

  async function handleSignUp(params) {
    try {
      const res = await fetch('http://localhost:3000/signup',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      })

      const data = await res.json()
      console.log(data);
      
      setNotify(`Welcome ${data.user.name}!`)
      console.log(data.token);
      
      setToken(data.token)
    } catch (error) {
      setNotify(error.message)
    }
    
  }

  function setUpSignup(){
    setLogin(null)
    setSignup(true)
  }
  function setupLogin(){
    setLogin(true)
  }
  async function handleLogin(params) {
    try {
      const res = await fetch('http://localhost:3000/login',{
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
      })

      const data = await res.json()
      console.log(data);
      
      setNotify(`Welcome ${data.user.name}!`)
    } catch (error) {
      setNotify(error.message)
    }
    
  }
  return (
    <div>
      <div>{notify}</div>
      <h2>JWT Auth</h2>

      {login ? (
        <>
      <label htmlFor="">Email</label> <br />
      <input type='email' value={email} onChange={(e) => setEmail(e.target.value)}/>
      <br /><br />
      <label htmlFor="">Password</label> <br />
      <input type='password' value={password} onChange={(e) => setPassword(e.target.value)}/>
      <br /><br />

      <button onClick={setUpSignup}>SignUp</button>
      <button>LogIn</button>
      <br /><br />
        </>
      ) : (
        <>
        <label htmlFor="">Name</label> <br />
        <input type='text' value={name} onChange={(e) => setName(e.target.value)}/>
          <br />
          <br />
        <label htmlFor="">Email</label> <br />
        <input type='email' value={email} onChange={(e) => setEmail(e.target.value)}/>
          <br />
          <br />
        <label htmlFor="">Password</label> <br />
        <input type='password' value={password} onChange={(e) => setPassword(e.target.value)}/>
          <br />
          <br />
        </>
      )}

      <div>

        {!login && <button>SignUp</button>}
        { !login && (<a style={{cursor: 'pointer'}} 
           role='button' 
           tabIndex={0} 
           onClick={setupLogin}>
          Already has account?
        </a>)
        }
      </div>
    </div>
  )
}

export default App