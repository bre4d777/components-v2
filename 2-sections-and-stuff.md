# Discord.js Components v2 - Sections & Containers Guide

## Understanding Containers

Containers are the backbone of Components v2 messages. They act as enhanced embeds that can hold up to 10 different types of components in any arrangement you choose.

### Container Properties

```javascript
const { ContainerBuilder } = require('discord.js');

const container = new ContainerBuilder()
    .setAccentColor(0x5865F2)    // Color bar on the left (like embed color)
    .setSpoiler(true)            // Hides content behind spoiler blur
    .setId(1);                   // Optional unique identifier for updates
```

### Accent Colors
The accent color appears as a thin vertical bar on the left side of the container, similar to embed colors but more subtle. Use meaningful colors:

```javascript
// Brand colors
.setAccentColor(0x5865F2)  // Discord Blurple
.setAccentColor(0xFF0000)  // Red for errors
.setAccentColor(0x00FF00)  // Green for success
.setAccentColor(0xFFFF00)  // Yellow for warnings

// RGB Tuple format also works
.setAccentColor([88, 101, 242])  // Same as 0x5865F2
```

## Mastering Sections

Sections are powerful layout components that combine text content with optional accessories (buttons or thumbnails). They're perfect for creating information cards with actions.

### Basic Section Structure

```javascript
const { 
    SectionBuilder, 
    TextDisplayBuilder, 
    ButtonBuilder, 
    ButtonStyle 
} = require('discord.js');

const section = new SectionBuilder()
    .addTextDisplayComponents(
        new TextDisplayBuilder().setContent('**Section Title**'),
        new TextDisplayBuilder().setContent('Main content goes here'),
        new TextDisplayBuilder().setContent('Additional details')
    )
    .setButtonAccessory(
        new ButtonBuilder()
            .setCustomId('section_action')
            .setLabel('Take Action')
            .setStyle(ButtonStyle.Primary)
    );
```

### Section Rules and Limitations

1. **Text Displays**: 1-3 TextDisplay components per section (minimum 1, maximum 3)
2. **Accessories**: Exactly 1 accessory per section (either button OR thumbnail)
3. **Layout**: Accessories always appear on the right side
4. **Nesting**: Sections cannot contain other sections

### Button Accessories

Button accessories integrate action buttons directly into content flow:

```javascript
// Different button styles in sections
const primarySection = new SectionBuilder()
    .addTextDisplayComponents(
        new TextDisplayBuilder().setContent('**Main Action**\nImportant task to complete')
    )
    .setButtonAccessory(
        new ButtonBuilder()
            .setCustomId('primary_action')
            .setLabel('Complete Task')
            .setStyle(ButtonStyle.Primary)
    );

const dangerSection = new SectionBuilder()
    .addTextDisplayComponents(
        new TextDisplayBuilder().setContent('**Danger Zone**\nThis action cannot be undone')
    )
    .setButtonAccessory(
        new ButtonBuilder()
            .setCustomId('delete_action')
            .setLabel('Delete')
            .setStyle(ButtonStyle.Danger)
    );
```

### Thumbnail Accessories

Thumbnails add visual context to sections:

```javascript
const { ThumbnailBuilder } = require('discord.js');

const profileSection = new SectionBuilder()
    .addTextDisplayComponents(
        new TextDisplayBuilder().setContent('**John Doe**'),
        new TextDisplayBuilder().setContent('Senior Developer'),
        new TextDisplayBuilder().setContent('📧 john@company.com\n📞 (555) 123-4567')
    )
    .setThumbnailAccessory(
        new ThumbnailBuilder()
            .setURL('https://example.com/avatar.png')
            .setDescription('Profile photo')
            .setSpoiler(false)
    );
```

## Container Organization Patterns

### Information Hierarchy Pattern

Structure information from general to specific:

```javascript
const dashboardContainer = new ContainerBuilder()
    .setAccentColor(0x2F3136)
    
    // Header section
    .addTextDisplayComponents(
        new TextDisplayBuilder().setContent('# Server Dashboard')
    )
    
    // Main metrics section
    .addSectionComponents(
        new SectionBuilder()
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent('**Server Statistics**'),
                new TextDisplayBuilder().setContent('👥 Members: 1,234\n💬 Messages: 5,678\n🎯 Active: 89%')
            )
            .setButtonAccessory(
                new ButtonBuilder()
                    .setCustomId('refresh_stats')
                    .setLabel('Refresh')
                    .setStyle(ButtonStyle.Secondary)
            )
    )
    
    // Detailed breakdown
    .addSeparatorComponents(
        new SeparatorBuilder()
            .setSpacing(SeparatorSpacingSize.Large)
            .setDivider(true)
    )
    
    .addSectionComponents(
        new SectionBuilder()
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent('**Channel Activity**'),
                new TextDisplayBuilder().setContent('#general: 234 messages\n#announcements: 12 messages\n#support: 67 messages')
            )
    );
```

### Card-Based Layout Pattern

Create distinct cards for different types of information:

```javascript
const productContainer = new ContainerBuilder()
    .setAccentColor(0x57F287)
    
    // Product card
    .addSectionComponents(
        new SectionBuilder()
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent('## Premium Bot Pro'),
                new TextDisplayBuilder().setContent('**$19.99/month**\nAdvanced Discord bot with premium features')
            )
            .setThumbnailAccessory(
                new ThumbnailBuilder()
                    .setURL('https://example.com/product.png')
                    .setDescription('Product image')
            )
    )
    
    // Features card
    .addSeparatorComponents(
        new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small)
    )
    
    .addSectionComponents(
        new SectionBuilder()
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent('**Features Included**'),
                new TextDisplayBuilder().setContent('✅ Custom Commands\n✅ Advanced Moderation\n✅ Analytics Dashboard\n✅ 24/7 Support')
            )
            .setButtonAccessory(
                new ButtonBuilder()
                    .setCustomId('view_features')
                    .setLabel('Learn More')
                    .setStyle(ButtonStyle.Primary)
            )
    );
```

