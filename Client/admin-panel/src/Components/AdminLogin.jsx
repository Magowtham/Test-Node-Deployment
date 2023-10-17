import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Css/AdminLogin.css";

function AdminLogin() {
  const navigate = useNavigate();
  const [isLoginFormSubmitted, setIsLoginFormSubmited] = useState(false);
  const [loginData, setLoginData] = useState({ name: "", password: "" });
  const [isLoginValidated, setIsLoginValidated] = useState(false);
  const [loginFormError, setLoginFormError] = useState({});
  const [visibility, setVisibility] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const editPasswordRef = useRef(null);
  const loginFormRef = useRef(null);
  const handleLoginForm = (e, keyEvent) => {
    if (!keyEvent) {
      e.preventDefault();
    }
    setIsLoginValidated(false);
    setLoginFormError({});
    if (!keyEvent) {
      setLoginData({ name: e.target[0].value, password: e.target[1].value });
    } else {
      setLoginData({
        name: loginFormRef.current[0].value,
        password: loginFormRef.current[1].value,
      });
    }

    setIsLoginFormSubmited(true);
  };

  const handlePasswordVisibility = (e) => {
    e.preventDefault();
    setVisibility(!visibility);
    editPasswordRef.current.type = visibility ? `password` : `text`;
  };
  const handleEnterKey = (e) => {
    if (e.key === "Enter") {
      handleLoginForm(loginFormRef.current, true);
    }
  };
  useEffect(() => {
    window.addEventListener("keydown", handleEnterKey);
    return () => window.removeEventListener("keydown", handleEnterKey);
  });
  useEffect(() => {
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
    if (isLoginFormSubmitted) {
      setIsLoginValidated(loginFormValidater());
      setIsLoginFormSubmited(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoginFormSubmitted]);
  useEffect(() => {
    if (isLoginValidated && Object.keys(loginFormError).length === 0) {
      (async () => {
        try {
          setFormLoading(true);
          const loginResult = await axios.post(
            `${process.env.REACT_APP_API_URL}/auth`,
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
            if (loginResult.data?.adminError) {
              setLoginFormError({ userNameError: loginResult.data?.message });
            } else {
              setLoginFormError({ passwordError: loginResult.data?.message });
            }
          }
        } catch (error) {
          console.log(error.message);
        } finally {
          setFormLoading(false);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoginValidated]);
  return (
    <>
      <div className="login-container">
        <form onSubmit={handleLoginForm} ref={loginFormRef}>
          <div className={`form-overlay ${formLoading ? `open` : ``}`}></div>
          <div className={`progress-bar ${formLoading ? `open` : ``}`}>
            <div className="progress-bar-value"></div>
          </div>
          <div className="heading-sec">
            <h1>Admin Login</h1>
          </div>
          <p>{loginFormError?.userNameError}</p>
          <input type="text" placeholder="UserName.." />
          <p>{loginFormError?.passwordError}</p>
          <label>
            <input ref={editPasswordRef} type="text" placeholder="Password" />
            <button
              className="material-symbols-outlined"
              onClick={handlePasswordVisibility}
            >
              {visibility ? `visibility` : `visibility_off`}
            </button>
          </label>
          <div className="form-footer-sec">
            <p>Forgot Password ?</p>
            <button type="submit">Login</button>
          </div>
        </form>
      </div>
    </>
  );
}

export default AdminLogin;
