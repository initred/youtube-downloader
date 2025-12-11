import { NextRequest, NextResponse } from "next/server";
import { downloadVideo } from "@/lib/ytdlp";

export const maxDuration = 300; // 5 minutes timeout

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get("url");
  const formatId = searchParams.get("formatId");
  const type = searchParams.get("type") as "video" | "audio" | null;

  if (!url || !formatId) {
    return NextResponse.json(
      { error: "URL and formatId parameters are required" },
      { status: 400 }
    );
  }

  try {
    const isAudioOnly = type === "audio";
    const { data, filename } = await downloadVideo(url, formatId, isAudioOnly);

    const headers: HeadersInit = {
      "Content-Disposition": `attachment; filename="${encodeURIComponent(filename)}"`,
      "Content-Type": isAudioOnly ? "audio/mp4" : "video/mp4",
      "Content-Length": data.length.toString(),
    };

    return new NextResponse(new Uint8Array(data), { headers });
  } catch (error) {
    console.error("Error downloading video:", error);
    return NextResponse.json(
      { error: "Failed to download video" },
      { status: 500 }
    );
  }
}
