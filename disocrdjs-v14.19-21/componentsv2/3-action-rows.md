# Discord.js Components v2 - Action Rows Guide

## Understanding Action Rows

Action Rows are containers for interactive components like buttons and select menus. They're the only way to add interactive elements to Components v2 messages and provide the bridge between static content and user interactions.

## Action Row Fundamentals

### Basic Structure

```javascript
const { 
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle 
} = require('discord.js');

const actionRow = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('button_1')
            .setLabel('Primary Action')
            .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
            .setCustomId('button_2')
            .setLabel('Secondary Action')
            .setStyle(ButtonStyle.Secondary)
    );
```

### Action Row Limitations

1. **Button Limit**: Maximum 5 buttons per action row
2. **Select Menu Rule**: Only 1 select menu per action row (no mixing with buttons)
3. **Total Limit**: Up to 5 action rows per message in traditional components (no limit in Components v2)
4. **Component Mixing**: Cannot mix buttons and select menus in the same row

## Button Components in Action Rows

### Button Styles and Use Cases

```javascript
const { ButtonStyle } = require('discord.js');

const primaryButton = new ButtonBuilder()
    .setCustomId('main_action')
    .setLabel('Get Started')
    .setStyle(ButtonStyle.Primary);

const secondaryButton = new ButtonBuilder()
    .setCustomId('learn_more')
    .setLabel('Learn More')
    .setStyle(ButtonStyle.Secondary);

const successButton = new ButtonBuilder()
    .setCustomId('confirm_action')
    .setLabel('Confirm')
    .setStyle(ButtonStyle.Success);

const dangerButton = new ButtonBuilder()
    .setCustomId('delete_item')
    .setLabel('Delete')
    .setStyle(ButtonStyle.Danger);

const linkButton = new ButtonBuilder()
    .setURL('https://discord.js.org')
    .setLabel('Visit Discord.js')
    .setStyle(ButtonStyle.Link);
```

### Button Properties and Options

```javascript
const button = new ButtonBuilder()
    .setCustomId('advanced_button')
    .setLabel('Advanced Button')
    .setStyle(ButtonStyle.Primary)
    .setEmoji('rocket')
    .setDisabled(false);
```

### Emoji Usage in Buttons

```javascript
.setEmoji('gamepad')

.setEmoji('custom_emoji_id')

.setEmoji('zap').setLabel('Fast Action')

.setEmoji('x')
```

## Select Menus in Action Rows

### String Select Menus

```javascript
const { 
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder 
} = require('discord.js');

const selectMenu = new StringSelectMenuBuilder()
    .setCustomId('category_select')
    .setPlaceholder('Choose a category')
    .setMinValues(1)
    .setMaxValues(3)
    .addOptions(
        new StringSelectMenuOptionBuilder()
            .setLabel('Gaming')
            .setValue('gaming')
            .setDescription('Gaming related commands')
            .setEmoji('gamepad'),
        new StringSelectMenuOptionBuilder()
            .setLabel('Music')
            .setValue('music')
            .setDescription('Music and audio commands')
            .setEmoji('musical_note'),
        new StringSelectMenuOptionBuilder()
            .setLabel('Moderation')
            .setValue('moderation')
            .setDescription('Server moderation tools')
            .setEmoji('hammer')
            .setDefault(true)
    );

const selectActionRow = new ActionRowBuilder()
    .addComponents(selectMenu);
```

### User, Role, and Channel Select Menus

```javascript
const { 
    UserSelectMenuBuilder,
    RoleSelectMenuBuilder,
    ChannelSelectMenuBuilder,
    MentionableSelectMenuBuilder 
} = require('discord.js');

const userSelect = new UserSelectMenuBuilder()
    .setCustomId('select_users')
    .setPlaceholder('Select users')
    .setMinValues(1)
    .setMaxValues(5);

const roleSelect = new RoleSelectMenuBuilder()
    .setCustomId('select_roles')
    .setPlaceholder('Select roles')
    .setMinValues(1)
    .setMaxValues(3);

const channelSelect = new ChannelSelectMenuBuilder()
    .setCustomId('select_channels')
    .setPlaceholder('Select channels')
    .setChannelTypes([0, 2])
    .setMinValues(1)
    .setMaxValues(2);

const mentionableSelect = new MentionableSelectMenuBuilder()
    .setCustomId('select_mentions')
    .setPlaceholder('Select users or roles')
    .setMinValues(1)
    .setMaxValues(10);
```

## Action Row Patterns

### Navigation Pattern

```javascript
function createNavigationRow(currentPage, totalPages) {
    const components = [];
    
    if (currentPage > 1) {
        components.push(
            new ButtonBuilder()
                .setCustomId('nav_previous')
                .setLabel('Previous')
                .setEmoji('left_arrow')
                .setStyle(ButtonStyle.Secondary)
        );
    }
    
    components.push(
        new ButtonBuilder()
            .setCustomId('page_info')
            .setLabel(`${currentPage}/${totalPages}`)
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true)
    );
    
    if (currentPage < totalPages) {
        components.push(
            new ButtonBuilder()
                .setCustomId('nav_next')
                .setLabel('Next')
                .setEmoji('right_arrow')
                .setStyle(ButtonStyle.Secondary)
        );
    }
    
    return new ActionRowBuilder().addComponents(...components);
}
```

