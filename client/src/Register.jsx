import React from 'react';
import { Link } from 'react-router-dom';
import {useState} from "react";
import axios from 'axios';
import './App.css'
import { useNavigate } from 'react-router-dom';

 function Register(){

    const [name,setName] = useState()
    const [email,setEmail] = useState()
    const [password,setPassword] = useState() 
    const navigate = useNavigate();

    const handleSubmit=(e) =>{
      e.preventDefault();
// console.log(name,email,password);
      axios.post('http://127.0.0.1:3001/register',{name,email,password}).then(result=> {console.log(result)
          navigate('/login')
      })
      .catch(err => console.log(err))
    }

    return (
      <div className='top'>
        <div className='second'>
        <form onSubmit={handleSubmit}>
        <div>
          <strong>Name: </strong><br/>
          <input 
            type = "text"
            placeholder = "Enter Name"
            name="name"
            onChange={(e) => setName(e.target.value)}
            />

        </div>
        <div>
          <strong>Email: </strong><br/>
          <input
            type="email"
            placeholder="Enter Email"
            name="email"
             onChange={(e) => setEmail(e.target.value)}
            />
            
        </div>
        <div>
          <strong>Password: </strong><br/>
          <input
            type="password"
             placeholder="Enter Password"
             name="password"
              onChange={(e) => setPassword(e.target.value)}
            />
        </div>
      <button type="submit" style={{color:'white'}}>Register</button>
       </form>
       <div >
      <p>Already have an account</p>
      <button style={{backgroundColor:'#4169e1'}}><Link to="/login" style={{color:'white'}}>Login</Link></button>
        </div>
      </div>
       

      </div>
    );
}

export default Register;