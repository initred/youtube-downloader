"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UrlInput } from "@/components/url-input";
import { VideoInfo } from "@/components/video-info";
import { FormatSelector } from "@/components/format-selector";
import { DownloadButton } from "@/components/download-button";
import { convertToMp3, downloadBlob } from "@/lib/ffmpeg";
import type {
  VideoInfo as VideoInfoType,
  VideoFormat,
  FormatType,
  DownloadProgress,
} from "@/types/video";

export default function Home() {
  const [videoInfo, setVideoInfo] = useState<VideoInfoType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formatType, setFormatType] = useState<FormatType>("mp4");
  const [selectedFormat, setSelectedFormat] = useState<VideoFormat | null>(
    null
  );
  const [currentUrl, setCurrentUrl] = useState<string>("");
  const [progress, setProgress] = useState<DownloadProgress>({
    status: "idle",
    progress: 0,
    message: "",
  });

  // Reset selected format when format type changes
  useEffect(() => {
    if (videoInfo) {
      const formats =
        formatType === "mp4" ? videoInfo.videoFormats : videoInfo.audioFormats;
      setSelectedFormat(formats[0] || null);
    }
  }, [formatType, videoInfo]);

  const handleSearch = async (url: string) => {
    setIsLoading(true);
    setError(null);
    setVideoInfo(null);
    setCurrentUrl(url);
    setProgress({ status: "idle", progress: 0, message: "" });

    try {
      const response = await fetch(`/api/info?url=${encodeURIComponent(url)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch video info");
      }

      setVideoInfo(data);
      // Set default format
      const defaultFormat =
        formatType === "mp4" ? data.videoFormats[0] : data.audioFormats[0];
      setSelectedFormat(defaultFormat || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!videoInfo || !selectedFormat || !currentUrl) return;

    setProgress({
      status: "downloading",
      progress: 0,
      message: "Starting download...",
    });

    try {
      if (formatType === "mp4") {
        // Direct download for MP4
        setProgress({
          status: "downloading",
          progress: 50,
          message: "Downloading video...",
        });

        const downloadUrl = `/api/download?url=${encodeURIComponent(
          currentUrl
        )}&formatId=${selectedFormat.formatId}&type=video`;

        const response = await fetch(downloadUrl);
        if (!response.ok) throw new Error("Download failed");

        const blob = await response.blob();
        const safeTitle = videoInfo.title.replace(/[<>:"/\\|?*]/g, "_");
        downloadBlob(blob, `${safeTitle}.mp4`);

        setProgress({
          status: "complete",
          progress: 100,
          message: "Download complete!",
        });
      } else {
        // MP3: Download audio then convert
        setProgress({
          status: "downloading",
          progress: 10,
          message: "Downloading audio...",
        });

        const downloadUrl = `/api/download?url=${encodeURIComponent(
          currentUrl
        )}&formatId=${selectedFormat.formatId}&type=audio`;

        const response = await fetch(downloadUrl);
        if (!response.ok) throw new Error("Download failed");

        const audioBuffer = await response.arrayBuffer();
        const audioData = new Uint8Array(audioBuffer);

        setProgress({
          status: "converting",
          progress: 30,
          message: "Preparing MP3 conversion...",
        });

        // Get bitrate from selected format
        const bitrate = selectedFormat.tbr || 128;

        const mp3Blob = await convertToMp3(
          audioData,
          bitrate,
          (percent, message) => {
            setProgress({
              status: "converting",
              progress: percent,
              message,
            });
          }
        );

        const safeTitle = videoInfo.title.replace(/[<>:"/\\|?*]/g, "_");
        downloadBlob(mp3Blob, `${safeTitle}.mp3`);

        setProgress({
          status: "complete",
          progress: 100,
          message: "Download complete!",
        });
      }
    } catch (err) {
      console.error("Download error:", err);
      setProgress({
        status: "error",
        progress: 0,
        message: err instanceof Error ? err.message : "Download failed",
      });
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
              <Image
                src="/logo.png"
                alt="Logo"
                width={32}
                height={32}
                className="w-8 h-8 object-contain"
              />
              YouTube Downloader
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <UrlInput onSearch={handleSearch} isLoading={isLoading} />

            {error && (
              <p className="text-sm text-destructive text-center">{error}</p>
            )}

            {videoInfo && (
              <>
                <hr className="border-border" />

                <VideoInfo video={videoInfo} />

                <hr className="border-border" />

                <FormatSelector
                  formatType={formatType}
                  onFormatTypeChange={setFormatType}
                  videoFormats={videoInfo.videoFormats}
                  audioFormats={videoInfo.audioFormats}
                  selectedFormat={selectedFormat}
                  onFormatChange={setSelectedFormat}
                />

                <DownloadButton
                  progress={progress}
                  onDownload={handleDownload}
                  disabled={!selectedFormat}
                />
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
