import { Howl } from "howler";
import { FADING_TIME } from "../consts";

interface AudioPlayerItem {
  url: string;
  player: Howl | null;
  isPlaying: boolean;
  soundId: number;
}

export class AudioPlayer {
  private static _players: AudioPlayerItem[] = [];

  /**
   * Plays a sound.
   * @param url The url of the sound to play.
   */
  public static play(url: string) {
    // fade out the playing sound
    // do not wait until it is done, we need to play the new sound
    this.fadeOutPlayingSound();

    // create the Howl player
    const player = new Howl({
      src: [url],
      autoplay: true,
      loop: true,
      volume: 0,
    });

    // create the player item
    const playerItem = {
      url,
      player,
      isPlaying: true,
      soundId: player.play(),
    };

    // fade in the player
    player.fade(0, 1, FADING_TIME);

    // add the player to the list
    this._players.push(playerItem);
  }

  /**
   * Clearn up the sound from the list of players.
   * @param soundId The sound id to clean up.
   * @returns void
   */
  private static cleanUpSound(soundId: number) {
    if (this._players) {
      const audioPlayerIdx = this._players.findIndex(
        (p) => p.soundId === soundId
      );
      const audioPlayer = this._players[audioPlayerIdx];
      if (!audioPlayer || !audioPlayer.player) return;
      audioPlayer.player.stop();
      audioPlayer.player.unload();
      audioPlayer.player = null;
      this._players.splice(audioPlayerIdx, 1);
    }
  }

  /**
   * Clean up all the players.
   */
  public static cleanUp() {
    if (this._players) {
      this._players.forEach((p) => {
        if (!p.player) return;
        p.player.stop();
        p.player.unload();
      });
      this._players = [];
    }
  }

  /**
   * Fade out the playing sound.
   * @returns
   */
  public static async fadeOutPlayingSound() {
    return new Promise<void>((resolve, reject) => {
      try {
        // find the playing player in _players
        const playingPlayer = this._players.find((p) => p.isPlaying);

        // if we have an existing player, fade it out
        if (playingPlayer && playingPlayer.player) {
          playingPlayer.player.fade(1, 0, FADING_TIME);
          playingPlayer.isPlaying = false;
          playingPlayer.player.once("fade", (id) => {
            this.cleanUpSound(id);
            resolve();
          });
        }
      } catch (e) {
        reject(e);
      }
    });
  }
}
