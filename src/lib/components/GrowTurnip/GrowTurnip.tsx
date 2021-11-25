import React, { FunctionComponent, useState, useEffect } from 'react';
import { Grid } from '@mui/material';

import './GrowTurnip.css';

export type GrowTurnipProps = {
	text: string;
	value;
};

const GrowTurnip: FunctionComponent<GrowTurnipProps> = ({ text, value }) => {
	const [percentage, setPercentage] = useState(10);
	const [currentStatus, setCurrentStatus] = useState({
		waterHeight: 10,
		turnipImg: '/assets/grow_turnip_1.svg',
		message:
			'This turnip looks like it just fell off the turnip truck! Quick,get some droplets',
	});
	useEffect(() => {
		chrome.storage.local.get(['successfulTranslations'], async (res) => {
			let successDroplets = res.successfulTranslations.filter(
				(el) => el === new Date().getDate()
			).length;
			const currentPercentage = Math.ceil((successDroplets / 30) * 100);
			const imgAndMessage = chooseTurnipAndMessage(currentPercentage);
			setCurrentStatus({
				waterHeight: keepInRange(currentPercentage),
				turnipImg: imgAndMessage.img,
				message: imgAndMessage.message,
			});
		});
	}, []);
	return (
		<div style={{ height: '100%' }}>
			<div className="grow-container">
				<div className="pot">
					<div className="interior">
						<div
							className="filled-water "
							style={{ height: `${currentStatus.waterHeight}%` }}
						></div>
					</div>
				</div>
				<img
					src={currentStatus.turnipImg}
					style={{ width: 100, height: 100, transition: 'all 2s ease' }}
				></img>
			</div>
			<div style={{ margin: '20px 0' }}></div>
			<em style={{ color: 'gray' }}>{currentStatus.message}</em>
		</div>
	);
};
const keepInRange = (value: number) => Math.min(Math.max(value, 10), 95);
const chooseTurnipAndMessage = (percentage: number) => {
	switch (true) {
		case percentage < 33:
			return {
				message:
					'This turnip looks like it just fell off the turnip truck! Quick,get some droplets',
				img: '/assets/grow_turnip_1.svg',
			};
		case percentage < 66:
			return {
				message: 'Now your turnip started getting better!',
				img: '/assets/grow_turnip_2.svg',
			};
		case percentage < 99.5:
			return {
				message: 'Quite the gardener you are! Keep going!',
				img: '/assets/grow_turnip_3.svg',
			};
		case percentage < 110:
			return {
				message: 'You got all your droplets! A sunny day in your farm 🔆',
				img: '/assets/grow_turnip_4.svg',
			};
		default:
			return {
				message:
					'This turnip looks like it just fell off the turnip truck! Quick,get some droplets',
				img: '/assets/grow_turnip_1.svg',
			};
	}
};
export default GrowTurnip;
