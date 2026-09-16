import { useState } from 'react'

const App = () => {
  const apiUrl = import.meta.env.VITE_API_URL || ''

  const [notify, setNotify] = useState('')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [login, setLogin] = useState(null)

  async function handleSignUp() {
    try {
      const res = await fetch(`${apiUrl}/signup`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      setNotify(`Welcome ${data.user.name}!`)
    } catch (error) {
      setNotify(error.message)
    }
    
  }

  function setUpSignup(){
    setLogin(null)
  }
  function setupLogin(){
    setLogin(true)
  }
  async function handleLogin() {
    try {
      const res = await fetch(`${apiUrl}/login`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
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
      <button onClick={handleLogin}>LogIn</button>
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

        {!login && <button onClick={handleSignUp}>SignUp</button>}
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