### Confirmation Pattern

```javascript
function createConfirmationRow(actionId, dangerLevel = 'normal') {
    const confirmStyle = dangerLevel === 'high' 
        ? ButtonStyle.Danger 
        : ButtonStyle.Success;
    
    return new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`confirm_${actionId}`)
                .setLabel('Confirm')
                .setStyle(confirmStyle)
                .setEmoji('check'),
            new ButtonBuilder()
                .setCustomId(`cancel_${actionId}`)
                .setLabel('Cancel')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('x')
        );
}

const deleteConfirmation = createConfirmationRow('delete_user', 'high');
const saveConfirmation = createConfirmationRow('save_settings', 'normal');
```

### Quick Actions Pattern

```javascript
const quickActionsRow = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('quick_help')
            .setEmoji('question')
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId('quick_settings')
            .setEmoji('gear')
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId('quick_stats')
            .setEmoji('bar_chart')
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId('quick_refresh')
            .setEmoji('arrows_counterclockwise')
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId('quick_close')
            .setEmoji('x')
            .setStyle(ButtonStyle.Secondary)
    );
```

## Advanced Action Row Techniques

### Dynamic Button Generation

```javascript
class ActionRowFactory {
    static createFromArray(actions) {
        const buttons = actions.map((action, index) => {
            return new ButtonBuilder()
                .setCustomId(action.id)
                .setLabel(action.label)
                .setStyle(action.style || ButtonStyle.Secondary)
                .setEmoji(action.emoji || null)
                .setDisabled(action.disabled || false);
        });
        
        const rows = [];
        for (let i = 0; i < buttons.length; i += 5) {
            const rowButtons = buttons.slice(i, i + 5);
            rows.push(new ActionRowBuilder().addComponents(...rowButtons));
        }
        
        return rows;
    }
    
    static createSelectWithActions(selectMenu, actions) {
        const rows = [
            new ActionRowBuilder().addComponents(selectMenu)
        ];
        
        if (actions && actions.length > 0) {
            const actionButtons = actions.map(action => 
                new ButtonBuilder()
                    .setCustomId(action.id)
                    .setLabel(action.label)
                    .setStyle(action.style || ButtonStyle.Secondary)
            );
            
            rows.push(new ActionRowBuilder().addComponents(...actionButtons));
        }
        
        return rows;
    }
}

const dynamicActions = [
    { id: 'action_1', label: 'Action 1', style: ButtonStyle.Primary },
    { id: 'action_2', label: 'Action 2', style: ButtonStyle.Secondary },
    { id: 'action_3', label: 'Action 3', style: ButtonStyle.Success, emoji: 'check' }
];

const actionRows = ActionRowFactory.createFromArray(dynamicActions);
```

### State-Aware Action Rows

```javascript
class StatefulActionRow {
    constructor(baseId) {
        this.baseId = baseId;
        this.state = 'default';
    }
    
    build() {
        switch (this.state) {
            case 'loading':
                return this.buildLoadingRow();
            case 'error':
                return this.buildErrorRow();
            case 'success':
                return this.buildSuccessRow();
            default:
                return this.buildDefaultRow();
        }
    }
    
    buildDefaultRow() {
        return new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`${this.baseId}_start`)
                    .setLabel('Start Process')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('play')
            );
    }
    
    buildLoadingRow() {
        return new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`${this.baseId}_loading`)
                    .setLabel('Processing...')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('hourglass')
                    .setDisabled(true)
            );
    }
    
    buildErrorRow() {
        return new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`${this.baseId}_retry`)
                    .setLabel('Retry')
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji('arrows_counterclockwise'),
                new ButtonBuilder()
                    .setCustomId(`${this.baseId}_cancel`)
                    .setLabel('Cancel')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('x')
            );
    }
    
    buildSuccessRow() {
        return new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`${this.baseId}_complete`)
                    .setLabel('Complete!')
                    .setStyle(ButtonStyle.Success)
                    .setEmoji('check')
                    .setDisabled(true),
                new ButtonBuilder()
                    .setCustomId(`${this.baseId}_new`)
                    .setLabel('Start New')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('sparkles')
            );
    }
    
    setState(newState) {
        this.state = newState;
        return this;
    }
}
```

## Integration with Components v2

### Combining Action Rows with Other Components

