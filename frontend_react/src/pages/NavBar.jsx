import React from "react";
import Logo from "../assets/Images/logo.svg";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useLocation } from "react-router-dom";

const NavBar = () => {
	const { isLoggedIn, toggleLoginState, handleLogout } = useAuth();

	const { pathname } = useLocation();

	const showLink =
		pathname !== "/login" ||
		(pathname !== "/SignUp" && <Link to={"/LogIn"}>Log In</Link>);

	return (
		<header className='text-fluid-base leading-none h-[10vh] flex items-center justify-between px-4 '>
			<Link to={"/"}>
				<div className='flex items-center gap-4'>
					<img
						src={Logo}
						alt=''
						className='w-6'
					/>
					<p className='uppercase text-sm'>Virtual Fashion Lab</p>
				</div>
			</Link>
			<div className='flex items-center gap-2 sm:gap-8'>
				{isLoggedIn ? (
					<button
						onClick={handleLogout}
						className='bg-indigo-600 text-white text-sm leading-6 font-medium py-2 px-3 rounded-lg'>
						Log Out
					</button>
				) : (
					showLink
				)}
				<p className='text-sm'>2023</p>
			</div>
		</header>
	);
};

export default NavBar;
