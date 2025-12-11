# YouTube Downloader

A web application that allows you to download YouTube videos as MP4 (video) or MP3 (audio).

## Features

- Fetch video information by entering a YouTube URL
- MP4 download (with quality selection)
- MP3 download (with bitrate selection, converted in browser)

## Tech Stack

- **Runtime**: Bun
- **Framework**: Next.js 16 (App Router)
- **UI**: shadcn/ui + Tailwind CSS
- **YouTube Extraction**: yt-dlp
- **Audio Conversion**: FFmpeg.wasm

## Running with Docker

### Build and Run

```bash
# Using docker compose (recommended)
docker compose up -d --build

# Or using docker only
docker build -t youtube-downloader .
docker run -p 3000:3000 youtube-downloader
```

### Access

http://localhost:3000

### Stop Container

```bash
docker compose down
```

## Local Development

### Prerequisites

- [Bun](https://bun.sh/)
- [yt-dlp](https://github.com/yt-dlp/yt-dlp)
- [FFmpeg](https://ffmpeg.org/)

### Installation and Running

```bash
# Install dependencies
bun install

# Run development server
bun run dev

# Build
bun run build

# Run production
bun run start
```

## Disclaimer

**All legal responsibility for using this program lies with the user.**

- This program should only be used for educational and personal purposes.
- Downloading copyrighted content without permission is a violation of copyright law.
- Please comply with YouTube's Terms of Service.
- The copyright of downloaded content belongs to the original creator. Unauthorized distribution and commercial use may result in legal action.
- The developer is not responsible for any legal issues arising from misuse of this program.

## License

MIT
