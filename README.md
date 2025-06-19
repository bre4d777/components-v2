# Discord.js Components v2 - Complete Developer Guide

Discord's Components v2 system represents a massive shift in how we build interactive messages. This isn't just another update - it's a complete reimagining of Discord message architecture that puts layout control directly in your hands.

## What Makes Components v2 Different

Components v2 introduces a container-based system where every element has its place in a structured hierarchy. Think of it like building with LEGO blocks - each component serves a specific purpose and fits together in predictable ways.

The most important thing to understand: **once you use `MessageFlags.IsComponentsV2`, traditional message properties like `content`, `embeds`, `stickers`, and `polls` become unavailable**. This isn't a limitation - it's a feature that forces clean, structured message design.

## Core Architecture

### ContainerBuilder - Your Foundation

Every Components v2 message starts with a `ContainerBuilder`. This is your canvas:

```js
const container = new ContainerBuilder()
  .setAccentColor(0x5865F2)
  .setSpoiler(true);
```

The accent color appears as a thin bar on the left side of your message, similar to embed colors but more subtle. Spoiler containers hide their content behind Discord's spoiler system.

### TextDisplayBuilder - Rich Content Display

Replace your embed titles and descriptions with `TextDisplayBuilder`:

```js
new TextDisplayBuilder()
  .setContent("# Main Heading\n**Bold text** and _italics_\nMentions work: <@123456789>\nChannels too: <#987654321>");
```

These support full Markdown formatting and Discord mentions. Unlike embed fields, there's no character limit per text display, though Discord's overall message limits still apply.

### SectionBuilder - Organized Content Blocks

Sections group related content with optional accessories:

```js
new SectionBuilder()
  .addTextDisplayComponents(
    new TextDisplayBuilder().setContent("Primary information"),
    new TextDisplayBuilder().setContent("Secondary details"),
    new TextDisplayBuilder().setContent("Additional context")
  )
  .setButtonAccessory(
    new ButtonBuilder()
      .setCustomId('section_action')
      .setLabel('Take Action')
      .setStyle(ButtonStyle.Primary)
  );
```

Each section can contain up to 3 text displays and either a button OR thumbnail accessory. The accessory appears on the right side, creating a clean left-to-right information flow.

### SeparatorBuilder - Visual Breathing Room

Separators control spacing and visual breaks:

```js
new SeparatorBuilder()
  .setSpacing(SeparatorSpacingSize.Large)
  .setDivider(true);
```

Small spacing adds subtle gaps, large spacing creates clear section breaks. Dividers add horizontal lines for stronger visual separation.

### MediaGalleryBuilder - Rich Visual Content

Replace embed images with galleries that support multiple media items:

```js
new MediaGalleryBuilder()
  .addItems(
    new MediaGalleryItemBuilder()
      .setURL('https://example.com/image1.png')
      .setDescription('Product showcase'),
    new MediaGalleryItemBuilder()
      .setURL('https://example.com/image2.jpg')
      .setDescription('Different angle')
  );
```

Galleries support up to 10 items and work with images, videos, and GIFs. Each item can have its own description.

### FileBuilder - Attachment Previews

Display file attachments inline:

```js
new FileBuilder()
  .setURL('attachment://document.pdf')
  .setSpoiler(false);
```

Files appear as previews within your message layout rather than as separate attachments below.

### ActionRowBuilder - Interactive Components

Action rows are the only way to add interactive elements:

```js
new ActionRowBuilder()
  .addComponents(
    new ButtonBuilder()
      .setCustomId('primary_action')
      .setLabel('Confirm')
      .setStyle(ButtonStyle.Success),
    new SelectMenuBuilder()
      .setCustomId('options_select')
      .setPlaceholder('Choose an option')
      .addOptions([
        { label: 'Option 1', value: 'opt1' },
        { label: 'Option 2', value: 'opt2' }
      ])
  );
```

## Building Complex Layouts

### Information Hierarchy

Structure your information logically:

1. **Header** - Use TextDisplayBuilder with markdown headers
2. **Main Content** - Sections with related information grouped together
3. **Media** - Galleries for visual content
4. **Actions** - ActionRows at logical decision points
5. **Footer** - Additional context or metadata

### Visual Flow Patterns

**Vertical Flow**: Content flows top to bottom naturally
```js
container
  .addTextDisplayComponents(header)
  .addSeparatorComponents(spacer)
  .addSectionComponents(mainContent)
  .addMediaGalleryComponents(images)
  .addActionRowComponents(actions);
```

