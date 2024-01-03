import React from 'react';
import ReactDOM from 'react-dom';
import videojs from 'video.js';
import '../styles/VideoJSTrackScrubber.scss';
import '../styles/VideoJSProgress.scss';
import { timeToHHmmss } from '@Services/utility-helpers';

const vjsComponent = videojs.getComponent('Component');

const TrackScrubberZoomInIcon = ({ scale }) => {
	return (
		<svg viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'
			style={{ fill: 'white', height: '1.25rem', width: '1.25rem', scale: scale }}>
			<g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
			<g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round'></g>
			<g id='SVGRepo_iconCarrier'>
				<path fill='#ffffff' fillRule='evenodd' d='M4 9a5 5 0 1110 0A5 5 0 014 9zm5-7a7 7 0 104.2 12.6.999.999 
				0 00.093.107l3 3a1 1 0 001.414-1.414l-3-3a.999.999 0 00-.107-.093A7 7 0 009 2zM8 6.5a1 1 0 112 0V8h1.5a1 
				1 0 110 2H10v1.5a1 1 0 11-2 0V10H6.5a1 1 0 010-2H8V6.5z'>
				</path>
			</g>
		</svg>
	);
};

const TrackScrubberZoomOutIcon = ({ scale }) => {
	return (
		<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
			style={{ fill: 'white', height: '1.25rem', width: '1.25rem', scale: scale }}>
			<g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
			<g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
			<g id="SVGRepo_iconCarrier">
				<path fillRule="evenodd" clipRule="evenodd" d="M4 11C4 7.13401 7.13401 4 11 4C14.866 4 18 7.13401 18 11C18 14.866 
				14.866 18 11 18C7.13401 18 4 14.866 4 11ZM11 2C6.02944 2 2 6.02944 2 11C2 15.9706 6.02944 20 11 20C13.125 20 15.078 
				19.2635 16.6177 18.0319L20.2929 21.7071C20.6834 22.0976 21.3166 22.0976 21.7071 21.7071C22.0976 21.3166 22.0976 
				20.6834 21.7071 20.2929L18.0319 16.6177C19.2635 15.078 20 13.125 20 11C20 6.02944 15.9706 2 11 2Z" fill="#ffffff">
				</path>
				<path fillRule="evenodd" clipRule="evenodd" d="M7 11C7 10.4477 7.44772 10 8 10H14C14.5523 10 15 10.4477 15 11C15 
				11.5523 14.5523 12 14 12H8C7.44772 12 7 11.5523 7 11Z" fill="#ffffff">
				</path>
			</g>
		</svg>
	);
};

/**
 * Custom VideoJS component for displaying track view when
 * there are tracks/structure items in the current Canvas
 * @param {Object} options
 * @param {Number} options.canvasIndex current canvas's index
 * @param {Number} options.lastCanvasIndex last canvas's index
 * @param {Function} options.switchPlayer callback function switch to next canvas
 */
class VideoJSTrackScrubber extends vjsComponent {
	constructor(player, options) {
		super(player, options);
		this.setAttribute('data-testid', 'videojs-track-scrubber-button');

		this.mount = this.mount.bind(this);
		this.options = options;
		this.player = player;

		/* When player is ready, call method to mount React component */
		player.ready(() => {
			this.mount();
		});

		/* Remove React root when component is destroyed */
		this.on('dispose', () => {
			ReactDOM.unmountComponentAtNode(this.el());
		});
	}

	mount() {
		ReactDOM.render(
			<TrackScrubberButton
				player={this.player}
				trackScrubberRef={this.options.trackScrubberRef}
				timeToolRef={this.options.timeToolRef}
			/>,
			this.el()
		);
	}
}

