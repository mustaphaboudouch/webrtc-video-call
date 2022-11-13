import { useRef } from 'react';
import Button from './components/Button';
import Video from './components/Video';

const App = () => {
	const localVideoRef = useRef<HTMLVideoElement>(null);
	const remoteVideoRef = useRef<HTMLVideoElement>(null);

	const startLocalStream = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				audio: true,
				video: true,
			});
			if (localVideoRef.current) localVideoRef.current.srcObject = stream;
		} catch (error) {
			console.log(`startLocalStream() failed: ${error}`);
		}
	};

	return (
		<div>
			<h1 className='py-5 text-center text-2xl font-bold'>WebRTC Video Call</h1>
			<div className='flex gap-5 px-10'>
				<div className='flex flex-1 flex-col items-start gap-2'>
					<Video ref={localVideoRef} />
					<Button onClick={startLocalStream}>Start Video / Audio</Button>
				</div>
				<div className='flex-1'>
					<Video ref={remoteVideoRef} />
				</div>
			</div>
		</div>
	);
};

export default App;