**Sectioned Content**: Group related information
```js
container
  .addSectionComponents(
    new SectionBuilder()
      .addTextDisplayComponents(title, description)
      .setThumbnailAccessory(preview)
  )
  .addSeparatorComponents(divider)
  .addSectionComponents(
    new SectionBuilder()
      .addTextDisplayComponents(details)
      .setButtonAccessory(actionButton)
  );
```

## Practical Implementation Patterns

### Dashboard Layout
```js
const dashboard = new ContainerBuilder()
  .setAccentColor(0x2F3136)
  .addTextDisplayComponents(
    new TextDisplayBuilder().setContent("# Server Dashboard")
  )
  .addSeparatorComponents(
    new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small)
  )
  .addSectionComponents(
    new SectionBuilder()
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent("**Members Online**: 1,234"),
        new TextDisplayBuilder().setContent("**Messages Today**: 5,678")
      )
      .setButtonAccessory(
        new ButtonBuilder()
          .setCustomId('refresh_stats')
          .setLabel('Refresh')
          .setStyle(ButtonStyle.Secondary)
      )
  );
```

### Product Showcase
```js
const product = new ContainerBuilder()
  .addTextDisplayComponents(
    new TextDisplayBuilder().setContent("## Premium Discord Bot\n**$19.99/month**")
  )
  .addMediaGalleryComponents(
    new MediaGalleryBuilder()
      .addItems(
        new MediaGalleryItemBuilder()
          .setURL('https://example.com/preview1.png')
          .setDescription('Main interface'),
        new MediaGalleryItemBuilder()
          .setURL('https://example.com/preview2.png')
          .setDescription('Configuration panel')
      )
  )
  .addSectionComponents(
    new SectionBuilder()
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent("✅ Advanced moderation\n✅ Custom commands\n✅ 24/7 support")
      )
  )
  .addActionRowComponents(
    new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('purchase')
          .setLabel('Buy Now')
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId('learn_more')
          .setLabel('Learn More')
          .setStyle(ButtonStyle.Primary)
      )
  );
```

## Interaction Handling

Components v2 interactions work identically to traditional Discord.js interactions:

```js
client.on('interactionCreate', async interaction => {
  if (!interaction.isButton()) return;
  
  switch(interaction.customId) {
    case 'refresh_stats':
      await interaction.reply({ 
        content: 'Stats refreshed!', 
        ephemeral: true 
      });
      break;
      
    case 'purchase':
      await interaction.showModal(purchaseModal);
      break;
  }
});
```

The beauty is that your interaction logic remains unchanged while your UI becomes dramatically more powerful.

## Migration from Embeds

### Direct Replacements

| Embed Feature | Components v2 Equivalent |
|---------------|-------------------------|
| `setTitle()` | `TextDisplayBuilder` with `# Header` |
| `setDescription()` | `TextDisplayBuilder` with content |
| `addFields()` | Multiple `SectionBuilder` components |
| `setImage()` | `MediaGalleryBuilder` |
| `setThumbnail()` | `ThumbnailBuilder` in section accessory |
| `setColor()` | `ContainerBuilder.setAccentColor()` |

### Enhanced Capabilities

Components v2 goes far beyond embed limitations:

- **Multiple images** instead of one embed image
- **Interactive elements** integrated into content flow
- **Rich text formatting** without field constraints
- **Flexible layouts** instead of rigid embed structure
- **File previews** inline with content

## Performance Considerations

### Message Complexity
- Maximum 40 total components per message
- Plan your component hierarchy before building
- Use separators strategically to avoid visual clutter

### Network Efficiency
- Components v2 messages are larger than traditional messages
- Consider pagination for data-heavy interfaces
- Cache component builders for repeated use

### User Experience
- Maintain consistent visual hierarchy
- Don't overwhelm users with too many interactive elements
- Use accent colors to establish visual identity

## Advanced Patterns

