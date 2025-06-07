import React from 'react';
import { Link } from 'react-router-dom';
import {useState} from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login(){

    const [email,setEmail] = useState()
        const [password,setPassword] = useState() 
    const[msg,setMsg] = useState("The password is incorrect");
        const navigate = useNavigate();
    const[flg,setFlg] = useState(false);

     const handleSubmit=(e) =>{
      e.preventDefault();
// console.log(name,email,password);
      axios.post('http://127.0.0.1:3001/login',{email,password}).then(result=> {console.log(result)
            if(result.data === 'Success')
                        navigate('/home')
            else if (result.data === "navigate to setPswrd"){localStorage.setItem("email",email);navigate('/setPswrd')}
            else if (result.data === "the password is incorrect")setFlg(true);

      })
      .catch(err => console.log(err))
    }

return (

    <div>
        <form onSubmit={handleSubmit}>
        <div>
          <strong>Email: </strong>
          <input
            type="email"
            placeholder="Enter Email"
            name="email"
             onChange={(e) => setEmail(e.target.value)}
            />
        </div>
        <div>
          <strong>Password: </strong>
          <input
            type="password"
             placeholder="Enter Password"
             name="password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <p style={{color:'red',fontSize:'20px'}}>{flg&&msg}</p>
        </div>
      <button type="submit">Login</button>
       </form>
       <Link to="/forgot">Forgot password </Link>
       </div>
    
);

}

export default Login;