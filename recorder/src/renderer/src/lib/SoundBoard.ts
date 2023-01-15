import { AudioList, SoundScape, VoiceOver } from '@shared/interfaces';
import { Howl, HowlCallback } from 'howler';

export interface OnPlayChange {
  VO: VoiceOver | undefined
  SC: SoundScape | undefined
  isLast: boolean
}

export interface OnVOEnd {
  VO: VoiceOver | undefined
  isLast: boolean
}

export interface SoundBoardParams {
  onPlayChange?: (e: OnPlayChange) => void | undefined
  onVOEnd?: (e: OnVOEnd) => void | undefined
  onStart?: () => void
  fadingTime?: number
  canContinueWhilePlaying?: boolean
}

const defaultAudioList:AudioList = {
  VO: [],
  SC: []
}

export class SoundBoard {
  _audioList: AudioList;
  _howlVOList: Howl[] | null;
  _howlSCList: Howl[] | null;
  _currentVOIndex: number;
  _currentSCIndex: number;
  _fadingTime: number;
  _canContinueWhilePlaying: boolean;
  _onPlayChange: (e: OnPlayChange) => void | undefined;
  _onVOEnd: (e: OnVOEnd) => void | undefined;
  _onStart: () => void;

  get canContinue() {
    if(this._canContinueWhilePlaying || this._currentVOIndex === -1) return true;
    return this._howlVOList ? !this._howlVOList[this._currentVOIndex].playing() : true;
  }

  constructor({
    onPlayChange = (e: OnPlayChange) => {},
    onVOEnd = (e: OnVOEnd) => {},
    onStart = () => {},
    fadingTime = 2000,
    canContinueWhilePlaying = false
  }: SoundBoardParams) {
    this._audioList = defaultAudioList;
    this._howlVOList = null;
    this._howlSCList = null;
    this._currentVOIndex = -1;
    this._currentSCIndex = -1;
    this._fadingTime = fadingTime;
    this._onPlayChange = onPlayChange;
    this._onVOEnd = onVOEnd;
    this._onStart = onStart;
    this._canContinueWhilePlaying = canContinueWhilePlaying;
  }

  async init() {
    this._audioList = await window.rumor.methods.getAudioList();
    this._howlVOList = this._audioList.VO.map(({ url }) => new Howl({
      src: url,
      onend: () => {
        const isLast = this._audioList ? this._currentVOIndex === this._audioList.VO.length - 1 : false;
        if(isLast) { this.fadeOutCurrentSC(() => { this.stop(); this.reset(); }) };
        this._onVOEnd({
          VO: this._audioList?.VO[this._currentVOIndex],
          isLast
        });
      }
    }));
    this._howlSCList = this._audioList.SC.map(({ url }) => new Howl({ src: url }));
  }

  async refetch() {
    this.stop();
    this.init();
  }

  crossFadeSC(oldIndex: number, newIndex: number) {
    if(this._howlSCList) {
      if(this._howlSCList[oldIndex] !== undefined) {
        this._howlSCList[oldIndex].fade(1, 0, this._fadingTime);
      }
      if(this._howlSCList[newIndex] !== undefined) {
       this._howlSCList[newIndex].play();
       this._howlSCList[newIndex].fade(0, 1, this._fadingTime);
      }
    }
  }

  fadeOutCurrentSC(onFade?: HowlCallback) {
    if(this._howlSCList && this._currentSCIndex !== -1) {
      if(onFade) this._howlSCList[this._currentSCIndex].once('fade', onFade);
      this._howlSCList[this._currentSCIndex].fade(1, 0, this._fadingTime);
    }
  }

  playNextVO() {
    if(this._howlVOList &&
       this.canContinue
    ) {
      // increment the index of the VO
      this._currentVOIndex++;

      // if we are playing the first in line
      if(this._currentVOIndex === 0) this._onStart();

      // reset whenever we reach the end of the list
      if(this._currentVOIndex >= this._howlVOList.length) {
        this.stop();
        this._currentVOIndex = -1;
        return;
      }

      // play the next voice over
      this._howlVOList[this._currentVOIndex].play();

      // do we need to crossfade the SC?
      const scIndexToStart = this._audioList?.SC.findIndex(sc => sc.startsAt === this._currentVOIndex + 1);

      // if we have something to play, crossfade
      if(scIndexToStart !== undefined && scIndexToStart >= 0) {
        this.crossFadeSC(this._currentSCIndex, scIndexToStart)
        this._currentSCIndex = scIndexToStart;
      }

      if(this._onPlayChange !== undefined) this._onPlayChange({
        VO: this._audioList?.VO[this._currentVOIndex],
        SC: this._audioList?.SC[this._currentSCIndex],
        isLast: this._audioList ? this._currentVOIndex === this._audioList.VO.length - 1 : false
      })
    }
  }

  reset() {
    if(this._onPlayChange !== undefined) this._onPlayChange({
      VO: undefined,
      SC: undefined,
      isLast: false
    })
  }

  stop() {
    this._howlSCList?.forEach((sc) => sc.stop());
    this._howlVOList?.forEach((vo) => vo.stop());
    this._currentVOIndex = -1;
    this._currentSCIndex = -1;
  }
}