### Mixed Content Pattern

Combine different component types for rich layouts:

```javascript
const { 
    MediaGalleryBuilder, 
    MediaGalleryItemBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder
} = require('discord.js');

const richContainer = new ContainerBuilder()
    .setAccentColor(0xFF6B6B)
    
    // Text header
    .addTextDisplayComponents(
        new TextDisplayBuilder().setContent('# New Game Release!\n**Adventure Quest VII** is now available!')
    )
    
    // Image gallery
    .addMediaGalleryComponents(
        new MediaGalleryBuilder()
            .addItems(
                new MediaGalleryItemBuilder()
                    .setURL('https://example.com/screenshot1.png')
                    .setDescription('Gameplay screenshot'),
                new MediaGalleryItemBuilder()
                    .setURL('https://example.com/screenshot2.png')
                    .setDescription('Character creation')
            )
    )
    
    // Information section
    .addSectionComponents(
        new SectionBuilder()
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent('**Game Details**'),
                new TextDisplayBuilder().setContent('🎮 Genre: RPG/Adventure\n⏱️ Playtime: 40+ hours\n🌟 Rating: 4.8/5')
            )
            .setButtonAccessory(
                new ButtonBuilder()
                    .setCustomId('buy_game')
                    .setLabel('Buy Now - $59.99')
                    .setStyle(ButtonStyle.Success)
            )
    )
    
    // Interactive selection
    .addActionRowComponents(
        new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('platform_select')
                    .setPlaceholder('Choose your platform')
                    .addOptions(
                        new StringSelectMenuOptionBuilder()
                            .setLabel('Steam')
                            .setValue('steam')
                            .setEmoji('🎮'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('PlayStation')
                            .setValue('playstation')
                            .setEmoji('🎯'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('Xbox')
                            .setValue('xbox')
                            .setEmoji('🎪')
                    )
            )
    );
```

## Advanced Section Techniques

### Dynamic Section Building

Create sections based on data:

```javascript
class SectionFactory {
    static createUserSection(userData) {
        const section = new SectionBuilder()
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`**${userData.username}**`),
                new TextDisplayBuilder().setContent(`Level ${userData.level} • ${userData.xp} XP`)
            );
            
        if (userData.profileImage) {
            section.setThumbnailAccessory(
                new ThumbnailBuilder()
                    .setURL(userData.profileImage)
                    .setDescription(`${userData.username}'s avatar`)
            );
        } else {
            section.setButtonAccessory(
                new ButtonBuilder()
                    .setCustomId(`view_profile_${userData.id}`)
                    .setLabel('View Profile')
                    .setStyle(ButtonStyle.Secondary)
            );
        }
        
        return section;
    }
    
    static createStatusSection(status, message) {
        const colors = {
            success: ButtonStyle.Success,
            warning: ButtonStyle.Secondary,
            error: ButtonStyle.Danger
        };
        
        return new SectionBuilder()
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`**Status Update**`),
                new TextDisplayBuilder().setContent(message)
            )
            .setButtonAccessory(
                new ButtonBuilder()
                    .setCustomId(`acknowledge_${status}`)
                    .setLabel('Acknowledge')
                    .setStyle(colors[status] || ButtonStyle.Primary)
            );
    }
}

// Usage
const userSection = SectionFactory.createUserSection({
    username: 'Alice',
    level: 42,
    xp: 15750,
    profileImage: 'https://example.com/alice.png'
});
```

### Responsive Section Layouts

Adapt sections based on content length:

```javascript
function createAdaptiveSection(title, content, hasAction = false) {
    const contentLines = content.split('\n');
    const section = new SectionBuilder();
    
    // Always add title
    section.addTextDisplayComponents(
        new TextDisplayBuilder().setContent(`**${title}**`)
    );
    
    // Add content (max 2 additional text displays)
    if (contentLines.length <= 10) {
        // Short content - single text display
        section.addTextDisplayComponents(
            new TextDisplayBuilder().setContent(content)
        );
    } else {
        // Long content - split into two displays
        const midPoint = Math.ceil(contentLines.length / 2);
        const firstHalf = contentLines.slice(0, midPoint).join('\n');
        const secondHalf = contentLines.slice(midPoint).join('\n');
        
        section.addTextDisplayComponents(
            new TextDisplayBuilder().setContent(firstHalf),
            new TextDisplayBuilder().setContent(secondHalf)
        );
    }
    
    // Add action if requested
    if (hasAction) {
        section.setButtonAccessory(
            new ButtonBuilder()
                .setCustomId('section_action')
                .setLabel('More Info')
                .setStyle(ButtonStyle.Primary)
        );
    }
    
    return section;
}
```

## Best Practices

### 1. Content Organization
- Put most important information in the first text display
- Use the second and third displays for supporting details
- Keep related information within the same section

### 2. Interaction Design
- Make button labels clear and action-oriented
- Use appropriate button styles for the action type
- Consider the user's mental model when placing buttons

### 3. Performance Considerations
- Sections count toward the 40-component limit
- Each text display within a section counts as a separate component
- Plan your component budget carefully

## Next Steps
[next](./3-action-rows.md)
