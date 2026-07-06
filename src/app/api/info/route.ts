import { NextRequest, NextResponse } from "next/server";
import { getVideoInfo } from "@/lib/ytdlp";

function isYouTubeUrl(url: string): boolean {
  try {
    const parsed = new URL(/^https?:\/\//i.test(url) ? url : `https://${url}`);
    const hostname = parsed.hostname
      .toLowerCase()
      .replace(/^(www|m|music|gaming)\./, "");
    return hostname === "youtube.com" || hostname === "youtu.be";
  } catch {
    return false;
  }
}

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
  if (!isYouTubeUrl(url)) {
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

    const errorMessage = error instanceof Error ? error.message : String(error);

    // Categorize errors for better user feedback
    if (errorMessage.includes("timed out")) {
      return NextResponse.json(
        { error: "Request timed out. The video may be too long or the server is busy." },
        { status: 504 }
      );
    }
    if (errorMessage.includes("Video unavailable") || errorMessage.includes("Private video")) {
      return NextResponse.json(
        { error: "This video is unavailable or private." },
        { status: 404 }
      );
    }
    if (errorMessage.includes("geo") || errorMessage.includes("country")) {
      return NextResponse.json(
        { error: "This video is not available in your region." },
        { status: 403 }
      );
    }
    if (errorMessage.includes("age") || errorMessage.includes("Sign in")) {
      return NextResponse.json(
        { error: "This video requires age verification or sign-in." },
        { status: 403 }
      );
    }
    if (errorMessage.includes("ENOENT") || errorMessage.includes("not found")) {
      return NextResponse.json(
        { error: "yt-dlp is not installed on the server." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch video information. Please check the URL and try again." },
      { status: 500 }
    );
  }
}
