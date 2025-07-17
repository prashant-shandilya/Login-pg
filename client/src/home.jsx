import react from 'react'
import {useState,useEffect} from 'react'
import axios from 'axios';


function Home(){

   const [email, setEmail] = useState('');
  const [name,setName] = useState();
  const [addr,setAddr] = useState([]);

  const [show, setShow] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [newAddressValue, setNewAddressValue] = useState('');

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
        {show && (
          <div>
            <p>{`address : ${addr.join(", ")}`}</p>
            
            {/* Update Address Section */}
            <div style={{ marginTop: '20px' }}>
              <h4>Update Address</h4>
              {addr.length > 0 ? (
                <div>
                  <select 
                    onChange={(e) => {
                      setEditingAddress(e.target.value);
                      setNewAddressValue(e.target.value);
                    }}
                    value={editingAddress || ''}
                    style={{ marginRight: '10px', padding: '5px' }}
                  >
                    <option value="">Select address to update</option>
                    {addr.map((address, index) => (
                      <option key={index} value={address}>
                        {address}
                      </option>
                    ))}
                  </select>
                  
                  {editingAddress && (
                    <div style={{ marginTop: '10px' }}>
                      <input
                        type="text"
                        value={newAddressValue}
                        onChange={(e) => setNewAddressValue(e.target.value)}
                        placeholder="Enter new address"
                        style={{ marginRight: '10px', padding: '5px' }}
                      />
                      <button 
                        onClick={() => {
                          if (newAddressValue.trim()) {
                            axios.put('http://127.0.0.1:3001/updateAddress', 
                              { 
                                email: email, 
                                oldAddress: editingAddress,
                                newAddress: newAddressValue.trim()
                              }, 
                              {
                                headers: {
                                  Authorization: `Bearer ${localStorage.getItem("token")}`
                                }
                              }
                            )
                            .then(result => {
                              console.log(result.data);
                              setAddr(result.data.addresses);
                              setEditingAddress(null);
                              setNewAddressValue('');
                              alert('Address updated successfully!');
                            })
                            .catch(err => {
                              console.log(err);
                              alert('Error updating address. Please try again.');
                            });
                          }
                        }}
                        style={{ padding: '5px 10px' }}
                      >
                        Update Address
                      </button>
                      <button 
                        onClick={() => {
                          setEditingAddress(null);
                          setNewAddressValue('');
                        }}
                        style={{ marginLeft: '10px', padding: '5px 10px' }}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <p>No addresses to update</p>
              )}
            </div>
          </div>
        )}
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
