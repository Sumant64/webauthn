'use client'
import { getAuthRequest, postVerifyAuthRequest } from "@/service/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { startAuthentication, startRegistration } from '@simplewebauthn/browser';
import { Alert, AlertColor } from "@mui/material";
import Link from "next/link";


export default function Home() {
  // sample commit
    const router = useRouter();
  const [phone, setPhone] = useState('');
  const [alert, setAlert] = useState<{ open: boolean; type: AlertColor; message: string }>({ open: false, type: 'info', message: '' });

   const login = async () => {
    try {
      if(phone.length !== 10) {
        return setAlert({ open: true, type: 'error', message: `Phone number should be of 10 digit` });
      }
      const phoneNew = phone;


      // get the challenge from the server
      const initResAuth = await getAuthRequest(phoneNew);
      
      // if(!initResAuth.data) {
      //   throw new Error('Something went wrong');
      // }
      
      const options = initResAuth.data;
      console.log(options, '==================')
      // delete options['extensions'];
      // Get passkey
      const authJSON = await startAuthentication(options);

      console.log(authJSON, 'authjson 99999999999999999999')

      // Verify passkey with the db
      const res = await postVerifyAuthRequest(authJSON);


      setAlert({ open: true, type: 'success', message: `Successfully logged in ${phoneNew}` });

      router.push(`/success?number=${phone}`);

    } catch (err: any) {
      console.log(err?.response?.data?.error, '00000000000error');
      if(err?.response?.data?.error === 'User does not exists') {
        setAlert({ open: true, type: 'error', message: `User doesn't exists.` });
      } else {
        setAlert({ open: true, type: 'error', message: `Something went wrong.` });
      }

    }
  }

  const handleClose = () => {
    setAlert({ open: false, type: 'info', message: '' })
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
            onChange={(event) => {
              event.target.value = event.target.value.slice(0, 10);
              setAlert({ open: false, type: 'info', message: '' });
              setPhone(event.target.value)
            }}
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
          severity={alert.type}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {alert.message}
        </Alert>}
            </div>
            <div style={{marginTop: '1rem'}}>
              <p>New User : <Link style={{textDecoration: 'underline'}} href={'/signup'}>Signup</Link></p>
            </div>
      </div>
  );
}
