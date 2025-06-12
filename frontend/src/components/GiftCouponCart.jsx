import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useCartStore } from "../stores/useCartStore";

const GiftCouponCard = () => {
	const [userInputCode, setUserInputCode] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [debugInfo, setDebugInfo] = useState("");
	const { coupon, isCouponApplied, applyCoupon, getMyCoupon, removeCoupon } = useCartStore();

	useEffect(() => {
		const fetchCoupon = async () => {
			try {
				setIsLoading(true);
				
				await getMyCoupon();
				
			} catch (error) {
				setDebugInfo(`Error: ${error.message}`);
			} finally {
				setIsLoading(false);
			}
		};

		fetchCoupon();
	}, []); // Remove getMyCoupon dependency temporarily

	useEffect(() => {
		if (coupon && Array.isArray(coupon) && coupon.length > 0) {
			setUserInputCode(coupon[0].code);
		} else if (coupon && !Array.isArray(coupon)) {
			setUserInputCode(coupon.code);
		}
	}, [coupon]);

	const handleApplyCoupon = () => {
		if (!userInputCode) return;
		applyCoupon(userInputCode);
	};

	const handleRemoveCoupon = async () => {
		await removeCoupon();
		setUserInputCode("");
	};

	return (
		<motion.div
			className='space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay: 0.2 }}
		>
			
			{isLoading ? (
				<div className="animate-pulse">
					<div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
					<div className="h-10 bg-gray-700 rounded mb-4"></div>
					<div className="h-10 bg-gray-700 rounded"></div>
				</div>
			) : (
				<>
					<div className='space-y-4'>
						<div>
							<label htmlFor='voucher' className='mb-2 block text-sm font-medium text-gray-300'>
								Do you have a voucher or gift card?
							</label>
							<input
								type='text'
								id='voucher'
								className='block w-full rounded-lg border border-gray-600 bg-gray-700 
		            p-2.5 text-sm text-white placeholder-gray-400 focus:border-emerald-500 
		            focus:ring-emerald-500'
								placeholder='Enter code here'
								value={userInputCode}
								onChange={(e) => setUserInputCode(e.target.value)}
								required
							/>
						</div>

						<motion.button
							type='button'
							className='flex w-full items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300'
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={handleApplyCoupon}
						>
							Apply Code
						</motion.button>
					</div>
					
					{isCouponApplied && coupon && (
						<div className='mt-4'>
							<h3 className='text-lg font-medium text-gray-300'>Applied Coupon</h3>
							<p className='mt-2 text-sm text-gray-400'>
								{Array.isArray(coupon) ? coupon[0].code : coupon.code} - {Array.isArray(coupon) ? coupon[0].discountPercentage : coupon.discountPercentage}% off
							</p>
							<motion.button
								type='button'
								className='mt-2 flex w-full items-center justify-center rounded-lg bg-red-600 
		            px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700 focus:outline-none
		             focus:ring-4 focus:ring-red-300'
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={handleRemoveCoupon}
							>
								Remove Coupon
							</motion.button>
						</div>
					)}

					{coupon && !isCouponApplied && (
						<div className='mt-4'>
							<h3 className='text-lg font-medium text-gray-300'>Your Available Coupon:</h3>
							<p className='mt-2 text-sm text-gray-400'>
								{Array.isArray(coupon) ? coupon[0].code : coupon.code} - {Array.isArray(coupon) ? coupon[0].discountPercentage : coupon.discountPercentage}% off
							</p>
						</div>
					)}
				</>
			)}
		</motion.div>
	);
};

export default GiftCouponCard;