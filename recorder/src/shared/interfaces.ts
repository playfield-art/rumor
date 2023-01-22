/**
 * Shared interfaces
 */

export interface VoiceOver {
  id: number
  order: number
  language: string
  url: string
  type: VoiceOverType,
  fileName: string
  chapter: string
}

export enum VoiceOverType {
  Question = "QU",
  VoiceOver = "VO"
}

export interface SoundScape {
  startsAt: VoiceOver
  url: string
  fileName: string
}

export interface AudioList {
  VO: VoiceOver[]
  SC: SoundScape[]
}

/**
 * Recording
 */

export interface Recording {
  language: string
  order: number
  questionId: string
  fileName: string
  fullPath: string
}

export interface RecordingMeta {
  boothId: string
  sessionId: string
  recordingDate: string
  recordingTime: string
}

/**
 * Sessions
 */

export interface Session {
  meta: RecordingMeta
  recordings: Recording[]
}

/**
 * Narrative
 */

export interface Narrative {
  introChapters: Chapter[]
  outroChapters: Chapter[]
  firstChapters: Chapter[]
  secondChapters: Chapter[]
  thirdChapters: Chapter[]
}

/**
 * Chapters
 */

export interface Chapter {
  title: string
  soundScape: AudioCms | null
  narrativePart: string
  blocks?: ChapterBlock[]
}

export enum ChapterBlockType {
  Question = 'QU',
  VoiceOver = 'VO'
}

export interface ChapterBlock {
  type: ChapterBlockType,
  title: string,
  description: string,
  cms_id: string,
  audio: AudioCmsBlock[]
}

export interface AudioCms {
  audioUrl: string
  ext: string
}

export interface AudioCmsBlock extends AudioCms {
  language: string
}

/**
 * App
 */

export interface ISetting {
  key: string;
  value: string;
}

export interface IError {
  message: string;
  where: string;
}
