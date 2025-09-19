# Contributing to Audio Mixer

We love your input! We want to make contributing to Audio Mixer as easy and transparent as possible, whether it's:

- 🐛 Reporting a bug
- 💡 Discussing the current state of the code
- 🚀 Submitting a fix
- 🌟 Proposing new features
- 🧑‍💻 Becoming a maintainer

## Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

### Branch Workflow

1. **Main branch**: Always production-ready
2. **Feature branches**: Create from `main` for new features
3. **Bug fix branches**: Create from `main` for bug fixes
4. **Pull requests**: Used to propose and review changes

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Git
- A code editor (VS Code recommended)

### Setup Development Environment

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/audio-mixer.git
   cd audio-mixer
   ```

3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/eyevinn/audio-mixer.git
   ```

4. **Install dependencies**:
   ```bash
   npm install
   ```

5. **Set up environment**:
   ```bash
   cp .env.local.sample .env.local
   # Edit .env.local with your settings
   ```

6. **Start development server**:
   ```bash
   npm run start
   ```

### Code Quality Tools

We use several tools to maintain code quality:

```bash
# Linting
npm run lint          # Check for issues
npm run lint --fix    # Fix auto-fixable issues

# Type checking
npm run typecheck     # Verify TypeScript types

# Code formatting
npm run pretty        # Format all files

# Run all checks
npm run lint && npm run typecheck
```

## Making Changes

### Before You Start

1. **Check existing issues** - your idea might already be discussed
2. **Create an issue** for major changes to discuss implementation
3. **Keep changes focused** - one feature/fix per pull request

### Creating a Pull Request

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

2. **Make your changes** following our coding standards

3. **Test your changes**:
   ```bash
   npm run lint
   npm run typecheck
   npm run test  # When tests are available
   ```

4. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: add new audio processing feature"
   ```

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request** on GitHub

### Pull Request Guidelines

- **Use a clear title** describing the change
- **Reference issues** using `Fixes #123` or `Closes #123`
- **Provide detailed description** of changes made
- **Include screenshots** for UI changes
- **Update documentation** if needed
- **Ensure all checks pass** (linting, type checking)

## Coding Standards

### TypeScript/React Guidelines

- **Use TypeScript** for all new code
- **Follow React best practices**:
  - Functional components with hooks
  - Custom hooks for reusable logic
  - Proper dependency arrays in useEffect
- **Use meaningful component and variable names**
- **Add JSDoc comments** for complex functions
- **Prefer const assertions** for immutable data

### Code Style

We use ESLint and Prettier for consistent code style:

- **2 spaces** for indentation
- **Single quotes** for strings
- **Trailing commas** in objects and arrays
- **Semicolons** required
- **Max line length**: 80 characters (when reasonable)

### File Organization

```
src/
├── components/          # Reusable UI components
│   ├── audio/          # Audio-specific components
│   └── common/         # Generic components
├── contexts/           # React contexts
├── hooks/              # Custom hooks
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── styles/             # Global styles
```

### Naming Conventions

- **Components**: PascalCase (`AudioMeter`, `VolumeSlider`)
- **Files**: kebab-case (`audio-meter.tsx`, `volume-slider.tsx`)
- **Variables/Functions**: camelCase (`audioLevel`, `handleVolumeChange`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_VOLUME_DB`, `WEBSOCKET_TIMEOUT`)
- **Types/Interfaces**: PascalCase (`AudioStrip`, `MixerConfig`)

## Audio-Specific Guidelines

### Audio Processing Components

- **Use semantic naming** for audio parameters
- **Include units** in variable names (e.g., `gainDb`, `frequencyHz`)
- **Document audio ranges** and expected values
- **Handle edge cases** (NaN, Infinity, out-of-range values)

### WebSocket Communication

- **Type all WebSocket messages** with TypeScript interfaces
- **Handle connection failures** gracefully
- **Implement proper cleanup** in useEffect hooks
- **Use throttling/debouncing** for frequent updates

### Real-time Performance

- **Minimize re-renders** using React.memo, useMemo, useCallback
- **Batch state updates** when possible
- **Use efficient data structures** for audio parameter storage
- **Profile performance** for meter updates and audio processing

## Testing

While we're still setting up comprehensive testing, please:

- **Manually test** your changes thoroughly
- **Test edge cases** (connection loss, invalid data, etc.)
- **Verify audio functionality** with real WebSocket connections
- **Check responsive design** on different screen sizes

### Future Testing Guidelines

We plan to implement:
- Unit tests for utility functions
- Component testing with React Testing Library
- Integration tests for WebSocket communication
- E2E tests for complete workflows

## Reporting Bugs

We use GitHub Issues to track bugs. Please include:

### Bug Report Template

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g. macOS, Windows, Linux]
- Browser [e.g. Chrome 90, Firefox 88]
- Audio Mixer version [e.g. 0.1.0]
- WebSocket backend info [if applicable]

**Additional context**
Any other context about the problem.
```

## Feature Requests

We welcome feature requests! Please:

1. **Check existing issues** for similar requests
2. **Provide detailed description** of the feature
3. **Explain the use case** and why it's valuable
4. **Consider implementation complexity**
5. **Be open to discussion** and feedback

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
A clear description of what the problem is.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Alternative solutions or features you've considered.

**Additional context**
Any other context, screenshots, or examples.
```

## Commit Message Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that don't affect code meaning (white-space, formatting)
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `perf`: Code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools

### Examples

```bash
feat(audio): add compressor with attack/release controls
fix(websocket): handle connection timeout gracefully
docs(readme): update installation instructions
style(components): fix ESLint warnings in meter components
refactor(hooks): extract audio processing logic to custom hook
```

## License

By contributing, you agree that your contributions will be licensed under the AGPL-3.0 License. This means:

- Your contributions become part of the open source project
- They must be made available under the same AGPL-3.0 terms
- You retain copyright of your contributions
- You grant rights to use, modify, and distribute your contributions

## Community Guidelines

### Code of Conduct

We are committed to providing a welcoming and inclusive experience for everyone. Please:

- **Be respectful** and considerate in all interactions
- **Use inclusive language** that welcomes all participants
- **Accept constructive criticism** gracefully
- **Focus on what's best** for the community
- **Show empathy** towards other community members

### Getting Help

- 📋 **GitHub Issues**: Bug reports and feature requests
- 💬 **GitHub Discussions**: Questions and general discussion
- 📖 **Documentation**: Check the README and wiki
- 💡 **Stack Overflow**: Tag questions with `audio-mixer` and `eyevinn`

## Recognition

Contributors will be recognized in:

- GitHub contributors list
- Release notes for significant contributions
- Special thanks in documentation
- Optional listing in AUTHORS file

## Questions?

Don't hesitate to ask! Create an issue or start a discussion if you need help getting started or have questions about contributing.

---

Thank you for contributing to Audio Mixer! 🎵