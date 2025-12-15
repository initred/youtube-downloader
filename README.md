<div align="center">

# YouTube Downloader

**Self-hosted YouTube video downloader with a clean web UI**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue)](https://www.docker.com/)
[![yt-dlp](https://img.shields.io/badge/yt--dlp-Powered-red)](https://github.com/yt-dlp/yt-dlp)

[Features](#features) • [Quick Start](#quick-start) • [Docker](#running-with-docker) • [Development](#local-development)

![Screenshot](screenshot.png)

</div>

## Features

- **Video Download** - Download YouTube videos in MP4 format with quality selection
- **Audio Extract** - Convert to MP3 with bitrate options (browser-based conversion)
- **Clean UI** - Modern, responsive interface built with shadcn/ui
- **Self-Hosted** - Full control over your data, no third-party services
- **Docker Ready** - One-command deployment with Docker Compose

## Quick Start

**Using Docker Compose:**

```bash
docker compose up -d
```

Then open http://localhost:3000

## Tech Stack

| Category           | Technology                                                                     |
| ------------------ | ------------------------------------------------------------------------------ |
| Runtime            | [Bun](https://bun.sh/)                                                         |
| Framework          | [Next.js 16](https://nextjs.org/) (App Router)                                 |
| UI                 | [shadcn/ui](https://ui.shadcn.com/) + [Tailwind CSS](https://tailwindcss.com/) |
| YouTube Extraction | [yt-dlp](https://github.com/yt-dlp/yt-dlp)                                     |
| Audio Conversion   | [FFmpeg.wasm](https://ffmpegwasm.netlify.app/)                                 |

## Running with Docker

### Production

```bash
# Clone the repository
git clone https://github.com/initred/youtube-downloader.git
cd youtube-downloader

# Build and run
docker compose up -d --build
```

### Development (with hot reload)

```bash
# Run development mode with source mounting
docker compose -f docker-compose.dev.yml up --build
```

Code changes in `src/` and `public/` will be automatically reflected.

### Using Docker Only

```bash
docker build -t youtube-downloader .
docker run -p 3000:3000 youtube-downloader
```

### Access

Open http://localhost:3000 in your browser.

### Stop Container

```bash
docker compose down
```

## System Requirements

### For Docker (Recommended)

- Docker 20.10+
- Docker Compose v2+
- 512MB RAM minimum
- 1GB disk space

### For Local Development

- [Bun](https://bun.sh/) 1.0+
- [yt-dlp](https://github.com/yt-dlp/yt-dlp)
- [FFmpeg](https://ffmpeg.org/)
- Python 3.9+ (for yt-dlp)

## Local Development

### Prerequisites

- [Bun](https://bun.sh/)
- [yt-dlp](https://github.com/yt-dlp/yt-dlp)
- [FFmpeg](https://ffmpeg.org/)

### Installation

```bash
# Install dependencies
bun install

# Run development server
bun run dev

# Build for production
bun run build

# Run production server
bun run start
```

## API Reference

### Get Video Info

```
GET /api/info?url=<YouTube URL>
```

**Response:**

```json
{
  "id": "dQw4w9WgXcQ",
  "title": "Video Title",
  "thumbnail": "https://...",
  "duration": 212,
  "durationFormatted": "3:32",
  "uploader": "Channel Name",
  "viewCount": 1000000,
  "videoFormats": [...],
  "audioFormats": [...]
}
```

### Download Video

```
GET /api/download?url=<YouTube URL>&formatId=<Format ID>&type=video|audio
```

Returns the video/audio file as a binary stream.

## Troubleshooting

### "yt-dlp is not installed"

```bash
# macOS
brew install yt-dlp

# Linux
pip3 install yt-dlp

# Windows
winget install yt-dlp
```

### "FFmpeg error" or audio conversion fails

```bash
# macOS
brew install ffmpeg

# Linux
sudo apt-get install ffmpeg

# Windows
winget install ffmpeg
```

### "Video unavailable" or "Private video"

- The video may be private, deleted, or region-restricted
- Try a different video URL

### Download times out

- Large videos (>1 hour) may take longer to process
- The default timeout is 5 minutes

## Disclaimer

**All legal responsibility for using this program lies with the user.**

- This program should only be used for educational and personal purposes.
- Downloading copyrighted content without permission is a violation of copyright law.
- Please comply with YouTube's Terms of Service.
- The copyright of downloaded content belongs to the original creator.
- The developer is not responsible for any legal issues arising from misuse of this program.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## License

[MIT](LICENSE) - feel free to use this project for personal or commercial purposes.
