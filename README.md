# Audio Mixer

<div align="center">

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react)](https://reactjs.org/)
[![CI](https://github.com/eyevinn/audio-mixer/workflows/CI/badge.svg)](https://github.com/eyevinn/audio-mixer/actions)

**A professional, browser-based digital audio mixer for real-time audio processing and routing**

[Demo](#demo) • [Features](#features) • [Quick Start](#quick-start) • [Documentation](#documentation) • [Contributing](#contributing)

</div>

## Overview

Audio Mixer is a sophisticated web-based digital audio mixing console designed for professional audio engineers, broadcasters, and content creators. Built with React and TypeScript, it provides a comprehensive set of tools for real-time audio processing, routing, and monitoring through an intuitive browser interface.

### Key Capabilities

- **Professional Audio Processing**: Multi-band EQ, compression, gain control, and real-time audio metering
- **Flexible Routing**: Complex audio input/output routing with mix management
- **Real-time Control**: WebSocket-based communication for low-latency audio control
- **Advanced Monitoring**: EBU loudness metering, peak level monitoring, and pre-fader listening
- **Responsive Design**: Works seamlessly across desktop and tablet devices

## Features

### 🎛️ Audio Strip Management
- Individual audio input strips with configurable routing
- Volume faders with mute functionality
- Pre-fader listening (PFL) monitoring
- Real-time audio level meters and peak detection

### 🎚️ Mix Management  
- Create and manage multiple audio mixes
- Flexible input source routing (strips and other mixes)
- Pre/post fader input selection
- Complex mix routing capabilities

### 🔊 Output Management
- Route audio to various outputs with full control
- EBU R128 loudness metering support
- Peak level monitoring with configurable thresholds
- Pre/post fader output selection

### ⚡ Audio Processing
- **Parametric EQ**: Multi-band equalizer with various filter types
- **Dynamic Range Compressor**: Full-featured compressor with attack, release, ratio, threshold
- **Mid-Side Processing**: Advanced stereo processing capabilities
- **Gain and Pan Controls**: Precise audio level and stereo positioning

### 💾 Configuration Management
- Save and load complete mixer configurations
- Export/import settings as JSON files
- Persistent user preferences

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- A compatible audio backend server (WebSocket-based)

### Installation

```bash
# Clone the repository
git clone https://github.com/eyevinn/audio-mixer.git
cd audio-mixer

# Install dependencies
npm install

# Copy environment template
cp .env.local.sample .env.local
```

### Configuration

Edit `.env.local` with your settings:

```bash
# WebSocket URL for audio backend connection
REACT_APP_WS_URL=ws://localhost:8080

# Enable debug mode for development
REACT_APP_DEBUG_MODE=true

# Logging level (0=none, 1=basic, 2=colored, 3=verbose)
REACT_APP_DEV_LOGGER_LEVEL=2
```

### Development

```bash
# Start development server
npm run start

# Run linting
npm run lint

# Run type checking
npm run typecheck

# Format code
npm run pretty
```

The application will be available at `http://localhost:3000`.

### Production Deployment

#### Docker

```bash
# Build Docker image
docker build -t audio-mixer .

# Run with docker-compose
docker-compose up
```

#### Manual Build

```bash
# Build for production
npm run build

# Serve static files (example with serve)
npx serve -s build
```

## Architecture

The Audio Mixer follows a modern React architecture with real-time capabilities:

```
┌─────────────────┐    WebSocket    ┌──────────────────┐
│   Browser App   │ ◄─────────────► │  Audio Backend   │
│   (React/TS)    │                 │     Server       │
└─────────────────┘                 └──────────────────┘
        │                                    │
        ▼                                    ▼
┌─────────────────┐                 ┌──────────────────┐
│  Audio Controls │                 │  Audio Hardware  │
│   & Metering    │                 │   & Processing   │
└─────────────────┘                 └──────────────────┘
```

### Key Components

- **WebSocket Manager**: Real-time bi-directional communication
- **Audio Context**: Global state management for audio parameters
- **Component Library**: Reusable audio-specific UI components
- **Real-time Metering**: 100ms sampling for audio level visualization

## Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `REACT_APP_WS_URL` | WebSocket URL for backend connection | - | Yes |
| `REACT_APP_DEBUG_MODE` | Enable debug logging and features | `false` | No |
| `REACT_APP_DEV_LOGGER_LEVEL` | Logging verbosity (0-3) | `1` | No |

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

*Note: WebAudio API and WebSocket support required*

## License

This project is licensed under the **GNU Affero General Public License v3.0 (AGPL-3.0)**.

### What this means:

- ✅ **Freedom to use**: Use the software for any purpose
- ✅ **Freedom to study**: Access and examine the source code
- ✅ **Freedom to modify**: Make changes and improvements
- ✅ **Freedom to distribute**: Share the software and your modifications

### Important requirements:

- 🔒 **Share modifications**: If you modify and distribute the software, you must share your changes under the same license
- 🌐 **Network use clause**: If you run a modified version on a server accessible to others, you must provide the source code to users
- 📄 **License preservation**: Include the original license and copyright notices

This strong copyleft license ensures that improvements to Audio Mixer remain open source and benefit the entire community. See the [LICENSE](LICENSE) file for complete terms.

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details on:

- 🐛 Reporting bugs
- 💡 Suggesting features  
- 🔧 Setting up development environment
- 📝 Code style and standards
- 🔍 Testing procedures

## Community

- 📋 [GitHub Issues](https://github.com/eyevinn/audio-mixer/issues) - Bug reports and feature requests
- 💬 [GitHub Discussions](https://github.com/eyevinn/audio-mixer/discussions) - Questions and community chat
- 📖 [Documentation Wiki](https://github.com/eyevinn/audio-mixer/wiki) - Detailed guides and API reference

## Development Scripts

```bash
npm run start      # Start development server
npm run build      # Build for production
npm run test       # Run test suite
npm run lint       # Run ESLint
npm run typecheck  # Run TypeScript compiler
npm run pretty     # Format code with Prettier
```

## Acknowledgments

Built with ❤️ by the Eyevinn Technology team and contributors.

Special thanks to the open source audio and web development communities for their invaluable tools and libraries.

---

<div align="center">

**[Eyevinn Technology](https://eyevinn.se) • Professional Video Streaming Solutions**

</div>
