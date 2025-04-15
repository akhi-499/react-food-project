import React, { useState } from "react";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
import "../register/register.css";

function Login() {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginEmailErr, setLoginEmailErr] = useState(false);
  const [loginPasswordErr, setLoginPasswordErr] = useState(false);
  const [incorrectErr, setIncorrectErr] = useState(false);
  const history = useHistory();

  async function Loginvalidation() {
    setLoginEmailErr(!loginEmail);
    setLoginPasswordErr(!loginPassword);

    if (!loginEmail || !loginPassword) return;

    try {
      const response = await axios.post("http://localhost:5000/login", {
        email: loginEmail, // ⬅ Changed "username" to "email"
        password: loginPassword,
      });

      if (response.status === 200) {
        alert("Login successful!");
        sessionStorage.setItem('user', JSON.stringify(response.data));
        history.push("/home"); // Redirect user after login
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message);
        setIncorrectErr(true);
      } else {
        alert("Server error. Please try again later.");
      }
    }
  }

  return (
    <div className="login-body">
      <div className="login-main">
        <h1>Login</h1>
        {incorrectErr && (
          <small style={{ color: "red", textAlign: "center" }}>
            Incorrect email or password
          </small>
        )}
        <br />
        <p>Email</p>
        <input
          type="text"
          value={loginEmail}
          onChange={(e) => setLoginEmail(e.target.value)}
        />
        {loginEmailErr && (
          <small style={{ color: "#d3521d" }}>Please enter your email</small>
        )}
        <br />
        <p>Password</p>
        <input
          type="password"
          value={loginPassword}
          onChange={(e) => setLoginPassword(e.target.value)}
        />
        {loginPasswordErr && (
          <small style={{ color: "#d3521d" }}>Please enter your password</small>
        )}
        <br />
        <button onClick={Loginvalidation}>Login</button>
        <br />
        <p style={{ fontSize: "15px" }}>
          Don't have an account? <Link to={"/"}>Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
