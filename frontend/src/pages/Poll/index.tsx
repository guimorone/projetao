import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from 'flowbite-react';
import { classNames, formatNumber } from '../../utils';
import { useTypedOutletContext } from '../../utils/hooks';
import { MAP } from '../../constants/paths';
import type { IPolls } from '../../@types';

export default function Poll() {
	const navigate = useNavigate();
	const { id } = useParams();
	const { polls } = useTypedOutletContext();
	const [poll, setPoll] = useState<IPolls | null>(null);
	const [currentTextColor1, setCurrentTextColor1] = useState<'white' | 'black'>('black');
	const [currentTextColor2, setCurrentTextColor2] = useState<'white' | 'black'>('black');

	const handleColorChange1 = (): void => {
		setCurrentTextColor1(prevColor => (prevColor === 'black' ? 'white' : 'black'));
	};

	const handleColorChange2 = (): void => {
		setCurrentTextColor2(prevColor => (prevColor === 'black' ? 'white' : 'black'));
	};

	useEffect(() => {
		if (id === undefined || !polls || !polls.length) {
			navigate(MAP);
			return;
		}

		try {
			const index = parseInt(id);

			if (index < 0 || index > polls.length - 1) navigate(MAP);
			else setPoll(polls[index]);
		} catch (error) {
			navigate(MAP);
		}
	}, [id, polls]);

	if (!poll) return null;

	return (
		<div className="flex flex-1 flex-col items-center justify-between w-full">
			<h1 className="text-center text-2xl sm:text-4xl font-bold mt-12">{poll.poll}</h1>
			<div className="absolute bottom-0 inset-x-0 space-y-2">
				<div className="flex w-full max-w-screen">
					<Card
						className={classNames(
							poll.color1 || 'bg-gradient-to-tr from-blue-600 to-blue-400',
							'relative text-center w-full h-72 sm:h-80 mt-auto rounded-none rounded-tr-lg'
						)}
						onClick={handleColorChange1}
					>
						{poll.image1 && (
							<img
								src={poll.image1}
								className="absolute inset-x-0 bottom-2/3 rounded-full w-auto max-w-96 h-64 mx-auto z-0 p-4 object-scale-down"
							/>
						)}
						<div className={classNames(poll.image1 && 'mt-4', 'space-y-2')}>
							<h5
								className={classNames(
									currentTextColor1 === 'black' ? 'text-gray-700' : 'text-gray-300',
									'text-2xl sm:text-4xl font-bold tracking-tight  z-10'
								)}
							>
								{poll.option1}
							</h5>
							<p
								className={classNames(currentTextColor1 === 'black' ? 'text-gray-900' : 'text-white', 'text-6xl  z-10')}
							>
								{formatNumber(poll.votes1, 'decimal')}
							</p>
						</div>
					</Card>
					<Card
						className={classNames(
							poll.color2 || 'bg-gradient-to-tl from-red-600 to-red-400',
							'relative text-center w-full h-72 sm:h-80 mt-auto rounded-none rounded-tl-lg'
						)}
						onClick={handleColorChange2}
					>
						{poll.image2 && (
							<img
								src={poll.image2}
								className="absolute inset-x-0 bottom-2/3 rounded-full w-auto max-w-96 h-64 mx-auto z-0 p-4 object-scale-down"
							/>
						)}
						<div className={classNames(poll.image2 && 'mt-4', 'space-y-2')}>
							<h5
								className={classNames(
									currentTextColor2 === 'black' ? 'text-gray-700' : 'text-gray-300',
									'text-2xl sm:text-4xl font-bold tracking-tight z-10'
								)}
							>
								{poll.option2}
							</h5>
							<p
								className={classNames(currentTextColor2 === 'black' ? 'text-gray-900' : 'text-white', 'text-6xl  z-10')}
							>
								{formatNumber(poll.votes2, 'decimal')}
							</p>
						</div>
					</Card>
				</div>
			</div>
		</div>
	);
}
