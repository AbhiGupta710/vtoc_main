import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { HideIcon, ShowIcon } from "../components/icons";
import NavBar from "./NavBar";

function SignUp({ onSignup }) {
	const [showPassword, setshowPassword] = useState(false);

	const handelToggle = () => {
		setshowPassword((prev) => !prev);
	};

	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		formState,
		formState: { errors, isSubmitSuccessful },
		watch,
		reset,
	} = useForm();

	const onSubmit = (data) => {
		const sortedData = {
			username: data.username,
			password: data.password,
			email: data.email,
		};
		onSignup(sortedData);
		navigate("/sample");
	};

	useEffect(() => {
		if (formState.isSubmitSuccessful) {
			reset({
				username: "",
				email: "",
				password: "",
				confirmPassword: "",
			});
		}
	}, [formState, reset]);

	return (
		<>
			<NavBar />
			<div className='font-primary flex items-center justify-center min-h-[90vh] px-4'>
				<div className='max-w-md w-full p-6 bg-white rounded-lg shadow-lg'>
					<div className='flex items-center justify-end gap-3 mb-4'>
						<div className='w-5'>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								xmlnsXlink='http://www.w3.org/1999/xlink'
								viewBox='0 0 12 12'>
								<path
									d='M 6 0 L 6 12 M 0 6 L 12 6 M 1.757 1.758 L 10.243 10.242 M 1.758 10.243 L 10.242 1.757'
									fill='transparent'
									strokeWidth='1.45'
									stroke='#111827'
									strokeMiterlimit='10'></path>
							</svg>
						</div>
						<p className='text-accent-900 font-secondary text-xl'>V-TOC</p>
					</div>
					<h1 className='text-2xl font-semibold text-center text-gray-500 mt-8 mb-6'>
						Sign Up
					</h1>
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className='mb-4'>
							<label
								htmlFor='username'
								className='block mb-2 text-sm text-gray-600'>
								Username:
							</label>
							<input
								type='text'
								id='username'
								autoComplete='name'
								{...register("username", { required: true })}
								className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-black font-primary'
							/>
							{errors.username && (
								<span className='block mb-2 text-sm text-red-600'>
									This field is required
								</span>
							)}
						</div>

						<div className='mb-4'>
							<label
								htmlFor='email'
								className='block mb-2 text-sm text-gray-600'>
								Email:
							</label>
							<input
								type='email'
								id='email'
								autoComplete='email'
								{...register("email", {
									required: true,
									pattern: /^\S+@\S+$/i,
								})}
								className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-black'
							/>
							{errors.email && (
								<span className='block mb-2 text-sm text-red-600'>
									Please enter a valid email address
								</span>
							)}
						</div>

						<div className='mb-4 relative'>
							<label
								htmlFor='password'
								className='block mb-2 text-sm text-gray-600'>
								Password:
							</label>
							<input
								type={showPassword ? "text" : "password"}
								id='password'
								autoComplete='new-password'
								{...register("password", { required: true, minLength: 6 })}
								className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-black'
							/>
							<i
								onClick={handelToggle}
								className='cursor-pointer'>
								{showPassword ? <HideIcon /> : <ShowIcon />}
							</i>
							{errors.password && (
								<span className='block mb-2 text-sm text-red-600'>
									Password must be at least 6 characters long
								</span>
							)}
						</div>

						<div className='mb-4'>
							<label
								htmlFor='confirmPassword'
								className='block mb-2 text-sm text-gray-600'>
								Confirm Password:
							</label>
							<input
								type='password'
								id='confirmPassword'
								autoComplete='new-password'
								{...register("confirmPassword", {
									required: true,
									validate: (value) =>
										value === watch("password") || "The passwords do not match",
								})}
								className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-black'
							/>
							{errors.confirmPassword && (
								<span className='block mb-2 text-sm text-red-600'>
									{errors.confirmPassword.message}
								</span>
							)}
						</div>

						<button
							type='submit'
							className='w-32 bg-gradient-to-r from-cyan-400 to-cyan-600 text-white py-2 rounded-lg mx-auto block focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 mb-2'>
							SignUp
						</button>
					</form>
					<div className='text-center'>
						<p className='text-sm text-gray-600'>
							Do you already have an account?{" "}
							<Link
								to={"/LogIn"}
								className='text-cyan-600'>
								Log in
							</Link>
						</p>
					</div>
					<p className='text-xs text-gray-600 text-center mt-8'>
						&copy; 2023 V-TOC
					</p>
				</div>
			</div>
		</>
	);
}

export default SignUp;
