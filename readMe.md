

# Discord.js Components v2 Guide

[![GitHub WidgetBox](https://github-widgetbox.vercel.app/api/profile?username=bre4d777\&data=followers,repositories,stars,commits\&theme=viridescent)](https://github.com/bre4d777)

A complete guide to Discord.js Components v2 — a powerful new system that gives you full control over how your bot messages are structured and displayed.

---

## What is Components v2?

Components v2 is a major shift in how Discord bot messages are built. Instead of relying on embeds, it introduces a flexible, component-based system where you can position text, buttons, media, and interactive elements exactly where you want them.

### Highlights

* **Modular Design** – Build messages from reusable, independent components.
* **Full Layout Control** – Precisely position content however you like.
* **Responsive Design** – Messages look great on both desktop and mobile.
* **Custom Styling** – Go beyond the limits of embeds to create truly unique messages.
* **Efficient Rendering** – Optimized for performance and interactivity.

---

## What's Included in This Guide

This guide is broken down into step-by-step sections:

1. [Getting Started](1-basics.md) – Learn the basics and create your first Components v2 message.
2. [Layouts and Sections](2-sections-and-stuff.md) – Dive into advanced layouts and structural components.
3. [Interactivity](3-action-rows.md) – Learn how to use buttons, select menus, and handle user interaction.
4. [Working with Media](4-file-builder.md) – Add images and file-based content.
5. [Practical Examples](5-examples.md) – Explore real use cases and full message designs.

---


## Component Overview

### Core Building Blocks

| Component             | Description               | Key Features                                        |
| --------------------- | ------------------------- | --------------------------------------------------- |
| `ContainerBuilder`    | Wraps all content         | Accent colors, spoilers, nested layout support      |
| `TextDisplayBuilder`  | Text with Markdown        | Headings, mentions, code blocks, rich formatting    |
| `SeparatorBuilder`    | Spacers and dividers      | Adjustable spacing and divider lines                |
| `SectionBuilder`      | Group content visually    | Holds up to 3 text blocks and an optional accessory |
| `ActionRowBuilder`    | Adds buttons/menus        | User interaction support                            |
| `MediaGalleryBuilder` | Displays images and media | Up to 10 items with thumbnails                      |

---

## Limits and Constraints

### Message-Level Limits

* Maximum of **40 components** per message (including nested)
* Up to **4000 characters** total across all text
* You **cannot mix traditional content/embeds** with Components v2 messages

### Individual Component Limits

* **Container** – Max 10 direct children
* **Section** – Up to 3 text displays + 1 accessory
* **Media Gallery** – Max 10 media items
* **Action Row** – Up to 5 buttons or 1 select menu

---

## Common Mistakes to Avoid

### Missing the Components v2 Flag

```javascript
// Incorrect — message will not render
await interaction.reply({
    content: "Hello",
    components: [container]
});

// Correct — always include the flag
await interaction.reply({
    components: [container],
    flags: MessageFlags.IsComponentsV2
});
```

### Mixing Old Message Systems with Components v2

```javascript
// Incorrect — can't combine embeds or regular content
await interaction.reply({
    content: "Some text",
    embeds: [embed],
    components: [container],
    flags: MessageFlags.IsComponentsV2
});

// Correct — use TextDisplayBuilder instead
const text = new TextDisplayBuilder().setContent("Some text");
const container = new ContainerBuilder().addTextDisplayComponents(text);
```

---

## Contributing

You're welcome to contribute in any of the following ways:

* Improve documentation
* Report bugs
* Suggest new examples
* Help improve the codebase

Open an issue or send a pull request anytime.

---

## Need Help?

* **For doc-related issues**: Open an issue in this repository
* **For Discord.js questions**: Join the [official Discord.js server](https://discord.gg/djs)
* **For general questions**: hmu on discord [@bre4d777](https://discord.gg/EpX9Rp4c)

---



## Special Thanks

* The Discord.js team for building the foundation
* [@MoonCarli](https://github.com/MoonCarli) - ransi ka baccha
* Everyone contributing to this guide and helping others learn

---

**Ready to get started?** Jump into the [Getting Started Guide](1-basics.md) and start building cleaner, more interactive bot messages.


Consider Giving a star ⭐ if this helped you
---
