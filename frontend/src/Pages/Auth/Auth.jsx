import { useState } from "react";
import "./Auth.css";
import {useFormik} from 'formik';
import { validateAuthSchema } from "../../../utils/auth.schema";
import { AxiosError } from "axios";
import { authLogin, authRegister } from "../../../utils/services/auth.service";
import { useNavigate } from "react-router-dom";
//import {toast} from 'react-hot-toast'

const Auth = () => {
  // State for toggling between signup and login modes
   const [isSignup, setIsSignup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [errorMessage, setErrormessage] = useState('');


  const onSubmit = async (values) => {
    try {
      setIsLoading(true);

      const response = !isSignup ? await authLogin(values) : await authRegister(values);
      if (response.success) {
        isSignup ? setIsSignup(false) :  navigate('/');
        //toast.success(response.message);
        alert(response.message);
      } else {
        console.log(response.message)
        setErrormessage(response.message);
      }

    } catch (error) {
      console.log(error.message)
        setErrormessage(error.message || "Authentication failed");
     
    }
    finally {
      setIsLoading(false);
    }
  };

  // Toggles between login and signup modes and clears any existing errors
  const toggleAuthMode = () => {
    setIsSignup((prev) => !prev);
  };

const {values, handleChange,  handleSubmit, handleBlur, errors, touched} = useFormik({
  initialValues: {email: "", fullName: "", password: "", confirmPassword: ""},
  validationSchema: validateAuthSchema,
  onSubmit
})

  return (
    <div className="auth-body">
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>{isSignup ? "Create Your Account" : "Welcome Back"}</h2>
          <p>{isSignup ? "Join JobJua today" : "Login to your account"}</p>
        </div>

        {/* Display form-level errors */}
        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <form onSubmit={handleSubmit}>
          {/* Name field - only shown in signup mode */}
          {isSignup && (
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={values.fullName}
                onChange={handleChange}
                onBlur={handleBlur}
                className={(errors.fullName && touched.fullName) ? "error" : ""}
              />
              {(errors.fullName && touched.fullName) && (
                <span className="error-message">{errors.fullName}</span>
              )}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.email && touched.email ? "error" : ""}
            />
            {errors.email && touched.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.password && touched.password ? "error" : ""}
            />
            {errors.password && touched.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          {isSignup && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.confirmPassword && touched.confirmPassword? "error" : ""}
              />
              {errors.confirmPassword && touched.confirmPassword && (
                <span className="error-message">{errors.confirmPassword}</span>
              )}
            </div>
          )}

          {/* Submit button with loading state */}
          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? (
              <span className="spinner"></span>
            ) : isSignup ? (
              "Register"
            ) : (
               "Login"
            )}
          </button>
        </form>

        {/* Toggle between login and signup */}
        <div className="auth-footer">
          <p>
            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={toggleAuthMode}
              className="switch-button"
            >
              {isSignup ? "Login" : "Sign up"}
            </button>
          </p>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Auth;
