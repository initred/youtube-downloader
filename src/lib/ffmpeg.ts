"use client";

import { FFmpeg } from "@ffmpeg/ffmpeg";

let ffmpeg: FFmpeg | null = null;
let loadPromise: Promise<FFmpeg> | null = null;

export async function loadFFmpeg(
  onProgress?: (message: string) => void
): Promise<FFmpeg> {
  if (ffmpeg?.loaded) {
    return ffmpeg;
  }

  if (loadPromise) {
    return loadPromise;
  }

  loadPromise = (async () => {
    const ff = new FFmpeg();

    ff.on("log", ({ message }) => {
      console.log("[FFmpeg]", message);
    });

    onProgress?.("Loading FFmpeg...");

    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";

    await ff.load({
      coreURL: `${baseURL}/ffmpeg-core.js`,
      wasmURL: `${baseURL}/ffmpeg-core.wasm`,
    });

    onProgress?.("FFmpeg ready");
    ffmpeg = ff;
    return ff;
  })();

  return loadPromise;
}

export async function convertToMp3(
  audioData: Uint8Array,
  bitrate: number,
  onProgress?: (progress: number, message: string) => void
): Promise<Blob> {
  const ff = await loadFFmpeg((msg) => onProgress?.(0, msg));

  onProgress?.(10, "Preparing file...");

  // Write input file
  await ff.writeFile("input.m4a", audioData);

  // Set up progress handler
  ff.on("progress", ({ progress }) => {
    const percent = Math.round(progress * 80) + 10; // 10-90%
    onProgress?.(percent, "Converting to MP3...");
  });

  onProgress?.(15, "Starting MP3 conversion...");

  // Convert to MP3
  await ff.exec([
    "-i",
    "input.m4a",
    "-vn",
    "-acodec",
    "libmp3lame",
    "-b:a",
    `${bitrate}k`,
    "output.mp3",
  ]);

  onProgress?.(95, "Conversion complete, preparing file...");

  // Read output file
  const data = await ff.readFile("output.mp3");

  // Clean up
  await ff.deleteFile("input.m4a");
  await ff.deleteFile("output.mp3");

  onProgress?.(100, "Complete!");

  // Convert FileData to Blob properly
  if (typeof data === "string") {
    throw new Error("Unexpected string data from FFmpeg");
  }
  // Type assertion needed due to FFmpeg.wasm types vs modern TypeScript
  return new Blob([data as BlobPart], { type: "audio/mpeg" });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
