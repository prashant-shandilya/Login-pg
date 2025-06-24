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
    const [link,setLink] = useState();
    const navigate = useNavigate();

    const handleClick = async (e) => {
      e.preventDefault();
      
     await axios.get('http://127.0.0.1:3001/outh_page').then(url => setLink(url.data))

      window.open(link);

      };

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
      <button onClick={handleClick}>
          Signup with Google
          <img src="https://img.icons8.com/color/48/000000/google-logo.png" alt="google logo" style={{width:'20px',height:'20px'}}/>
        </button>
       <div >
      <p>Already have an account</p>
      <button style={{backgroundColor:'#4169e1'}}><Link to="/login" style={{color:'white'}}>Login</Link></button>
        </div>
      </div>
       

      </div>
    );
}

export default Register;
