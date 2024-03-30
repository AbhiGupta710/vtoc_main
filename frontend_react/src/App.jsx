import React, { useEffect, useState } from "react";
import {
  Navigate,
  Route,
  Routes,
  json,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useAuth } from "./auth/AuthContext";
import HomePage from "./pages/HomePage";
import SignUp from "./pages/SignUp";
import LoginPage from "./pages/LoginPage";
import SamplePage from "./pages/SamplePage";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

function App() {
  const navigate = useNavigate();
  const { isLoggedIn, toggleLoginState } = useAuth();
  const [loading, setLoding] = useState(false);

  const [finalImg, setFinalImg] = useState("");

  function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]);
    return null;
  }

  const handleLogin = async (credentials) => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/token/", {
        username: credentials.username,
        password: credentials.password,
      });
      const data = response.data.access;
      localStorage.setItem("accessToken", data);
      localStorage.setItem("userData", credentials.username);
      navigate("/sample");
      toggleLoginState(true);
    } catch (error) {
      console.log(error);
      toast("Invalid username or password");
    }
  };
  const handleTryOn = async (sampleData) => {
    setLoding(true);
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/tryon/", {
        username: sampleData.userData,
        person_image: sampleData.selectedImage1,
        cloth_image: sampleData.selectedImage2,
      });
      	setFinalImg(response);
		setLoding(false);
      	return response;
    } catch (error) {
	  setLoding(false);
      const json_error = error.response.data;
      if ("error" in json_error) {
        toast(json_error.error[0]);
      } else if ("person_image" in json_error) {
        toast("Please upload person's image..");
      } else if ("cloth_image" in json_error) {
        toast("Please upload cloth image..");
      }
      console.log(error);
    }
  };




  const handleSignup = async (userData) => {
    console.log(userData.username);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/register_user/",
        {
          username: userData.username,
          email: userData.email,
          password: userData.password,
        }
      );
      const data = response.data.access;
      localStorage.setItem("accessToken", data);
      navigate("/sample");
      toggleLoginState(true);
    } catch (error) {
      const json_error = error.response.data;
      if ("username" in json_error) {
        toast(json_error.username[0]);
      } else {
        toast(json_error.error[0]);
      }
      console.log("Failed to create an account", error);
    }
  };

  return (
    <>
	{loading && (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
          <CircularProgress />
        </Box>
      )}
      <Toaster position="top-center" />

      <ScrollToTop />
      <Routes location={location} key={location.pathname}>
        <Route index element={<HomePage />} />
        <Route
          path="/SignUp"
          element={
            isLoggedIn ? (
              <Navigate to="/sample" />
            ) : (
              <SignUp onSignup={handleSignup} />
            )
          }
        />
        <Route
          path="/LogIn"
          element={
            isLoggedIn ? (
              <Navigate to="/sample" />
            ) : (
              <LoginPage onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/sample"
          element={
            isLoggedIn ? (
              <SamplePage onTryonSubmit={handleTryOn} finalImg={finalImg} />
            ) : (
              <Navigate to="/LogIn" />
            )
          }
        />
      </Routes>
    </>
  );
}

export default App;
