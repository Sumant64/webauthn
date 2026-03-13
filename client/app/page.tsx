'use client'
import { getAuthRequest, postVerifyAuthRequest } from "@/service/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { startAuthentication, startRegistration } from '@simplewebauthn/browser';
import { Alert } from "@mui/material";
import Link from "next/link";


export default function Home() {
    const router = useRouter();
  const [phone, setPhone] = useState('');
  const [alert, setAlert] = useState({ open: false, message: '' });

   const login = async () => {
    try {
      const phoneNew = phone;


      // get the challenge from the server
      const initResAuth = await getAuthRequest(phoneNew);
      
      if(!initResAuth.data) {
        throw new Error('Something went wrong');
      }
      
      const options = initResAuth.data;
      console.log(options, '==================')
      // delete options['extensions'];
      // Get passkey
      const authJSON = await startAuthentication(options);

      console.log(authJSON, 'authjson 99999999999999999999')

      // Verify passkey with the db
      const res = await postVerifyAuthRequest(authJSON);


      setAlert({ open: true, message: `Successfully logged in ${phoneNew}` });

      router.push(`/success?number=${phone}`);

    } catch (err) {
      console.log(err);
    }
  }

  const handleClose = () => {
    setAlert({ open: false, message: '' })
  };


  return (
     <div className="container">
        <h2>LOGIN</h2>

        <div className="input-group">
          <label htmlFor="numberField">Enter Your Number</label>
          <input
            type="number"
            id="numberField"
            name="numberField"
            onChange={(event) => setPhone(event.target.value)}
            placeholder="Enter your phone"
            required
          />
        </div>
        <div className="button-group">
          <button type="button" className="login-btn" onClick={login}>
            Login
          </button>
        </div>
        <div style={{marginTop: '10px'}}>
              {/* {alert === 'successfully siged up...' && <p style={{color: 'blue', fontSize: '20px'}}>Successfully siged up...</p>}
              {alert.includes('Successfully logged in') && <p style={{color: 'green', fontSize: '20px'}}>Successfully logged in {email}</p>} */}
              {alert.message && <Alert
          onClose={handleClose}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {alert.message}
        </Alert>}
            </div>
            <div>
              New User : <Link href={'/signup'}>Signup</Link>
            </div>
      </div>
  );
}
