import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom"; // ✅ Correct for React Router v5
import "../register/register.css";

function Register() {
  const history = useHistory(); // ✅ Correct hook for v5
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nameErr, setNameErr] = useState(false);
  const [emailErr, setEmailErr] = useState(false);
  const [passwordErr, setPasswordErr] = useState(false);
  const [serverErr, setServerErr] = useState(""); // Store server-side error messages

  async function register() {
    setNameErr(!username);
    setEmailErr(!/^\S+@\S+\.\S+$/.test(email)); // Better email validation
    setPasswordErr(password.length < 5);

    if (!username || !email || !password) return;

    try {
      const response = await axios.post("http://localhost:5000/register", {
        username,
        email,
        password,
      });

      if (response.status === 201) {
        alert("Registration successful!");
        history.push("/login"); // ✅ Correct for React Router v5
      }
    } catch (error) {
      setServerErr(error.response?.data?.message || "Registration failed");
    }
  }

  return (
    <div className="register-body">
      <div className="register-main">
        <h1>Register Form</h1>
        {serverErr && <p className="errP" style={{ color: "red" }}>{serverErr}</p>}

        <p>Name</p>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        {nameErr && <small style={{ color: "red" }}>Please enter your name</small>}
        <br />

        <p>Email</p>
        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
        {emailErr && <small style={{ color: "red" }}>Please enter a valid email</small>}
        <br />

        <p>Password</p>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {passwordErr && <small style={{ color: "red" }}>Password must be at least 5 characters</small>}
        <br />

        <button onClick={register}>Register</button>
        <br />
        <button onClick={() => history.push("/login")} style={{ background: "transparent", color: "#3498db", border: "2px solid #3498db" }}>Already have an account? Login</button>
      </div>
    </div>
  );
}

export default Register;
