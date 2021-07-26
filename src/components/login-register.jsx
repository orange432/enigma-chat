import React,{ useReducer } from 'react'
import './login-register.scss';

const reducer = (state,action) => {
  switch(action.type){
    case "field":
      return {
        ...state,
        [action.field]: action.value
      }
    
    case "loginActive":
      return {
        ...state,
        loginActive: true
      }
    
    case "registerActive":
      return {
        ...state,
        loginActive: false
      }
    
    default:
      break;
  }
}

const initialState = {
  username: '',
  password: '',
  verifyPassword: '',
  message: '',
  loginActive: true
}

const LoginRegister = () => {
  const [state, dispatch] = useReducer(reducer,initialState)


  const msg = text => {
    dispatch({type: "field", field: "message",value: text});
    setTimeout(()=>dispatch({type: "field", field: "message",value: ''}),5000);
  }

  const Login = e => {
    e.preventDefault();
    const query = `
    query{
      Login(input:{username:"${state.username}",password:"${state.password}"}){
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
    if(state.password!==state.verifyPassword){
      msg("Passwords do not match.")
      return '';
    }
    const query = `
    mutation{
      Register(input:{username:"${state.username}",password:"${state.password}"}){
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
        dispatch({type: "loginActive"})
      }else{
        msg(data.Register.message);
      }
    })
  }

  if(state.loginActive){
    /* Login Form */
    return (
      <div className="login-register">
        <div className="login-register__tabs">
          <div className="login-register__tab active">Login</div>
          <div className="login-register__tab" onClick={()=>dispatch({type: "registerActive"})}>Register</div>
        </div>
        <h2 className="login-register__title">Login</h2>
        <p className="text-center">{state.message}</p>
        <form className="login-register__form" onSubmit={Login}>
          <label className="label">Username</label>
          <input className="input" type="text" minLength="5" pattern="[A-Za-z0-9]{5,}" title="Username (5+ characters, letters and numbers only)" onChange={e=>dispatch({type: "field",value: e.target.value,field: "username"})} value={state.username}/>
          <label className="label">Password</label>
          <input className="input" type="password" minLength="5" title="Password (5+ characters)" onChange={e=>dispatch({type: "field",value: e.target.value,field: "password"})} value={state.password}/>
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
          <div className="login-register__tab" onClick={()=>dispatch({type: "loginActive"})}>Login</div>
          <div className="login-register__tab active">Register</div>
        </div>
        <h2 className="login-register__title">Register</h2>
        <p className="text-center">{state.message}</p>
        <form className="login-register__form" onSubmit={Register}>
          <label className="label">Username</label>
          <input className="input" type="text" minLength="5" pattern="[A-Za-z0-9]{5,}" title="Username (5+ characters, letters and numbers only)" onChange={e=>dispatch({action: "field",value: e.target.value,field: "username"})} value={state.username}/>
          <label className="label">Password</label>
          <input className="input" type="password" minLength="5" title="Password (5+ characters)" onChange={e=>dispatch({action: "field",value: e.target.value,field: "password"})} value={state.password}/>
          <label className="label">Verify Password</label>
          <input className="input" type="password" minLength="5" title="Verify Password (5+ characters)" onChange={e=>dispatch({action: "field",value: e.target.value,field: "verifyPassword"})} value={state.verifyPassword}/>
          <div className="text-center">
            <button className="btn-primary" type="submit">Login</button>
          </div>
        </form>
      </div>
  )
  
}

export default LoginRegister
