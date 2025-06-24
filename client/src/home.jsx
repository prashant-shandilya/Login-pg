import react from 'react'
import {useState,useEffect} from 'react'
import axios from 'axios';


function Home(){

   const [email, setEmail] = useState('');
  const [name,setName] = useState();
  const [pass,setPass] = useState();

  useEffect(() => {
    const Email = localStorage.getItem("email");
    if (Email) setEmail(Email);
  }, []);

  useEffect(() => {
    if (!email) return;
    axios.post('http://127.0.0.1:3001/getInfo', { email }, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}` // from login response
  }
})
      .then(result => {console.log(result.data);setName(result.data.name)})
      .catch(err => console.log(err));
      
    //   console.log(data);
  }, [email]);


    return(
        <div>
        <p>{`name : ${name}`}</p>
        <p>{`email : ${email}`}</p>
            </div>
    )
}

export default Home;
