import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Css/AdminLogin.css";
import axios from "axios";
function AdminLogin() {
  const navigate = useNavigate();
  const [isLoginFormSubmitted, setIsLoginFormSubmited] = useState(false);
  const [loginData, setLoginData] = useState({ name: "", password: "" });
  const [isLoginValidated, setIsLoginValidated] = useState(false);
  const [loginFormError, setLoginFormError] = useState({});
  const [formLoading, setFormLoading] = useState(false);
  const handleLoginForm = (e) => {
    e.preventDefault();
    setIsLoginValidated(false);
    setLoginFormError({});
    setLoginData({ name: e.target[0].value, password: e.target[1].value });
    setIsLoginFormSubmited(true);
  };
  const loginFormValidater = () => {
    const error = {};
    if (!loginData.name) {
      error.userNameError = "UserName Required";
    }
    if (!loginData.password) {
      error.passwordError = "Password Required";
    }
    setLoginFormError(error);
    return true;
  };
  useEffect(() => {
    if (isLoginFormSubmitted) {
      setIsLoginValidated(loginFormValidater());
      setIsLoginFormSubmited(false);
    }
  }, [isLoginFormSubmitted]);
  useEffect(() => {
    if (isLoginValidated && Object.keys(loginFormError).length === 0) {
      (async () => {
        try {
          setFormLoading(true);
          const loginResult = await axios.post(
            "http://localhost:9000/client/auth",
            loginData
          );
          if (loginResult.data?.status) {
            navigate("/", {
              state: {
                auth: true,
                admin: loginResult.data?.admin,
                reduction: loginResult.data?.reduction,
              },
            });
          } else {
            setLoginFormError({ serverError: loginResult.data?.message });
          }
        } catch (error) {
          console.log(error);
        } finally {
          setFormLoading(false);
        }
      })();
    }
  }, [isLoginValidated]);
  return (
    <>
      <div className="login-container">
        <form onSubmit={handleLoginForm}>
          <div className="heading-sec">
            <h1>Admin Login</h1>
          </div>
          <p>{loginFormError?.userNameError}</p>
          <input type="text" placeholder="UserName.." />
          <p>{loginFormError?.passwordError}</p>
          <label>
            <input type="text" placeholder="Password" />
            <button>see</button>
          </label>
          <p>{loginFormError.serverError}</p>
          <button type="submit">Login</button>
        </form>
      </div>
    </>
  );
}

export default AdminLogin;
