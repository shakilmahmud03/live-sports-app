'use client';

import { useEffect, useRef } from 'react';
import Hls from 'hls.js';

interface LivePlayerProps {
  streamUrl: string;
  streamType: 'hls' | 'iframe';
}

export default function LivePlayer({ streamUrl, streamType }: LivePlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (streamType === 'hls' && videoRef.current) {
      const video = videoRef.current;

      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          xhrSetup: (xhr) => {
            xhr.withCredentials = false;
          },
        });

        hls.loadSource(streamUrl);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(() => console.log('Autoplay blocked'));
        });

        return () => {
          hls.destroy();
        };
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = streamUrl;
      }
    }
  }, [streamUrl, streamType]);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black border border-slate-800 shadow-2xl">
      {streamType === 'hls' ? (
        <video
          ref={videoRef}
          controls
          autoPlay
          muted
          playsInline
          className="h-full w-full object-contain"
        />
      ) : (
        <iframe
          key={streamUrl}
          src={streamUrl}
          title="Live Stream Embed"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
          allowFullScreen
          referrerPolicy="no-referrer"
          className="h-full w-full border-0"
        />
      )}
    </div>
  );
}