```javascript
const { 
    ContainerBuilder,
    TextDisplayBuilder,
    SectionBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize
} = require('discord.js');

const fullContainer = new ContainerBuilder()
    .setAccentColor(0x5865F2)
    .addTextDisplayComponents(
        new TextDisplayBuilder().setContent('# User Management Panel')
    )
    .addSectionComponents(
        new SectionBuilder()
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent('**Selected User: @john_doe**'),
                new TextDisplayBuilder().setContent('Role: Moderator\nJoined: Jan 15, 2023\nLast Active: 2 hours ago')
            )
            .setThumbnailAccessory(
                new ThumbnailBuilder()
                    .setURL('https://example.com/avatar.png')
                    .setDescription('User avatar')
            )
    )
    .addSeparatorComponents(
        new SeparatorBuilder()
            .setSpacing(SeparatorSpacingSize.Large)
            .setDivider(true)
    )
    .addActionRowComponents(
        new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('user_warn')
                    .setLabel('Warn')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('warning'),
                new ButtonBuilder()
                    .setCustomId('user_timeout')
                    .setLabel('Timeout')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('clock'),
                new ButtonBuilder()
                    .setCustomId('user_kick')
                    .setLabel('Kick')
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji('athletic_shoe'),
                new ButtonBuilder()
                    .setCustomId('user_ban')
                    .setLabel('Ban')
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji('hammer')
            )
    )
    .addActionRowComponents(
        new ActionRowBuilder()
            .addComponents(
                new RoleSelectMenuBuilder()
                    .setCustomId('assign_roles')
                    .setPlaceholder('Assign additional roles')
                    .setMinValues(0)
                    .setMaxValues(5)
            )
    );
```

## Collector Integration with Component Disabling

When using collectors with Components v2, properly disable interactive elements when they expire:

```javascript
_setupButtonCollector(messageOrInteraction, guildId, client, userId) {
    const message = messageOrInteraction.fetchReply ? messageOrInteraction : messageOrInteraction;
    const filter = (i) => i.user.id === userId && i.customId.endsWith(`_${guildId}`);
    const collector = message.createMessageComponentCollector({ filter, time: 300_000, max: 1 });

    collector.on("collect", async (interaction) => {
        await interaction.deferUpdate();
        
        // Handle interaction logic here
        
        await interaction.editReply({ 
            components: [newContainer],
            flags: MessageFlags.IsComponentsV2 
        });
    });

    collector.on("end", async (collected, reason) => {
        if (reason === 'limit') return;

        try {
            const currentMessage = await message.fetch().catch(() => null);
            if (!currentMessage?.components?.length) return;

            const containerComponent = currentMessage.components.find(
                (c) => c.type === ComponentType.Container
            );
            
            if (!containerComponent) return;

            const container = ContainerBuilder.from(containerComponent);

            for (const comp of container.components) {
                if (comp instanceof ActionRowBuilder) {
                    comp.components.forEach((inner) => {
                        if (
                            inner instanceof StringSelectMenuBuilder ||
                            inner instanceof UserSelectMenuBuilder ||
                            inner instanceof RoleSelectMenuBuilder ||
                            inner instanceof ChannelSelectMenuBuilder ||
                            inner instanceof MentionableSelectMenuBuilder
                        ) {
                            inner.setDisabled(true);
                        }
                        else if (
                            inner instanceof ButtonBuilder &&
                            inner.data.style !== ButtonStyle.Link
                        ) {
                            inner.setDisabled(true);
                        }
                    });
                }
                else if (comp instanceof SectionBuilder && comp.accessory?.data) {
                    if (comp.accessory.data.type === ComponentType.Button) {
                        comp.accessory.data.disabled = true;
                    }
                }
            }

            await currentMessage.edit({
                components: [container],
                flags: MessageFlags.IsComponentsV2
            });
        } catch (error) {
            if (error.code !== 10008) {
                client.logger?.error("Component", `Error disabling components: ${error.message}`, error);
            }
        }
    });
}
```

## Best Practices

### Button Design
- Use clear, action-oriented labels
- Apply appropriate styles for the action type
- Include emoji for visual clarity but don't overdo it
- Disable buttons when actions aren't available

### Select Menu Design
- Write descriptive placeholders
- Set appropriate min/max values
- Use option descriptions to clarify choices
- Pre-select sensible defaults when appropriate

### Layout Considerations
- Group related actions together
- Use consistent emoji and styling themes
- Consider mobile users - buttons should be easily tappable
- Don't overcrowd action rows

### State Management
- Disable buttons during processing
- Update button states to reflect current status
- Provide clear feedback for user actions
- Handle edge cases gracefully

## Interaction Handling

Action rows require proper interaction handling:

```javascript
client.on('interactionCreate', async interaction => {
    if (!interaction.isButton() && !interaction.isStringSelectMenu()) return;
    
    if (interaction.isButton()) {
        switch (interaction.customId) {
            case 'confirm_action':
                await interaction.reply({ 
                    content: 'Action confirmed!', 
                    ephemeral: true 
                });
                break;
                
            case 'cancel_action':
                await interaction.update({
                    content: 'Action cancelled',
                    components: []
                });
                break;
        }
    }
    
    if (interaction.isStringSelectMenu()) {
        const selectedValues = interaction.values;
        await interaction.reply({
            content: `You selected: ${selectedValues.join(', ')}`,
            ephemeral: true
        });
    }
});
```
