/**
 * Shared interfaces
 */

import { GetChaptersQuery } from "cms-types/gql/graphql";

export interface VoiceOver {
  id: number;
  order: number;
  language: string;
  url: string;
  type: VoiceOverType;
  fileName: string;
  chapter: string;
}

export enum VoiceOverType {
  Question = "QU",
  VoiceOver = "VO",
}

export interface SoundScape {
  startsAt: VoiceOver;
  url: string;
  fileName: string;
}

export interface AudioList {
  chapters: ChapterMeta[];
  VO: VoiceOver[];
  SC: SoundScape[];
}

/**
 * Recording
 */

export interface Recording {
  language: string;
  order: number;
  questionId: string;
  fileName: string;
  fullPath: string;
}

export interface UploadedRecording extends Recording {
  uploadedFileId: string;
}

export interface RecordingMeta {
  language: string;
  boothSlug: string;
  sessionId: string;
  recordingDate: string;
  recordingTime: string;
}

/**
 * Sessions
 */

export interface Session {
  meta: RecordingMeta;
  audioList: AudioList;
  recordings: Recording[];
}

/**
 * Narrative
 */

export interface Narrative {
  introChapters: Chapter[];
  outroChapters: Chapter[];
  firstChapters: Chapter[];
  secondChapters: Chapter[];
  thirdChapters: Chapter[];
}

export interface NarrativeChapterData {
  introChapters: GetChaptersQuery;
  outroChapters: GetChaptersQuery;
  firstChapters: GetChaptersQuery;
  secondChapters: GetChaptersQuery;
  thirdChapters: GetChaptersQuery;
}

/**
 * Chapters
 */

export interface Chapter {
  id: string;
  title: string;
  soundScape: AudioCms | null;
  narrativePart: string;
  blocks?: ChapterBlock[];
}

export type ChapterMeta = Pick<Chapter, "id" | "title" | "narrativePart">;

export enum ChapterBlockType {
  Question = "QU",
  VoiceOver = "VO",
}

export interface ChapterBlock {
  type: ChapterBlockType;
  title: string;
  description: string;
  cms_id: string;
  audio: AudioCmsBlock[];
}

export interface AudioCms {
  audioUrl: string;
  ext: string;
}

export interface AudioCmsBlock extends AudioCms {
  language: string;
}

/**
 * App
 */

export interface ISetting {
  key: string;
  value: any;
}

export interface IError {
  message: string;
  where: string;
}

export enum ILogType {
  DETAIL = "detail",
  INFO = "info",
  ERROR = "error",
  WARN = "warn",
  SUCCESS = "success",
}

export interface ILog {
  time: Date;
  message: string;
  type: string;
}

export interface ILogRow extends ILog {
  id: string;
}

export interface IDoorState {
  open: boolean;
  battery: number;
}

/**
 * Proces and Notifciation
 */

export interface ProcesStatus {
  procesIsRunning: boolean;
  message?: string;
}

export enum NotifciationType {
  INFO,
  ERROR,
}

export interface Notifciation {
  message?: string;
  type: NotifciationType;
}

export type StatusCallback = (message: string) => void;

/**
 * Socket
 */

export interface SocketMessage {
  message: string;
  payload: any;
}
