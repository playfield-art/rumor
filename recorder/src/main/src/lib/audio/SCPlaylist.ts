import { SoundScape, VoiceOver } from "@shared/interfaces";

export interface SCPlaylistOptions {
  onNext?: (soundscape: SoundScape) => void;
}

export default class SCPlaylist {
  private soundscapes: SoundScape[] = [];

  private options: SCPlaylistOptions = {
    onNext: () => {},
  };

  constructor(soundscapes: SoundScape[], options?: SCPlaylistOptions) {
    this.soundscapes = soundscapes;
    this.options = { ...this.options, ...options };
  }

  triggerNextWhenVoiceOverDone(voiceOver: VoiceOver) {
    const soundscapeToPlay = this.soundscapes.find(
      (s) => s.startsAt.id === voiceOver.id
    );

    if (soundscapeToPlay) {
      if (this.options.onNext) this.options.onNext(soundscapeToPlay);
    }
  }
}
