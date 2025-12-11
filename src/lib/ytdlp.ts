import { exec } from "child_process";
import { promisify } from "util";
import type { VideoInfo, VideoFormat } from "@/types/video";

const execAsync = promisify(exec);

interface YtDlpFormat {
  format_id: string;
  ext: string;
  resolution?: string;
  height?: number;
  width?: number;
  filesize?: number;
  filesize_approx?: number;
  tbr?: number;
  abr?: number;
  vcodec?: string;
  acodec?: string;
  fps?: number;
  format_note?: string;
}

interface YtDlpOutput {
  id: string;
  title: string;
  thumbnail: string;
  duration: number;
  uploader: string;
  view_count: number;
  formats: YtDlpFormat[];
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

function parseFormats(formats: YtDlpFormat[]): {
  videoFormats: VideoFormat[];
  audioFormats: VideoFormat[];
} {
  const videoFormats: VideoFormat[] = [];
  const audioFormats: VideoFormat[] = [];
  const seenResolutions = new Set<string>();
  const seenBitrates = new Set<number>();

  // Sort by quality (higher first)
  const sortedFormats = [...formats].sort((a, b) => {
    const aHeight = a.height || 0;
    const bHeight = b.height || 0;
    return bHeight - aHeight;
  });

  for (const format of sortedFormats) {
    const hasVideo = format.vcodec && format.vcodec !== "none";
    const hasAudio = format.acodec && format.acodec !== "none";

    if (hasVideo && format.height) {
      const resolution = `${format.height}p`;
      if (!seenResolutions.has(resolution) && format.ext === "mp4") {
        seenResolutions.add(resolution);
        videoFormats.push({
          formatId: format.format_id,
          ext: format.ext,
          resolution,
          filesize: format.filesize || format.filesize_approx || null,
          tbr: format.tbr || null,
          vcodec: format.vcodec || null,
          acodec: format.acodec || null,
          fps: format.fps || null,
        });
      }
    } else if (hasAudio && !hasVideo) {
      const bitrate = Math.round(format.abr || format.tbr || 0);
      if (bitrate > 0 && !seenBitrates.has(bitrate)) {
        seenBitrates.add(bitrate);
        audioFormats.push({
          formatId: format.format_id,
          ext: format.ext,
          resolution: `${bitrate}kbps`,
          filesize: format.filesize || format.filesize_approx || null,
          tbr: bitrate,
          vcodec: null,
          acodec: format.acodec || null,
          fps: null,
        });
      }
    }
  }

  // Sort audio by bitrate (higher first)
  audioFormats.sort((a, b) => (b.tbr || 0) - (a.tbr || 0));

  return { videoFormats, audioFormats };
}

export async function getVideoInfo(url: string): Promise<VideoInfo> {
  const { stdout } = await execAsync(
    `yt-dlp --dump-json --no-warnings "${url}"`,
    { maxBuffer: 10 * 1024 * 1024 }
  );

  const data: YtDlpOutput = JSON.parse(stdout);
  const { videoFormats, audioFormats } = parseFormats(data.formats);

  return {
    id: data.id,
    title: data.title,
    thumbnail: data.thumbnail,
    duration: data.duration,
    durationFormatted: formatDuration(data.duration),
    uploader: data.uploader,
    viewCount: data.view_count,
    videoFormats,
    audioFormats,
  };
}

export async function downloadVideo(
  url: string,
  formatId: string,
  isAudioOnly: boolean
): Promise<{ data: Buffer; filename: string }> {
  const { spawn } = await import("child_process");

  // Get video info first for the title
  const { stdout: infoJson } = await execAsync(
    `yt-dlp --dump-json --no-warnings "${url}"`,
    { maxBuffer: 10 * 1024 * 1024 }
  );

  const info = JSON.parse(infoJson);
  const ext = isAudioOnly ? "m4a" : "mp4";
  const safeTitle = info.title.replace(/[<>:"/\\|?*]/g, "_");
  const filename = `${safeTitle}.${ext}`;

  // Download using yt-dlp and pipe to stdout
  const formatArg = isAudioOnly ? `-f ${formatId}` : `-f ${formatId}+bestaudio`;

  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];

    const args = [
      ...formatArg.split(" "),
      "-o", "-",
      url,
    ];

    // Only add merge-output-format for video (not audio)
    if (!isAudioOnly) {
      args.splice(2, 0, "--merge-output-format", "mp4");
    }

    const ytdlp = spawn("yt-dlp", args);

    ytdlp.stdout.on("data", (chunk: Buffer) => {
      chunks.push(chunk);
    });

    ytdlp.stderr.on("data", (data: Buffer) => {
      console.log("[yt-dlp]", data.toString());
    });

    ytdlp.on("error", (error) => {
      reject(error);
    });

    ytdlp.on("close", (code) => {
      if (code === 0) {
        resolve({
          data: Buffer.concat(chunks),
          filename,
        });
      } else {
        reject(new Error(`yt-dlp exited with code ${code}`));
      }
    });
  });
}
