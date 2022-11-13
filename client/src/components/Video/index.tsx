import { forwardRef } from 'react';

const Video = forwardRef<HTMLVideoElement>((_, ref) => {
	return (
		<div className='aspect-w-10 aspect-h-6 w-full bg-black'>
			<video ref={ref} autoPlay controls />
		</div>
	);
});

export default Video;
