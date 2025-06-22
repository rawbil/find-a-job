import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
import {useFormik} from 'formik';
import { validateAuthSchema } from "../../../utils/auth.schema";

const Auth = () => {
  // State for toggling between signup and login modes
   const [isSignup, setIsSignup] = useState(false);
// 
//   // State for form data
//   const [formData, setFormData] = useState({
//     fullName: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });
// 
//   const [errors, setErrors] = useState({});
// 
//   const [isLoading, setIsLoading] = useState(false);
// 
//   const navigate = useNavigate();
// 
//   const validateForm = () => {
//     const newErrors = {};
// 
//     if (!formData.email) {
//       newErrors.email = "Email is required";
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = "Email is invalid";
//     }
// 
//     if (!formData.password) {
//       newErrors.password = "Password is required";
//     } else if (formData.password.length < 6) {
//       newErrors.password = "Password must be at least 6 characters";
//     }
// 
//     if (isSignup) {
//       if (!formData.fullName) {
//         newErrors.fullName = "Name is required";
//       }
// 
//       if (formData.password !== formData.confirmPassword) {
//         newErrors.confirmPassword = "Passwords do not match";
//       }
//     }
// 
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };
// 
//   // Handles input changes and clears any existing errors for the changed field
// 
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
// 
//     // Clear error for the current field if it exists
//     if (errors[name]) {
//       setErrors((prev) => ({
//         ...prev,
//         [name]: "",
//       }));
//     }
//   };
// 
//   // Handles form submission validates inputs and simulates authentication
// 
  const onSubmit = async (e) => {
    e.preventDefault();

//     if (!validateForm()) return;
// 
//     setIsLoading(true);
// 
//     try {
//       // Simulate API call
//       if (isSignup) {
//         await new Promise((resolve) => setTimeout(resolve, 1000));
//         console.log("Signing up user:", {
//           fullName: formData.fullName,
//           email: formData.email,
//           password: formData.password,
//         });
//         navigate("/");
//       } else {
//         await new Promise((resolve) => setTimeout(resolve, 1000));
//         console.log("Logging in user:", {
//           email: formData.email,
//           password: formData.password,
//         });
//         navigate("/");
//       }
//     } catch (error) {
//       console.error("Authentication error:", error);
//       setErrors({
//         ...errors,
//         form: "An error occurred. Please try again.",
//       });
//     } finally {
//       setIsLoading(false);
   // }
  };

  // Toggles between login and signup modes and clears any existing errors

  const toggleAuthMode = () => {
    setIsSignup((prev) => !prev);
  };

const {values, handleChange,  handleSubmit, handleBlur, errors, touched, isLoading} = useFormik({
  initialValues: {email: "", fullName: "", password: "", confirmPassword: ""},
  validationSchema: validateAuthSchema,
  onSubmit
})

  return (
    <div class="auth-body">
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>{isSignup ? "Create Your Account" : "Welcome Back"}</h2>
          <p>{isSignup ? "Join JobJua today" : "Login to your account"}</p>
        </div>

        {/* Display form-level errors */}
        {errors.form && <div className="error-message">{errors.form}</div>}

        <form onSubmit={handleSubmit} noValidate>
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
              isLoading ? "Submitting..." : "Register"
            ) : (
              isLoading ? "Logging you in..." : "Login"
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
