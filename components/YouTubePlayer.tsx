import { useEffect, useRef } from 'react';
import YouTube, { YouTubeProps, YouTubePlayer } from 'react-youtube';

interface YouTubePlayerProps {
  videoId: string;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  onReady: (player: YouTubePlayer) => void;
  onStateChange: (event: { target: YouTubePlayer; data: number }) => void;
  onStreamError: () => void;
}

export default function YouTubePlayer({ videoId, isPlaying, volume, isMuted, onReady, onStateChange, onStreamError }: YouTubePlayerProps) {
  const playerRef = useRef<YouTubePlayer | null>(null);

  // Handle player ready event
  const handleReady = (event: { target: YouTubePlayer }) => {
    playerRef.current = event.target;
    onReady(event.target);
    
    // Set initial volume
    event.target.setVolume(volume);
    if (isMuted) {
      event.target.mute();
    }
  };

  // Control player based on props changes
  useEffect(() => {
    if (!playerRef.current) return;
    
    if (isPlaying) {
      playerRef.current.playVideo();
    } else {
      playerRef.current.pauseVideo();
    }
  }, [isPlaying]);

  // Handle changing of volume
  useEffect(() => {
    if (!playerRef.current) return;
    playerRef.current.setVolume(volume);
  }, [volume]);

  // Handle mute/unmute
  useEffect(() => {
    if (!playerRef.current) return;
    if (isMuted) {
      playerRef.current.mute();
    } else {
      playerRef.current.unMute();
    }
  }, [isMuted]);

  // This function handles errors from the YouTube player.
  const handleError = (event: { target: YouTubePlayer; data: number }) => {
    const error = event.data;
    // These error codes indicate that the video is unavailable.
    // 2: Invalid video ID
    // 5: HTML5 player error
    // 100: Video not found
    // 101: Video not embeddable
    // 150: Same as 101, just a different name
    if ([2, 5, 100, 101, 150].includes(error)) {
      // This comment explains that the onStreamError function is called when a stream fails to load.
      onStreamError();
    }
  };

  // Parameters come from Youtube Iframe API docs
  const opts: YouTubeProps['opts'] = {
    height: '0',  // Hidden player frames
    width: '0',   // Hidden player frames
    playerVars: {
      autoplay: isPlaying ? 1 : 0,
      controls: 0, // Hide the video player controls
      disablekb: 1, // turn off keyboard controls for player itself
      fs: 0, // turn off the fullscreen button in player
      iv_load_policy: 3, // Hide annotations
      rel: 0, // do not show related videos
    },
  };

  return (
    <div className="hidden"> 
      <YouTube
        videoId={videoId}
        opts={opts}
        onReady={handleReady}
        onStateChange={onStateChange}
        onError={handleError}
      />
    </div>
  );
}