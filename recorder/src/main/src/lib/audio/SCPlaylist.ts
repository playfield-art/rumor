import { SoundScape, VoiceOver } from "@shared/interfaces";

export default class SCPlaylist {
  private soundscapes: SoundScape[] = [];

  constructor(soundscapes: SoundScape[]) {
    this.soundscapes = soundscapes;
  }

  getSCCorrespondingToVoiceOver(voiceOver: VoiceOver): SoundScape | undefined {
    const soundscapeToPlay = this.soundscapes.find(
      (s) =>
        s.startsAt.id === voiceOver.id && s.startsAt.order === voiceOver.order
    );
    return soundscapeToPlay;
  }
}
