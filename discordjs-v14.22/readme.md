# Discord.js v14.22 Documentation

## Overview

Comprehensive documentation for Discord.js version 14.22, covering breaking changes, new features, and migration guidelines for developers upgrading from previous versions.

## Documentation Structure

### Migration Guide
**File**: [`refactors.md`](./refactors.md)

Complete migration guide covering all breaking changes and deprecated functionality in v14.22, including:
- Event system updates (`Events.Ready` → `Events.ClientReady`)
- API method renames (`fetchPinned` → `fetchPins`)
- Automated migration strategies
- Code examples and implementation patterns

### New Features Documentation
**File**: [`new-features.md`](./new-features.md)

Detailed documentation of new functionality introduced in v14.22, featuring:
- Enhanced User object with guild tags, avatar decorations, and collectibles
- New URL generation methods for Discord CDN assets
- Comprehensive property structures and validation patterns
- Implementation examples and best practices

### Example Implementation
**Files**: 
- [`userinfo-command.js`](./userinfo-command.js) - Complete userinfo command with v14.22 features
- [`roleinfo-command.js`](./roleinfo-command.js) - Complete roleinfo command with gradient visualization

Production-ready commands demonstrating all new v14.22 features:
- Complete user and role data retrieval and display
- Gradient color visualization for roles
- Proper error handling and validation
- Modern Discord.js command structure
- Asset URL generation and formatting

## Quick Start

### Installation
```bash
npm install discord.js@^14.22.0
```

### Basic Implementation
```javascript
const { Client, GatewayIntentBits, Events } = require('discord.js');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});

// Updated event listener (v14.22)
client.once(Events.ClientReady, (readyClient) => {
    console.log(`Bot ready! Logged in as ${readyClient.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN);
```

## Key Changes Summary

### Breaking Changes
- `Events.Ready` deprecated in favor of `Events.ClientReady`
- `channel.messages.fetchPinned()` renamed to `channel.messages.fetchPins()`

### New Features
- Enhanced User object with `primaryGuild`, `avatarDecorationData`, and `collectibles`
- Enhanced Role object with `colors` (gradient support) and `icon` properties
- New URL methods: `avatarDecorationURL()`, `guildTagBadgeURL()`, and `iconURL()` for roles
- Improved asset management and CDN integration

## Getting Started

1. **Migration**: Start with [`refactors.md`](./refactors.md) to update existing code
2. **New Features**: Review [`new-features.md`](./new-features.md) for User and Role object enhancements
3. **Example Code**: Examine [`userinfo-command.js`](./userinfo-command.js) and [`roleinfo-command.js`](./roleinfo-command.js) for practical implementation

## Support and Community

### Documentation Issues
For issues related to documentation accuracy, missing information, or suggested improvements, please open an issue in the respective repository.

### Discord.js Technical Support
For general Discord.js development questions, API usage, and community support, join the [official Discord.js server](https://discord.gg/djs).

### Direct Contact
For specific questions about these guides or collaboration opportunities, connect with the maintainer on Discord: [@bre4d777](https://discord.gg/EpX9Rp4c)


---

*Last updated: August 2025 | Discord.js v14.22.0*
