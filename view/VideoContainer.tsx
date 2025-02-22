import * as React from "react";
import { useRef, useState } from 'react';

import ReactPlayer from 'react-player/lazy'


export interface VideoContainerProps {
	url: string;
	start: number
	setupPlayer: (player: ReactPlayer, setPlaying: React.Dispatch<React.SetStateAction<boolean>>) => void;
	setupError: (err: string) => void;
}

export const VideoContainer = ({ url, setupPlayer, start, setupError }: VideoContainerProps): JSX.Element => {
	// Reference to player passed back to the setupPlayer prop
	const playerRef = useRef<ReactPlayer>();

	const [playing, setPlaying] = useState(true)

	const onReady = () => {
		// Starts player at last played time if the video has been played before
		if (start) playerRef.current.seekTo(start);

		// Sets up video player to be accessed in main.ts
		if (playerRef) setupPlayer(playerRef.current, setPlaying);
	}

	return (
		<>
			<ReactPlayer
				ref={playerRef}
				url={url}
                playing={playing}
                config={{
                    file: {
                        tracks: [
                            { kind: 'subtitles', src: 'subs/subtitles.en.vtt', srcLang: 'en', default: true },
                            { kind: 'subtitles', src: 'subs/subtitles.ja.vtt', srcLang: 'ja' },
                            { kind: 'subtitles', src: 'subs/subtitles.de.vtt', srcLang: 'de' }
                        ]
                    }
                }
				console.log({url})
				controls={true}
				width='100%'
				height='95%'
				onReady={onReady}
				onError={(err) => setupError(err ?
					err.message :
					`Video is unplayable due to privacy settings, streaming permissions, etc.`)} // Error handling for invalid URLs
			/>
		</>
	)
};
