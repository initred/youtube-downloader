export interface VideoFormat {
  formatId: string;
  ext: string;
  resolution: string | null;
  filesize: number | null;
  tbr: number | null; // total bitrate
  vcodec: string | null;
  acodec: string | null;
  fps: number | null;
}

export interface VideoInfo {
  id: string;
  title: string;
  thumbnail: string;
  duration: number;
  durationFormatted: string;
  uploader: string;
  viewCount: number;
  videoFormats: VideoFormat[];
  audioFormats: VideoFormat[];
}

export interface DownloadProgress {
  status: "idle" | "downloading" | "converting" | "complete" | "error";
  progress: number;
  message: string;
}

export type FormatType = "mp4" | "mp3";
