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
          <strong>Name: </strong>
          <input 
            type = "text"
            placeholder = "Enter Name"
            name="name"
            onChange={(e) => setName(e.target.value)}
            />

        </div>
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
        </div>
      <button type="submit">Register</button>
       </form>
      <p>Already have an account</p>
      <Link to="/login" className='link'>Login</Link>

      </div>
       

      </div>
    );
}

export default Register;