### Paginated Content
```js
class PaginatedContainer {
  constructor(data, pageSize = 5) {
    this.data = data;
    this.pageSize = pageSize;
    this.currentPage = 0;
  }
  
  buildPage() {
    const start = this.currentPage * this.pageSize;
    const pageData = this.data.slice(start, start + this.pageSize);
    
    const container = new ContainerBuilder()
      .addTextDisplayComponents(
        new TextDisplayBuilder()
          .setContent(`# Results (${start + 1}-${start + pageData.length} of ${this.data.length})`)
      );
    
    pageData.forEach(item => {
      container.addSectionComponents(
        new SectionBuilder()
          .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(`**${item.title}**\n${item.description}`)
          )
      );
    });
    
    const buttons = [];
    if (this.currentPage > 0) {
      buttons.push(
        new ButtonBuilder()
          .setCustomId('prev_page')
          .setLabel('Previous')
          .setStyle(ButtonStyle.Secondary)
      );
    }
    if ((this.currentPage + 1) * this.pageSize < this.data.length) {
      buttons.push(
        new ButtonBuilder()
          .setCustomId('next_page')
          .setLabel('Next')
          .setStyle(ButtonStyle.Secondary)
      );
    }
    
    if (buttons.length > 0) {
      container.addActionRowComponents(
        new ActionRowBuilder().addComponents(...buttons)
      );
    }
    
    return container;
  }
}
```

### Dynamic Content Updates
```js
async function updateContainer(interaction, newData) {
  const updatedContainer = buildContainerFromData(newData);
  
  await interaction.update({
    components: [updatedContainer],
    flags: [MessageFlags.IsComponentsV2]
  });
}
```

### State Management
```js
const componentStates = new Map();

function saveComponentState(messageId, state) {
  componentStates.set(messageId, state);
}

function loadComponentState(messageId) {
  return componentStates.get(messageId) || {};
}
```

## Common Pitfalls and Solutions

### Forgetting the Flag
**Problem**: Message appears broken or empty
**Solution**: Always set `MessageFlags.IsComponentsV2`

### Mixing Old and New
**Problem**: Trying to use `content` with Components v2
**Solution**: Use `TextDisplayBuilder` for all text content

### Overloading Sections
**Problem**: Trying to add too many text displays to a section
**Solution**: Maximum 3 text displays per section - use multiple sections instead

### Component Limit
**Problem**: Hitting the 40 component limit
**Solution**: Implement pagination or simplify your layout

## Best Practices

### Design Principles
1. **Hierarchy First**: Establish clear information hierarchy
2. **Consistent Spacing**: Use separators consistently
3. **Purposeful Interactions**: Every button should have clear purpose
4. **Visual Balance**: Don't overcrowd with components
5. **Mobile Friendly**: Consider how layouts appear on mobile devices

### Code Organization
```js
class ComponentsV2Builder {
  static createHeader(title, subtitle) {
    return new TextDisplayBuilder()
      .setContent(`# ${title}\n${subtitle || ''}`);
  }
  
  static createInfoSection(title, content, action) {
    const section = new SectionBuilder()
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(`**${title}**\n${content}`)
      );
    
    if (action) {
      section.setButtonAccessory(action);
    }
    
    return section;
  }
  
  static createSpacer(size = SeparatorSpacingSize.Small, divider = false) {
    return new SeparatorBuilder()
      .setSpacing(size)
      .setDivider(divider);
  }
}
```

### Testing Strategy
```js
function validateContainer(container) {
  const componentCount = countComponents(container);
  if (componentCount > 40) {
    throw new Error(`Component limit exceeded: ${componentCount}/40`);
  }
  
  return container;
}

function countComponents(container) {
  let count = 1; // Container itself
  
  container.components?.forEach(component => {
    count++;
    if (component.components) {
      count += component.components.length;
    }
  });
  
  return count;
}
```

## Future-Proofing Your Code

Components v2 is still evolving. Structure your code to adapt easily:

### Abstraction Layers
```js
class MessageBuilder {
  constructor() {
    this.useComponentsV2 = true;
  }
  
  createMessage(data) {
    if (this.useComponentsV2) {
      return this.buildCV2Message(data);
    } else {
      return this.buildTraditionalMessage(data);
    }
  }
  
  buildCV2Message(data) {
    // Components v2 implementation
  }
  
  buildTraditionalMessage(data) {
    // Fallback implementation
  }
}
```

### Configuration-Driven Components
```js
const componentConfig = {
  colors: {
    primary: 0x5865F2,
    success: 0x57F287,
    warning: 0xFEE75C,
    danger: 0xED4245
  },
  spacing: {
    small: SeparatorSpacingSize.Small,
    large: SeparatorSpacingSize.Large
  }
};

function buildConfiguredContainer(config) {
  return new ContainerBuilder()
    .setAccentColor(componentConfig.colors[config.theme || 'primary']);
}
```

## Conclusion

Components v2 represents Discord's vision for rich, interactive messaging experiences. By understanding its component-based architecture and embracing its structured approach, you can create compelling user interfaces that were impossible with traditional embeds.

The key to mastering Components v2 is thinking in terms of layout hierarchy rather than simple text formatting. Plan your information structure, use components purposefully, and always prioritize user experience over visual complexity.

Start simple, experiment with different layouts, and gradually incorporate more advanced patterns as you become comfortable with the system. Components v2 isn't just a new feature - it's a new way of thinking about Discord bot interactions.
