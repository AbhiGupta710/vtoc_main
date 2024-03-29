import React, { useEffect } from "react";
import {
	Navigate,
	Route,
	Routes,
	useLocation,
	useNavigate,
} from "react-router-dom";
import { useAuth } from "./auth/AuthContext";
import HomePage from "./pages/HomePage";
import SignUp from "./pages/SignUp";
import LoginPage from "./pages/LoginPage";
import SamplePage from "./pages/SamplePage";
import axios from "axios";

function App() {
	const navigate = useNavigate();
	const { isLoggedIn, toggleLoginState } = useAuth();

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
			navigate("/sample");
			toggleLoginState(true);
		} catch (error) {
			console.log(error);
			console.log("Invalid username or password");
		}
	};

	const handleSignup = async (userData) => {
		// const jsonData = JSON.stringify(userData);
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
			console.log("Failed to create an account");
		}
	};

	return (
		<>
			<ScrollToTop />
			<Routes
				location={location}
				key={location.pathname}>
				<Route
					index
					element={<HomePage />}
				/>
				<Route
					path='/SignUp'
					element={
						isLoggedIn ? (
							<Navigate to='/sample' />
						) : (
							<SignUp onSignup={handleSignup} />
						)
					}
				/>
				<Route
					path='/LogIn'
					element={
						isLoggedIn ? (
							<Navigate to='/sample' />
						) : (
							<LoginPage onLogin={handleLogin} />
						)
					}
				/>
				<Route
					path='/sample'
					element={isLoggedIn ? <SamplePage /> : <Navigate to='/LogIn' />}
				/>
			</Routes>
		</>
	);
}

export default App;
