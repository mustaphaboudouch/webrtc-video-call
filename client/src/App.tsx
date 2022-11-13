import { useEffect, useRef, useState } from 'react';
import Button from './components/Button';
import Video from './components/Video';

const PEER_CONNECTION_CONFIG = {
	iceServers: [
		{
			urls: 'stun:[STUN-IP]:[PORT]',
			credentials: '[YOUR CREDENTIAL]',
			username: '[USERNAME]',
		},
	],
};

const App = () => {
	const localVideoRef = useRef<HTMLVideoElement>(null);
	const remoteVideoRef = useRef<HTMLVideoElement>(null);
	const peerConnection = useRef<RTCPeerConnection | null>(null);
	const textRef = useRef<HTMLTextAreaElement>(null);

	/**
	 * Establish Peer Connection
	 */
	useEffect(() => {
		peerConnection.current = new RTCPeerConnection(PEER_CONNECTION_CONFIG);
		peerConnection.current.addEventListener('icecandidate', (e) => {
			console.log(`ICE CANDIDATES = ${JSON.stringify(e.candidate)}`);
		});
		peerConnection.current.addEventListener('iceconnectionstatechange', (e) => {
			console.log(`iceconnectionstatechange : ${e}`);
		});
		peerConnection.current.addEventListener('track', (e) => {
			if (remoteVideoRef.current)
				remoteVideoRef.current.srcObject = e.streams[0];
		});
	}, []);

	/**
	 * Start Local Stream (Video & Audio)
	 */
	const startLocalStream = async () => {
		if (!peerConnection.current) return;
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				audio: true,
				video: true,
			});
			if (localVideoRef.current) localVideoRef.current.srcObject = stream;
			stream
				.getTracks()
				.forEach((track) => peerConnection.current?.addTrack(track, stream));
		} catch (error) {
			console.log(`startLocalStream() failed : ${error}`);
		}
	};

	/**
	 * Create Offer
	 */
	const createOffer = async () => {
		if (!peerConnection.current) return;
		try {
			const sdp = await peerConnection.current.createOffer({
				offerToReceiveAudio: true,
				offerToReceiveVideo: true,
			});
			console.log(`SDP = ${JSON.stringify(sdp)}`);
			peerConnection.current.setLocalDescription(sdp);
		} catch (error) {
			console.log(`createOffer() failed : ${error}`);
		}
	};

	/**
	 * Set Remote Description
	 */
	const setRemoteDescription = () => {
		if (!textRef.current?.value || !peerConnection.current) return;
		const description = JSON.parse(textRef.current.value);
		peerConnection.current.setRemoteDescription(
			new RTCSessionDescription(description),
		);
	};

	/**
	 * Create Answer
	 */
	const createAnswer = async () => {
		if (!peerConnection.current) return;
		try {
			const sdp = await peerConnection.current.createAnswer();
			console.log(`SDP = ${JSON.stringify(sdp)}`);
			peerConnection.current.setLocalDescription(sdp);
		} catch (error) {
			console.log(`createAnswer() failed : ${error}`);
		}
	};

	/**
	 * Set Ice Candidate
	 */
	const setIceCandidate = () => {
		if (!textRef.current?.value || !peerConnection.current) return;
		const candidate = JSON.parse(textRef.current.value);
		peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
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
			<div className='flex flex-col gap-2 px-10 py-2'>
				<div className='flex gap-2'>
					<Button onClick={createOffer}>Create Offer</Button>
					<Button onClick={createAnswer}>Create Answer</Button>
				</div>
				<textarea
					ref={textRef}
					className='w-full'
					placeholder='SDP and Ice Candidates'
				/>
				<div className='flex gap-2'>
					<Button onClick={setRemoteDescription}>Set Remote Description</Button>
					<Button onClick={setIceCandidate}>Set Ice Candidate</Button>
				</div>
			</div>
		</div>
	);
};

export default App;
