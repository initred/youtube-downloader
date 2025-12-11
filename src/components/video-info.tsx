"use client";

import Image from "next/image";
import type { VideoInfo as VideoInfoType } from "@/types/video";

interface VideoInfoProps {
  video: VideoInfoType;
}

export function VideoInfo({ video }: VideoInfoProps) {
  const formatViewCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <div className="flex gap-4">
      <div className="shrink-0 relative w-48 aspect-video">
        <Image
          src={video.thumbnail}
          alt={video.title}
          fill
          className="object-cover rounded-md"
          unoptimized
        />
      </div>
      <div className="flex-1 min-w-0">
        <h2 className="font-semibold text-lg line-clamp-2 mb-2">
          {video.title}
        </h2>
        <div className="text-sm text-muted-foreground space-y-1">
          <p>{video.uploader}</p>
          <p>
            {formatViewCount(video.viewCount)} views &bull;{" "}
            {video.durationFormatted}
          </p>
        </div>
      </div>
    </div>
  );
}
