# Discord.js Components v2 - Basics Guide

## Introduction to Components v2

Discord Components v2 represents a revolutionary approach to message design in Discord bots. Unlike traditional embeds that follow rigid structures, Components v2 provides complete control over message layout, allowing you to position text, images, buttons, and other interactive elements exactly where you need them.

## Key Concepts

### The Component-First Approach

Components v2 introduces a fundamental shift: **everything is a component**. Instead of thinking about messages with optional embeds and components, you now think about messages composed entirely of modular, reusable components that can be arranged in any order.

### The MessageFlags.IsComponentsV2 Requirement

To use Components v2, you must include the `MessageFlags.IsComponentsV2` flag in your message. This flag tells Discord to interpret your message using the new component system:

```javascript
const { MessageFlags } = require('discord.js');

await interaction.reply({
    components: [/* your components */],
    flags: MessageFlags.IsComponentsV2
});
```

**Important**: Once you use this flag, traditional message properties like `content`, `embeds`, `stickers`, and `polls` are disabled for that message.

## Core Component Types

### 1. TextDisplayBuilder - Your New Content Foundation

The `TextDisplayBuilder` replaces traditional message content and embed descriptions. It supports full Markdown formatting:

```javascript
const { TextDisplayBuilder } = require('discord.js');

const text = new TextDisplayBuilder()
    .setContent(`
# Main Heading
## Sub Heading

**Bold text** and *italic text*
\`inline code\` and \`\`\`javascript
code blocks
\`\`\`

- Bullet points work
- Lists are supported
- Everything Markdown does

Mentions work too: <@123456789> and <#987654321>
`);
```

### 2. ContainerBuilder - Organizing Everything

Containers are the foundational building blocks that hold other components. Think of them as enhanced embeds with much more flexibility:

```javascript
const { ContainerBuilder } = require('discord.js');

const container = new ContainerBuilder()
    .setAccentColor(0x5865F2)  // Sets the left border color
    .setSpoiler(false)         // Can hide content behind spoiler
    .addTextDisplayComponents(textComponent);
```

### 3. SeparatorBuilder - Visual Spacing

Separators provide controlled spacing and visual breaks between content:

```javascript
const { SeparatorBuilder, SeparatorSpacingSize } = require('discord.js');

// Small spacing for subtle breaks
const smallSeparator = new SeparatorBuilder()
    .setSpacing(SeparatorSpacingSize.Small)
    .setDivider(false);

// Large spacing with divider line
const largeSeparator = new SeparatorBuilder()
    .setSpacing(SeparatorSpacingSize.Large)
    .setDivider(true);
```

## Building Your First Components v2 Message

### Step 1: Import Required Classes

```javascript
const { 
    ContainerBuilder,
    TextDisplayBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    MessageFlags 
} = require('discord.js');
```

### Step 2: Create Your Components

```javascript
// Create header text
const header = new TextDisplayBuilder()
    .setContent('# Welcome to Components v2!\nA new era of Discord bot messages.');

// Create main content
const content = new TextDisplayBuilder()
    .setContent('This system allows for **much more flexibility** than traditional embeds. You can arrange components in any order and create truly custom layouts.');

// Create a separator
const separator = new SeparatorBuilder()
    .setSpacing(SeparatorSpacingSize.Large)
    .setDivider(true);
```

### Step 3: Build the Container

```javascript
const container = new ContainerBuilder()
    .setAccentColor(0x00FF00)
    .addTextDisplayComponents(header)
    .addSeparatorComponents(separator)
    .addTextDisplayComponents(content);
```

### Step 4: Send the Message

```javascript
await interaction.reply({
    components: [container],
    flags: MessageFlags.IsComponentsV2
});
```

## Understanding Component Hierarchy

Components v2 follows a hierarchical structure:

```
Message
└── Container (Top-level component)
    ├── TextDisplay
    ├── Separator
    ├── Section
    │   ├── TextDisplay (up to 3)
    │   ├── TextDisplay
    │   └── Accessory (Button OR Thumbnail)
    ├── MediaGallery
    │   ├── MediaGalleryItem
    │   └── MediaGalleryItem
    └── ActionRow
        ├── Button
        ├── Button
        └── SelectMenu
```

## Component Limitations and Constraints

### Message-Level Limits
- **40 total components** per message (including nested components)
- **4000 characters total** across all text content
- **No traditional content/embeds** when using Components v2

### Component-Specific Limits
- **TextDisplay**: No individual character limit, but counts toward total
- **Container**: Up to 10 direct child components
- **Section**: Up to 3 TextDisplay components + 1 accessory
- **MediaGallery**: Up to 10 media items
- **ActionRow**: Up to 5 buttons or 1 select menu

## Best Practices for Beginners

### 1. Start Simple
Begin with basic TextDisplay and Container combinations before adding complex layouts.

### 2. Plan Your Hierarchy
Sketch out your message structure before coding. Components v2 rewards thoughtful planning.

### 3. Use Separators Wisely
Don't overuse separators. They're powerful for creating visual breaks but can clutter if overused.

### 4. Mind the Limits
Keep track of your component count. The 40-component limit includes all nested components.

### 5. Test on Mobile
Components v2 layouts can look different on mobile. Test your designs across devices.

## Common Beginner Mistakes

### 1. Forgetting the Flag
```javascript
// ❌ Wrong - message will fail
await interaction.reply({
    content: "Hello",
    components: [container]
});

// ✅ Correct
await interaction.reply({
    components: [container],
    flags: MessageFlags.IsComponentsV2
});
```

### 2. Mixing Old and New
```javascript
// ❌ Wrong - can't mix content with Components v2
await interaction.reply({
    content: "Some text",
    components: [container],
    flags: MessageFlags.IsComponentsV2
});

// ✅ Correct - use TextDisplayBuilder instead
const text = new TextDisplayBuilder().setContent("Some text");
const container = new ContainerBuilder().addTextDisplayComponents(text);
```

### 3. Exceeding Component Limits
Always count your components. A complex layout can quickly approach the 40-component limit.

## Next Steps
[Next](./2-sections-and-stuff.md)
