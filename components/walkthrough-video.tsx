'use client';

import { useState } from 'react';
import { AUTHRAIL } from '@/lib/constants';

export function WalkthroughVideo() {
  const [failed, setFailed] = useState(false);

  return (
    <figure className="walkthrough-video">
      <video
        controls
        crossOrigin="anonymous"
        playsInline
        preload="metadata"
        poster="/screenshots/reference-chat-entry.jpg"
        tabIndex={0}
        aria-label="AuthRail demonstration"
        aria-describedby="walkthrough-video-help"
        onError={() => setFailed(true)}
      >
        <source src={AUTHRAIL.walkthroughVideo} type="video/mp4" onError={() => setFailed(true)} />
        <track
          kind="captions"
          src="/captions/authrail-walkthrough.en.vtt"
          srcLang="en"
          label="English (automatic)"
          default
        />
        Your browser cannot play this video. Use the recording link below.
      </video>
      <figcaption id="walkthrough-video-help">
        English captions are automatic and may contain transcription errors.
        {' '}<a href={AUTHRAIL.walkthroughVideo}>Open video</a>.
      </figcaption>
      {failed && <p role="alert">The video could not load. Use the link above to open it directly.</p>}
    </figure>
  );
}
