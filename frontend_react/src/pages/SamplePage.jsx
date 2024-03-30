import React, { useState } from "react";
import NavBar from "./NavBar";
import Model from "../assets/Images/model1.jpg";
import Shirt from "../assets/Images/shirt.jpg";
import finalModel from "../assets/Images/model2.jpg";
import FooterSection from "../components/FooterSection";

const SamplePage = ({onTryonSubmit, finalImg}) => {
	const [selectedImage1, setSelectedImage1] = useState(null);
	const [selectedImage2, setSelectedImage2] = useState(null);
	const [loading1, setLoading1] = useState(false);
	const [loading2, setLoading2] = useState(false);
	
	// console.log(finalImg.data?.tryon_image);

	const userData = localStorage.getItem("userData")

	const handleSubmit = () => {
		const sampleData = {
			userData: userData,
			selectedImage1: selectedImage1,
			selectedImage2: selectedImage2,
		};
		onTryonSubmit(sampleData)

	}

	// console.log(selectedImage1)

	const handleImageSelect = (e, setImage, setLoading) => {
		setLoading(true); // Set loading state to true
		const file = e.target.files[0];

		if (file) {
			const reader = new FileReader();
			reader.onload = (event) => {
				setImage(event.target.result);
				setLoading(false); // Set loading state to false when the image is loaded
			};
			reader.readAsDataURL(file);
		} else {
			setImage(null);
			setLoading(false); // Set loading state to false
		}
	};

	const clearImage = (setImage, inputId) => {
		setImage(null);
		document.getElementById(inputId).value = "";
	};

	return (
		<>
			<NavBar />
			<div className='px-4 py-20'>
				<h1 className='text-[clamp(2rem,_0.9437rem_+_4.507vw,_5rem)] font-secondary text-yellow-400 text-center leading-none'>
					Step into the Future of Fashion
				</h1>
				<p className='text-fluid-base text-center max-w-[600px] mx-auto pt-8'>
					Experience the thrill of trying on clothes without ever leaving your
					home! Our cutting-edge Virtual Try-On Clothing technology uses
					computer vision and image processing techniques to help you find the
					perfect outfit in a snap.
				</p>
			</div>
			<div className='max-w-[1440px] mx-auto flex flex-col items-center gap-12 pb-12 px-8'>
				<p>
					<span className='text-yellow-400 font-bold'>
						Note<sup>*</sup>:
					</span>{" "}
					For better results upload the images with white background and with good ascpect ratio.
				</p>
				<div className='image-container flex flex-col sm:flex-row gap-24 sm:gap-12 items-center justify-center'>
					<div>
						{loading1 ? (
							<div className='loading-spinner'>Loading...</div>
						) : selectedImage1 ? (
							<div>
								<img
									src={selectedImage1}
									alt='Selected Image 1'
									className='max-w-full max-h-[600px]'
								/>
								<br />
								<button
									className='text-fluid-base'
									onClick={() =>
										clearImage(setSelectedImage1, "image-upload-1")
									}>
									Cancel
								</button>
							</div>
						) : (
							<>
								<img
									src={Model}
									alt='Default Image 1'
									className='max-w-full max-h-[600px]'
								/>
								<br />
							</>
						)}
						<label
							htmlFor='image-upload-1'
							className='text-fluid-base cursor-pointer w-fit bg-gradient-to-r from-cyan-400 to-cyan-600 text-white py-2 px-6 rounded-lg block focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 mx-auto'>
							Upload Your Image
							<input
								type='file'
								accept='image/*'
								onChange={(e) =>
									handleImageSelect(e, setSelectedImage1, setLoading1)
								}
								id='image-upload-1'
								className='hidden'
							/>
						</label>
					</div>

					<div>
						{loading2 ? (
							<div className='loading-spinner'>Loading...</div>
						) : selectedImage2 ? (
							<div>
								<img
									src={selectedImage2}
									alt='Selected Image 2'
									className='max-w-full max-h-[600px]'
								/>
								<br />
								<button
									className='text-fluid-base'
									onClick={() =>
										clearImage(setSelectedImage2, "image-upload-2")
									}>
									Cancel
								</button>
							</div>
						) : (
							<>
								<img
									src={Shirt}
									alt='Default Image 2'
									className='max-w-full max-h-[600px]'
								/>
								<br />
							</>
						)}
						<label
							htmlFor='image-upload-2'
							className='text-fluid-base cursor-pointer w-fit bg-gradient-to-r from-cyan-400 to-cyan-600 text-white py-2 px-6 rounded-lg block focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 mx-auto'>
							Upload Cloth Image
							<input
								type='file'
								accept='image/*'
								onChange={(e) =>
									handleImageSelect(e, setSelectedImage2, setLoading2)
								}
								id='image-upload-2'
								className='hidden'
							/>
						</label>
					</div>
				</div>
				{
					finalImg === "" ? (<img
						src={finalModel}
						alt=''
						className='max-w-full sm:max-w-[500px] flex items-center justify-center'
					/>) : (
						<img
					src={finalImg.data?.tryon_image}
					alt=''
					className='max-w-full sm:max-w-[500px] flex items-center justify-center'
				/>
					)
				}
				
								<button
										onClick={handleSubmit}
							type='submit'
							className='w-32 bg-gradient-to-r from-cyan-400 to-cyan-600 text-white py-2 rounded-lg mx-auto block focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 mb-2'>
							Try On
						</button>

			</div>
			<FooterSection />
		</>
	);
};

export default SamplePage;
