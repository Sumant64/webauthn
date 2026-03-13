"use client";
import { Alert } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { startRegistration } from "@simplewebauthn/browser";
import { postVerifyRegisterRequest, putRegisterRequest } from "@/service/auth";
import Link from "next/link";

const Signup = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [alert, setAlert] = useState({ open: false, message: "" });

  const signup = async () => {
    try {
      let payload = {
        email: email,
        phone: phone,
        name: name,
      };

      // get challenge from the server
      const initResponseRes = await putRegisterRequest(payload);
      const initResponseData = initResponseRes.data;

      const options = initResponseData;

      // create passkey
      const registrationJSON = await startRegistration(options);

      // save passkey in DB
      const verifyResponse = await postVerifyRegisterRequest(registrationJSON);

      setAlert({ open: true, message: "successfully siged up..." });
    } catch (err) {
      console.log(err);
    }
  };

  const handleClose = () => {
    setAlert({ open: false, message: "" });
  };

  return (
    <div className="container">
      <h2>SIGNUP</h2>

      <div className="input-group">
        <div>
          <label htmlFor="nameField">Enter Your Name</label>
          <input
            type="text"
            id="nameField"
            name="nameField"
            onChange={(event) => setName(event.target.value)}
            placeholder="Enter your name"
            required
          />
        </div>
        <div style={{marginTop: '10px'}}>
          <label htmlFor="numberField">Enter Your Phone</label>
          <input
            type="number"
            id="numberField"
            name="numberField"
            onChange={(event) => setPhone(event.target.value)}
            placeholder="Enter your phone"
            required
          />
        </div>
        <div style={{marginTop: '10px'}}>
          <label htmlFor="emailField">Enter Your Email</label>
          <input
            type="email"
            id="emailField"
            name="emailField"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
      </div>
      <div className="button-group">
        <button type="button" className="login-btn" onClick={signup}>
          Signup
        </button>
      </div>
      <div style={{ marginTop: "10px" }}>
        {alert.message && (
          <Alert
            onClose={handleClose}
            severity="success"
            variant="filled"
            sx={{ width: "100%" }}
          >
            {alert.message}
          </Alert>
        )}
      </div>
      <div>
        <p>
          Already a user : <Link href={"/signup"}>Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
