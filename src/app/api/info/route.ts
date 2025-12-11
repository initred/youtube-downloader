import { NextRequest, NextResponse } from "next/server";
import { getVideoInfo } from "@/lib/ytdlp";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json(
      { error: "URL parameter is required" },
      { status: 400 }
    );
  }

  // Validate YouTube URL
  const youtubeRegex =
    /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|v\/)|youtu\.be\/)/;
  if (!youtubeRegex.test(url)) {
    return NextResponse.json(
      { error: "Invalid YouTube URL" },
      { status: 400 }
    );
  }

  try {
    const videoInfo = await getVideoInfo(url);
    return NextResponse.json(videoInfo);
  } catch (error) {
    console.error("Error fetching video info:", error);
    return NextResponse.json(
      { error: "Failed to fetch video information" },
      { status: 500 }
    );
  }
}
