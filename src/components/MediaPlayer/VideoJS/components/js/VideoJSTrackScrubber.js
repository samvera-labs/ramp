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
			<TrackScrubberButton player={this.player} trackScrubberRef={this.options.trackScrubberRef} />,
			this.el()
		);
	}
}

function TrackScrubberButton({ player, trackScrubberRef }) {
	const [zoomedOut, setZoomedOut] = React.useState(true);
	const [currentTrack, setCurrentTrack] = React.useState({});

	// React.useEffect(() => {
	// 	addScrubberToDOM();
	// }, []);

	// const addScrubberToDOM = () => {
	// 	const referenceNode = document.getElementById('iiif-media-player');
	// 	let newNode = document.createElement('div');
	// 	const html = `<div class="mejs-time track-mejs-currenttime-container">
	// 	                <span class="track-mejs-currenttime">00:00</span>
	// 	              </div>
	// 	              <div class="track-mejs-time-rail">
	// 	                <span class="track-mejs-time-total">
	// 	                  <span class="track-mejs-time-current"></span>
	// 	                  <span class="track-mejs-time-handle"></span>
	// 	                  <span class="track-mejs-time-float" style="display: none;">
	// 	                    <span class="track-mejs-time-float-current">00:00</span>
	// 	                    <span class="track-mejs-time-float-corner"></span>
	// 	                  </span>
	// 	                </span>
	// 	              </div>
	// 	              <div class="mejs-time track-mejs-duration-container">
	// 	                <span class="track-mejs-duration">00:00</span>
	// 	              </div>`;
	// 	newNode.id = 'track_scrubber';
	// 	newNode.className = 'vjs-track-scrubber-container hidden';
	// 	// newNode.ref = trackScrubberRef;
	// 	newNode.innerHTML = html;
	// 	// let trackScrubberNode = React.createElement(
	// 	// 	'div',
	// 	// 	{ className: 'vjs-track-scrubber-container hidden', id: 'track_scrubber' },
	// 	// 	{ ref: trackScrubberRef },
	// 	// 	html
	// 	// );
	// 	// console.log(trackScrubberNode);
	// 	// console.log(newNode);
	// 	trackScrubberRef = React.createRef(newNode);
	// 	referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
	// };

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
		console.log(trackScrubberRef.current.children);
		console.log(currentTrack);
		if (hide) {
			trackScrubberRef.current.classList.add('hidden');
		} else {
			populateTrackScrubber();
			trackScrubberRef.current.classList.remove('hidden');
			// this.resizeTrackScrubber();
		}
	};

	const populateTrackScrubber = () => {
		let [currentTime, toolTip, progressBar, duration] = trackScrubberRef.current.children;
		duration.innerHTML = timeToHHmmss(currentTrack.duration, true);
	};

	player.on('timeupdate', () => {
		if (player.isDisposed()) return;
		if (player.markers && player.markers.getMarkers()?.length > 0) {
			setCurrentTrack(player.markers.getMarkers()[0]);
			handleTimeUpdate(player.currentTime());
		}
	});

	const handleTimeUpdate = (curTime) => {


		// const nextItems = targets.filter((_, index) => index > srcIndex);

		// // Restrict access to the intended range in the media file
		// if (curTime < start) {
		//   player.currentTime(start);
		// }
		// if (curTime >= end) {
		//   if (nextItems.length == 0) options.nextItemClicked(0, targets[0].start);
		//   player.pause();
		//   player.trigger('ended');

		//   // On the next play event set the time to start or a seeked time
		//   // in between the 'ended' event and 'play' event
		//   // Reference: https://github.com/videojs/video.js/blob/main/src/js/control-bar/play-toggle.js#L128
		//   player.one('play', () => {
		//     let time = player.currentTime();
		//     if (time < end) {
		//       player.currentTime(time);
		//     } else {
		//       player.currentTime(start);
		//     }
		//   });
		// }

		// // Mark the preceding dummy slider ranges as 'played'
		// const dummySliders = document.getElementsByClassName(
		//   'vjs-custom-progress-inactive'
		// );
		// for (let slider of dummySliders) {
		//   const sliderIndex = slider.dataset.srcindex;
		//   if (sliderIndex < srcIndex) {
		//     slider.style.setProperty('background', '#477076');
		//   }
		// }
		if (trackScrubberRef.current) {
			let [currentTime, toolTip, progressBar, duration] = trackScrubberRef.current.children;
			duration.innerHTML = timeToHHmmss(currentTrack.duration, true);
			currentTime.innerHTML = timeToHHmmss(curTime - currentTrack.time, true);
		}

		// Calculate the played percentage of the media file's duration
		const played = Number(((curTime - currentTrack.time) * 100) / currentTrack.duration);

		document.documentElement.style.setProperty(
			'--range-scrubber',
			`calc(${played}%)`
		);
	};

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
