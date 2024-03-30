import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	const toggleLoginState = (value) => {
		setIsLoggedIn(value);
	};
	const handleLogout = () => {
		setIsLoggedIn(false);
		localStorage.removeItem("accessToken");
		localStorage.removeItem("userData");
	};

	useEffect(() => {
		const accessToken = localStorage.getItem("accessToken");
		if (accessToken) {
			setIsLoggedIn(true);
		}
	}, []);

	return (
		<AuthContext.Provider
			value={{ isLoggedIn, toggleLoginState, handleLogout }}>
			{children}
		</AuthContext.Provider>
	);
};
