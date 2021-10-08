import React, { useEffect, useState, FC } from 'react';
import ReactDOM from 'react-dom';

const App: React.FC<{}> = () => {
	return (
		<div
			style={{
				width: 800,
				height: 1600,
				backgroundColor: 'red',
				position: 'fixed',
				top: 0,
				left: 0,
				zIndex: 999999,
			}}
		>
			<div id="extra-chrome-gift">
				<input
					type="text"
					placeholder="Ne gircen"
					style={{ display: 'absolute', backgroundColor: 'white' }}
				></input>
				<button
					style={{ cursor: 'pointer' }}
					type="button"
					id="anan-but-x"
					onClick={() => console.log('hello')}
				>
					X
				</button>
			</div>
		</div>
	);
};
const root = document.createElement('div');

document.body.appendChild(root);
ReactDOM.render(<App />, root);
