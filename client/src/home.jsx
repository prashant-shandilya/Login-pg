import react from 'react'
import {useState,useEffect} from 'react'
import axios from 'axios';


function Home(){

   const [email, setEmail] = useState('');
  const [name,setName] = useState();
  const [addr,setAddr] = useState([]);

  const [show, setShow] = useState(false);

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
      .then(result => {console.log(result.data);setName(result.data.name);setAddr(result.data.address)})
      .catch(err => console.log(err));
      
    //   console.log(data);
  }, [email]);


    return(
        <div>
        <p>{`name : ${name}`}</p>
        <p>{`email : ${email}`}</p><br></br>

        <div>
        <button onClick={() => setShow(!show)}>
          {show ? "Hide Address" : "Show Address"}
        </button>
        {show && <p>{`address : ${addr.join(", ")}`}</p>}
        </div>

        <div>
          <form onSubmit={e => {
            e.preventDefault();
            const newAddr = e.target.elements.address.value;
            
            // Send axios request to add the new address
            axios.post('http://127.0.0.1:3001/addAddress', 
              { 
                email: email, 
                address: newAddr 
              }, 
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`
                }
              }
            )
            .then(result => {
              console.log(result.data);
              setAddr(result.data.addresses); // Update with the new addresses array from server
              e.target.reset();
            })
            .catch(err => {
              console.log(err);
              alert('Error adding address. Please try again.');
            });
          }}>
            <input type="text" name="address" placeholder="Add new address" required />
            <button type="submit">Add Address</button>
          </form>
        </div>

        <div>

        </div>




      </div>
    )
}

export default Home;
