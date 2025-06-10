import {useState} from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



function Forgot(){
    
    const [email,setEmail] = useState()
    const navigate = useNavigate();

        const handleSubmit=(e) =>{
          e.preventDefault();
          axios.post('http://127.0.0.1:3001/forgot',{email}).then(result=> {console.log(result)
             navigate('/login')
          })
          .catch(err => console.log(err))

        }



    return(
      <div className='top'>
         <form onSubmit={handleSubmit}>
           <div>
          <strong>Email: </strong><br/>
          <input
            type="email"
            placeholder="Enter Email"
            name="email"
             onChange={(e) => setEmail(e.target.value)}
            />
            <br/>
            <p>Here enter your e-mail.A temproray password will be sent to this e-mail.Please Enter a valid 
                E-mail.
            </p>
        </div>
         <button type="submit">Submit</button>
        </form>
      </div>
    )


}


export default Forgot;