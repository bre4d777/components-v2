# Role and User Object Enhancements - Discord.js v14.22.0

## Overview

Discord.js v14.22.0 introduces significant enhancements to both User and Role objects, adding support for new Discord features including guild tags, avatar decorations, collectibles, role gradient colors, and role icons for improved customization options.

## New Properties

### Role Object Enhancements
Roles now support advanced visual customization with gradient colors and custom icons.

**New Properties:**
- `role.colors` - Object containing gradient color information
- `role.colors.primaryColor` - Primary gradient color (integer)
- `role.colors.secondaryColor` - Secondary gradient color (integer)
- `role.colors.tertiaryColor` - Tertiary gradient color (integer)
- `role.icon` - Role icon hash (if custom icon is set)
- `role.iconURL()` - Method to retrieve role icon URL

### Primary Guild Support
Users can now have associated guild tags that display publicly across Discord.

**New Properties:**
- `user.primaryGuild` - Access to user's primary guild information
- `user.guildTagBadgeURL()` - Method to retrieve guild tag badge image URL

### Avatar Decorations
Enhanced avatar customization with decorative frames and effects.

**New Properties:**
- `user.avatarDecoration` - Avatar decoration asset ID (if any)
- `user.avatarDecorationData` - Complete decoration metadata including SKU information
- `user.avatarDecorationURL()` - Method to retrieve decoration image URL

### Collectibles System
Access to user's collectible items including nameplates and other cosmetic assets.

**New Properties:**
- `user.collectibles` - Object containing user's collectible items
- `user.collectibles.nameplate` - Nameplate collectible information including asset path and palette

## Implementation Examples

### Role Information Retrieval
```javascript
// Fetch role with enhanced data
const role = await guild.roles.fetch(roleId);

// Access new gradient colors
if (role.colors) {
    console.log(`Primary Color: ${role.colors.primaryColor}`);
    console.log(`Secondary Color: ${role.colors.secondaryColor}`);
    console.log(`Tertiary Color: ${role.colors.tertiaryColor}`);
}

// Check for custom role icon
if (role.icon) {
    console.log(`Role Icon: ${role.iconURL({ size: 1024 })}`);
}

// Convert integer colors to hex
function intToHex(color) {
    if (color === null || color === undefined) return '#000000';
    return '#' + color.toString(16).padStart(6, '0').toUpperCase();
}
```

### Role Gradient Visualization
```javascript
// Create gradient visualization for roles with multiple colors
function createRoleGradient(role) {
    if (!role.colors) return null;
    
    const colors = [];
    if (role.colors.primaryColor !== null) colors.push(role.colors.primaryColor);
    if (role.colors.secondaryColor !== null) colors.push(role.colors.secondaryColor);
    if (role.colors.tertiaryColor !== null) colors.push(role.colors.tertiaryColor);
    
    return colors.map(color => intToHex(color));
}
```

### Basic User Data Retrieval
```javascript
// Fetch user with enhanced data
const user = await client.users.fetch(userId);

// Access new properties
if (user.primaryGuild) {
    console.log(`Guild Tag: ${user.primaryGuild.tag}`);
    console.log(`Guild ID: ${user.primaryGuild.identityGuildId}`);
}

if (user.avatarDecorationURL) {
    console.log(`Avatar Decoration: ${user.avatarDecorationURL({ size: 1024 })}`);
}

if (user.collectibles?.nameplate) {
    console.log(`Nameplate: ${user.collectibles.nameplate.asset}`);
}
```

### Complete User Information Handler
```javascript
async function getUserInfo(userId) {
    try {
        const user = await client.users.fetch(userId);
        
        const userInfo = {
            basic: {
                id: user.id,
                username: user.username,
                globalName: user.globalName,
                tag: user.tag,
                bot: user.bot
            },
            visual: {
                avatar: user.displayAvatarURL({ size: 1024 }),
                banner: user.bannerURL?.({ size: 1024 }) || null,
                avatarDecoration: user.avatarDecorationURL?.({ size: 1024 }) || null
            },
            guild: user.primaryGuild ? {
                tag: user.primaryGuild.tag,
                id: user.primaryGuild.identityGuildId,
                badgeURL: user.guildTagBadgeURL?.({ size: 1024 }) || null
            } : null,
            collectibles: user.collectibles ? {
                nameplate: user.collectibles.nameplate || null
            } : null
        };
        
        return userInfo;
    } catch (error) {
        throw new Error(`Failed to fetch user information: ${error.message}`);
    }
}
```

## Property Details

### Role colors Object Structure
```javascript
{
    primaryColor: 11127295,
    secondaryColor: 16759788,
    tertiaryColor: 16761760
}
```

### Role Object Enhanced Properties
```javascript
{
    icon: "8109b50deb682f03df63f61de4afce00", // Role icon hash
    colors: {
        primaryColor: 11127295,
        secondaryColor: 16759788,
        tertiaryColor: 16761760
    }
}
```

### primaryGuild Object Structure
```javascript
{
    identityGuildId: "1369768442663800993",
    identityEnabled: true,
    tag: "GAZA",
    badge: "6abac298577e7af03c6e37a4a40af54c"
}
```

### avatarDecorationData Object Structure
```javascript
{
    asset: "a_70fddceac8bedb9bb317d6891e5521cd",
    skuId: "1366494385650274315"
}
```

### collectibles Object Structure
```javascript
{
    nameplate: {
        skuId: "1349849614286585866",
        asset: "nameplates/nameplates/cityscape/",
        label: "COLLECTIBLES_NAMEPLATES_CITYSCAPE_A11Y",
        palette: "violet"
    }
}
```

## URL Methods

### Role URL Methods
- `role.iconURL(options)` - Returns role icon image URL (if icon exists)

### New User URL Generation Methods
- `user.avatarDecorationURL(options)` - Returns avatar decoration image URL
- `user.guildTagBadgeURL(options)` - Returns guild tag badge image URL

### URL Options
All URL methods support standard Discord CDN options:
```javascript
{
    size: 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096,
    format: 'webp' | 'png' | 'jpg' | 'jpeg' | 'gif'
}
```

### Color Conversion Utilities
```javascript
// Convert integer color to hex
function intToHex(color) {
    if (color === null || color === undefined) return '#000000';
    return '#' + color.toString(16).padStart(6, '0').toUpperCase();
}

// Get contrasting text color
function getContrastColor(hexColor) {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#FFFFFF';
}

## Validation and Error Handling

### Role Property Validation
Always validate role properties before accessing gradient colors:

```javascript
// Safe role colors access
if (role.colors) {
    const colors = [];
    if (role.colors.primaryColor !== null) colors.push(role.colors.primaryColor);
    if (role.colors.secondaryColor !== null) colors.push(role.colors.secondaryColor);
    if (role.colors.tertiaryColor !== null) colors.push(role.colors.tertiaryColor);
}

// Safe role icon access
const roleIconURL = role.iconURL?.({ size: 1024 });
```

### User Property Validation
Always validate property existence before accessing nested data:

```javascript
// Safe primary guild access
if (user.primaryGuild?.identityEnabled) {
    const guildTag = user.primaryGuild.tag;
}

// Safe collectibles access
if (user.collectibles?.nameplate?.asset) {
    const nameplateAsset = user.collectibles.nameplate.asset;
}

// Safe URL method calls
const decorationURL = user.avatarDecorationURL?.({ size: 1024 });
const guildBadgeURL = user.guildTagBadgeURL?.({ size: 1024 });
```
---

*Maintained by [bre4d777](https://github.com/bre4d777) | Last updated: 21 August 2025*