function TrackScrubberButton({ player, trackScrubberRef, timeToolRef }) {
	const [zoomedOut, setZoomedOut] = React.useState(true);
	const [currentTrack, _setCurrentTrack] = React.useState({});

	let currentTrackRef = React.useRef();
	const setCurrentTrack = (t) => {
		currentTrackRef.current = t;
		_setCurrentTrack(t);
	};

	const handleTrackScrubberClick = () => {
		if (trackScrubberRef.current === null) {
			return;
		}
		if (player.isFullscreen()) {
			player.exitFullScreen();
		}
		showTrackScrubber(!zoomedOut);
		setZoomedOut(zoomedOut => !zoomedOut);
	};

	const handleTrackScrubberKeyDown = (e) => {
		if (e.which === 32 || e.which === 13) {
			e.stopPropagation();
			handleTrackScrubberClick();
		}
	};

	const showTrackScrubber = (hide) => {
		if (hide) {
			trackScrubberRef.current.classList.add('hidden');
		} else {
			populateTrackScrubber();
			trackScrubberRef.current.classList.remove('hidden');
			let [_, progressBar, __] = trackScrubberRef.current.children;
			progressBar.addEventListener('mouseenter', (e) => {
				handleMouseMove(e);
			});
			progressBar.addEventListener('mousemove', (e) => {
				handleMouseMove(e);
			});
			progressBar.addEventListener('mousedown', (e) => {
				// Only handle left click event
				if (e.which === 1) {
					handleSetProgress(e);
				}
			});
		}
	};

	const convertToTime = (e) => {
		if (!currentTrackRef.current) {
			return;
		}
		let offsetx = 0;
		if (e.changedTouches?.length > 0) {
			offsetx = e.changedTouches[0].pageX;
		} else {
			offsetx = e.offsetX;
		}
		if (e.target.clientWidth > 0) {
			let time =
				(offsetx / e.target.clientWidth) * currentTrackRef.current.duration
				;
			console.log(time);
			return time;
		}
	};

	const handleMouseMove = (e) => {
		// Calculate the horizontal position of the time tooltip using the event's offsetX property
		let leftOffset = e.offsetX - timeToolRef.current.offsetWidth / 2; // deduct 0.5 x width of tooltip element
		timeToolRef.current.style.left = leftOffset + 'px';

		// Set text in the tooltip as the time relevant to the pointer event's position
		timeToolRef.current.innerHTML = timeToHHmmss(convertToTime(e));
	};

	const handleSetProgress = (e) => {
		if (!currentTrackRef.current) {
			return;
		}
		let trackoffset = convertToTime(e);
		let trackpercent = Math.min(
			100,
			Math.max(0, 100 * trackoffset / currentTrackRef.current.duration)
		);

		// Set the elapsed time in the scrubber progress bar
		document.documentElement.style.setProperty(
			'--range-scrubber',
			`calc(${trackpercent}%)`
		);
		// Set player time accordingly
		player.currentTime(currentTrackRef.current.time + trackoffset);
	};

	const populateTrackScrubber = () => {
		let [currentTime, _, duration] = trackScrubberRef.current.children;

		// Set the elapsed time to zero in the scrubber progress bar
		document.documentElement.style.setProperty(
			'--range-scrubber',
			`calc(${0}%)`
		);
		currentTime.innerHTML = timeToHHmmss(0);
		duration.innerHTML = timeToHHmmss(currentTrack.duration);
	};

	const updateTrackScrubberProgressBar = (currentTime, player) => {
		// Handle Safari which emits the timeupdate event really quickly
		if (!currentTrackRef.current) {
			if (player.markers && player.markers.getMarkers()?.length > 0) {
				const track = player.markers.getMarkers()[0];
				if (track.key != currentTrack?.key) {
					setCurrentTrack(track);
				}
			}
		}

		let trackoffset = currentTime - currentTrackRef.current.time;
		let trackpercent = Math.min(
			100,
			Math.max(0, 100 * trackoffset / currentTrackRef.current.duration)
		);

		// Set the elapsed time in the scrubber progress bar
		document.documentElement.style.setProperty(
			'--range-scrubber',
			`calc(${trackpercent}%)`
		);
		let [currentTimeDisplay, _, durationDisplay] = trackScrubberRef.current.children;
		// Update the duration when playing through tracks sequentially
		durationDisplay.innerHTML = timeToHHmmss(currentTrackRef.current.duration);
		// Update current time elapsed within the current track
		currentTimeDisplay.innerHTML = timeToHHmmss(trackoffset);
	};

	player.on('timeupdate', () => {
		if (player.isDisposed()) return;
		if (player.markers && player.markers.getMarkers()?.length > 0) {
			const track = player.markers.getMarkers()[0];
			if (track.key != currentTrack?.key) {
				setCurrentTrack(track);
			}
		} else if (currentTrack.key === undefined) {
			setCurrentTrack({
				duration: player.duration(),
				time: 0,
				key: '',
				text: 'Complete media file'
			});
		}
		updateTrackScrubberProgressBar(player.currentTime(), player);
	});

	return (
		<div className="vjs-button vjs-control">
			<button className="vjs-button vjs-track-scrubber-button"
				role="button"
				tabIndex={0}
				title={"Toggle track scrubber"}
				onClick={handleTrackScrubberClick}
				onKeyDown={handleTrackScrubberKeyDown}>
				{zoomedOut && <TrackScrubberZoomInIcon scale="0.9" />}
				{!zoomedOut && <TrackScrubberZoomOutIcon scale="0.9" />}
			</button>
		</div >
	);
}

vjsComponent.registerComponent('VideoJSTrackScrubber', VideoJSTrackScrubber);

export default VideoJSTrackScrubber;
