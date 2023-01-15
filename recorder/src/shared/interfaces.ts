/**
 * Shared interfaces
 */

export interface VoiceOver {
  id: number
  name: string
  url: string
  fileName: string
}

export interface SoundScape {
  id: number
  startsAt: number
  url: string
  fileName: string
  name: string
}

export interface AudioList {
  VO: VoiceOver[]
  SC: SoundScape[]
}

export interface ISetting {
  key: string;
  value: string;
}

export interface IError {
  message: string;
  where: string;
}
