import React,{ useState } from 'react'
import './login-register.scss';

const LoginRegister = () => {
  const [loginActive,setLoginActive] = useState(true);
  const [username,setUsername] = useState('');
  const [password,setPassword] = useState('');
  const [verifyPassword,setVerifyPassword] = useState('');
  const [message,setMessage] = useState('')

  const msg = text => {
    setMessage(text);
    setTimeout(()=>setMessage(''),5000);
  }

  const Login = e => {
    e.preventDefault();
    const query = `
    query{
      Login(input:{username:"${username}",password:"${password}"}){
        success
        session
        message
      }
    }
    `
    fetch('/_graphql',{
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({query})
    })
    .then(res=>res.json())
    .then(({data})=>{
      if(data.Login.success){
        sessionStorage.setItem('session',data.Login.session)
        location.reload()
      }else{
        msg(data.Login.message);
      }
    })
  }

  const Register = e => {
    e.preventDefault();
    const query = `
    mutation{
      Register(input:{username:"${username}",password:"${password}"}){
        success
        code
        message
      }
    }
    `
    fetch('/_graphql',{
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({query})
    })
    .then(res=>res.json())
    .then(({data})=>{
      if(data.Register.success){
        msg("Registration Successful!");
        setLoginActive(true);
      }else{
        msg(data.Register.message);
      }
    })
  }

  if(loginActive){
    /* Login Form */
    return (
      <div className="login-register">
        <div className="login-register__tabs">
          <div className="login-register__tab active">Login</div>
          <div className="login-register__tab" onClick={()=>setLoginActive(false)}>Register</div>
        </div>
        <h2 className="login-register__title">Login</h2>
        <p className="text-center">{message}</p>
        <form className="login-register__form" onSubmit={Login}>
          <label className="label">Username</label>
          <input className="input" type="text" minLength="5" pattern="[A-Za-z0-9]{5,}" title="Username (5+ characters, letters and numbers only)" onChange={e=>setUsername(e.target.value)} value={username}/>
          <label className="label">Password</label>
          <input className="input" type="password" minLength="5" title="Password (5+ characters)" onChange={e=>setPassword(e.target.value)} value={password}/>
          <div className="text-center mt-2">
            <button className="btn-primary" type="submit">Login</button>
          </div>
        </form>
      </div>
    )
  }

  /* Register Form */
  return(
    <div className="login-register">
        <div className="login-register__tabs">
          <div className="login-register__tab" onClick={()=>setLoginActive(true)}>Login</div>
          <div className="login-register__tab active">Register</div>
        </div>
        <h2 className="login-register__title">Register</h2>
        <p className="text-center">{message}</p>
        <form className="login-register__form" onSubmit={Register}>
          <label className="label">Username</label>
          <input className="input" type="text" minLength="5" pattern="[A-Za-z0-9]{5,}" title="Username (5+ characters, letters and numbers only)" onChange={e=>setUsername(e.target.value)} value={username}/>
          <label className="label">Password</label>
          <input className="input" type="password" minLength="5" title="Password (5+ characters)" onChange={e=>setPassword(e.target.value)} value={password}/>
          <label className="label">Verify Password</label>
          <input className="input" type="password" minLength="5" title="Verify Password (5+ characters)" onChange={e=>setVerifyPassword(e.target.value)} value={verifyPassword}/>
          <div className="text-center">
            <button className="btn-primary" type="submit">Login</button>
          </div>
        </form>
      </div>
  )
  
}

export default LoginRegister
