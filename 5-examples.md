# Discord.js Components v2 - Examples Collection

## Real-World Application Examples

### 1. Server Dashboard

A comprehensive server management dashboard demonstrating multiple component types working together:

```javascript
const { 
    ContainerBuilder,
    TextDisplayBuilder,
    SectionBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    ButtonBuilder,
    ButtonStyle,
    ThumbnailBuilder,
    MediaGalleryBuilder,
    MediaGalleryItemBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    MessageFlags
} = require('discord.js');

async function createServerDashboard(guildData) {
    const container = new ContainerBuilder()
        .setAccentColor(0x5865F2)
        
        // Header with server info
        .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(`# ${guildData.name} Dashboard\nServer management and statistics`)
        )
        
        // Server stats section
        .addSectionComponents(
            new SectionBuilder()
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent('**Server Statistics**'),
                    new TextDisplayBuilder().setContent(`👥 **Members**: ${guildData.memberCount.toLocaleString()}\n🟢 **Online**: ${guildData.onlineCount}\n📊 **Growth**: +${guildData.weeklyGrowth} this week`),
                    new TextDisplayBuilder().setContent(`📅 **Created**: ${guildData.createdDate}\n🎯 **Boost Level**: ${guildData.boostLevel}\n⭐ **Boosts**: ${guildData.boostCount}`)
                )
                .setThumbnailAccessory(
                    new ThumbnailBuilder()
                        .setURL(guildData.iconURL)
                        .setDescription(`${guildData.name} server icon`)
                )
        )
        
        // Activity section
        .addSeparatorComponents(
            new SeparatorBuilder()
                .setSpacing(SeparatorSpacingSize.Large)
                .setDivider(true)
        )
        
        .addSectionComponents(
            new SectionBuilder()
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent('**Recent Activity**'),
                    new TextDisplayBuilder().setContent(`💬 **Messages Today**: ${guildData.todayMessages}\n👋 **New Joins**: ${guildData.todayJoins}\n🚪 **Leaves**: ${guildData.todayLeaves}`)
                )
                .setButtonAccessory(
                    new ButtonBuilder()
                        .setCustomId('refresh_activity')
                        .setLabel('Refresh')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji('🔄')
                )
        )
        
        // Top channels
        .addSectionComponents(
            new SectionBuilder()
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent('**Most Active Channels**'),
                    new TextDisplayBuilder().setContent(
                        guildData.topChannels.map(ch => 
                            `${ch.emoji} **${ch.name}**: ${ch.messageCount} messages`
                        ).join('\n')
                    )
                )
        )
        
        // Management actions
        .addSeparatorComponents(
            new SeparatorBuilder()
                .setSpacing(SeparatorSpacingSize.Large)
                .setDivider(true)
        )
        
        .addActionRowComponents(
            new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('manage_members')
                        .setLabel('Manage Members')
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji('👥'),
                    new ButtonBuilder()
                        .setCustomId('manage_channels')
                        .setLabel('Channels')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji('📁'),
                    new ButtonBuilder()
                        .setCustomId('manage_roles')
                        .setLabel('Roles')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji('🏷️'),
                    new ButtonBuilder()
                        .setCustomId('server_settings')
                        .setLabel('Settings')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji('⚙️')
                )
        );
    
    return {
        components: [container],
        flags: MessageFlags.IsComponentsV2
    };
}
```

### 2. Music Bot Player Interface

A modern music player interface with rich controls:

```javascript
async function createMusicPlayer(currentTrack, queue, playerState) {
    const container = new ContainerBuilder()
        .setAccentColor(0xFF6B6B)
        
        // Now playing header
        .addTextDisplayComponents(
            new TextDisplayBuilder().setContent('🎵 **Now Playing**')
        )
        
        // Current track info with thumbnail
        .addSectionComponents(
            new SectionBuilder()
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent(`# ${currentTrack.title}`),
                    new TextDisplayBuilder().setContent(`**Artist**: ${currentTrack.artist}\n**Duration**: ${currentTrack.duration}\n**Requested by**: ${currentTrack.requester}`),
                    new TextDisplayBuilder().setContent(`⏱️ ${playerState.currentTime} / ${currentTrack.duration}`)
                )
                .setThumbnailAccessory(
                    new ThumbnailBuilder()
                        .setURL(currentTrack.thumbnail)
                        .setDescription('Track thumbnail')
                )
        )
        
        // Progress bar (visual)
        .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(
                createProgressBar(playerState.currentTime, currentTrack.totalTime)
            )
        )
        
        // Player controls
        .addActionRowComponents(
            new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('music_previous')
                        .setEmoji('⏮️')
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(!queue.hasPrevious),
                    new ButtonBuilder()
                        .setCustomId('music_playpause')
                        .setEmoji(playerState.playing ? '⏸️' : '▶️')
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId('music_stop')
                        .setEmoji('⏹️')
                        .setStyle(ButtonStyle.Danger),
                    new ButtonBuilder()
                        .setCustomId('music_next')
                        .setEmoji('⏭️')
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(!queue.hasNext),
                    new ButtonBuilder()
                        .setCustomId('music_shuffle')
                        .setEmoji('🔀')
                        .setStyle(playerState.shuffle ? ButtonStyle.Success : ButtonStyle.Secondary)
                )
        )
        
        // Volume and options
        .addActionRowComponents(
            new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('music_volume_down')
                        .setEmoji('🔉')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId('music_volume_info')
                        .setLabel(`${playerState.volume}%`)
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(true),
                    new ButtonBuilder()
                        .setCustomId('music_volume_up')
                        .setEmoji('🔊')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId('music_repeat')
                        .setEmoji(getRepeatEmoji(playerState.repeat))
                        .setStyle(playerState.repeat !== 'off' ? ButtonStyle.Success : ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId('music_queue')
                        .setLabel(`Queue (${queue.length})`)
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji('📋')
                )
        );
    
    // Add queue preview if there are upcoming tracks
    if (queue.length > 0) {
        container.addSeparatorComponents(
            new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small)
        );
        
        const upNext = queue.slice(0, 3);
        const queueText = upNext.map((track, index) => 
            `${index + 1}. **${track.title}** - ${track.artist}`
        ).join('\n');
        
        container.addSectionComponents(
            new SectionBuilder()
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent('**Up Next**'),
                    new TextDisplayBuilder().setContent(queueText + (queue.length > 3 ? `\n...and ${queue.length - 3} more` : ''))
                )
                .setButtonAccessory(
                    new ButtonBuilder()
                        .setCustomId('view_full_queue')
                        .setLabel('View All')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji('📋')
                )
        );
    }
    
    return {
        components: [container],
        flags: MessageFlags.IsComponentsV2
    };
}

function createProgressBar(current, total, length = 20) {
    const progress = Math.floor((current / total) * length);
    const bar = '█'.repeat(progress) + '░'.repeat(length - progress);
    return `\`${bar}\``;
}

function getRepeatEmoji(repeatMode) {
    switch (repeatMode) {
        case 'track': return '🔂';
        case 'queue': return '🔁';
        default: return '▶️';
    }
}
```

### 3. E-commerce Product Showcase

A product display system with purchase options:

```javascript
async function createProductShowcase(product) {
    const container = new ContainerBuilder()
        .setAccentColor(0x57F287)
        
        // Product header
        .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(`# ${product.name}\n**${product.price}** ${product.originalPrice ? `~~${product.originalPrice}~~` : ''}`)
        )
        
        // Product images
        .addMediaGalleryComponents(
            new MediaGalleryBuilder()
                .addItems(
                    ...product.images.map(img => 
                        new MediaGalleryItemBuilder()
                            .setURL(img.url)
                            .setDescription(img.description)
                    )
                )
        )
        
        // Product details
        .addSectionComponents(
            new SectionBuilder()
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent('**Product Details**'),
                    new TextDisplayBuilder().setContent(product.description),
                    new TextDisplayBuilder().setContent(`⭐ **Rating**: ${product.rating}/5 (${product.reviewCount} reviews)\n📦 **Stock**: ${product.stock} available\n🚚 **Shipping**: ${product.shipping}`)
                )
        )
        
        // Features
        .addSeparatorComponents(
            new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small)
        )
        
        .addSectionComponents(
            new SectionBuilder()
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent('**Features**'),
                    new TextDisplayBuilder().setContent(
                        product.features.map(feature => `✅ ${feature}`).join('\n')
                    )
                )
        )
        
        // Purchase options
        .addSeparatorComponents(
            new SeparatorBuilder()
                .setSpacing(SeparatorSpacingSize.Large)
                .setDivider(true)
        )
        
        // Quantity selector
        .addActionRowComponents(
            new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('select_quantity')
                        .setPlaceholder('Select quantity')
                        .addOptions(
                            ...Array.from({length: Math.min(product.stock, 10)}, (_, i) => 
                                new StringSelectMenuOptionBuilder()
                                    .setLabel(`${i + 1} item${i > 0 ? 's' : ''}`)
                                    .setValue(`quantity_${i + 1}`)
                                    .setDescription(`${product.price * (i + 1)}`)
                            )
                        )
                )
        )
        
        // Action buttons
        .addActionRowComponents(
            new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('add_to_cart')
                        .setLabel('Add to Cart')
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji('🛒')
                        .setDisabled(product.stock === 0),
                    new ButtonBuilder()
                        .setCustomId('buy_now')
                        .setLabel('Buy Now')
                        .setStyle(ButtonStyle.Success)
                        .setEmoji('💳')
                        .setDisabled(product.stock === 0),
                    new ButtonBuilder()
                        .setCustomId('add_to_wishlist')
                        .setLabel('Wishlist')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji('❤️'),
                    new ButtonBuilder()
                        .setCustomId('share_product')
                        .setLabel('Share')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji('📤')
                )
        );
    
    // Add stock warning if low
    if (product.stock <= 5 && product.stock > 0) {
        container.addTextDisplayComponents(
            new TextDisplayBuilder().setContent(`⚠️ **Only ${product.stock} left in stock!**`)
        );
    } else if (product.stock === 0) {
        container.addTextDisplayComponents(
            new TextDisplayBuilder().setContent('❌ **Currently out of stock**')
        );
    }
    
    return {
        components: [container],
        flags: MessageFlags.IsComponentsV2
    };
}
```

### 4. Support Ticket System

A comprehensive support ticket interface:

```javascript
async function createSupportTicket(ticket) {
    const statusColors = {
        open: 0x00FF00,
        in_progress: 0xFFFF00,
        waiting: 0xFF8C00,
        closed: 0xFF0000
    };
    
    const statusEmojis = {
        open: '🟢',
        in_progress: '🟡',
        waiting: '🟠',
        closed: '🔴'
    };
    
    const container = new ContainerBuilder()
        .setAccentColor(statusColors[ticket.status])
        
        // Ticket header
        .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(`# Support Ticket #${ticket.id}\n${statusEmojis[ticket.status]} **Status**: ${ticket.status.replace('_', ' ').toUpperCase()}`)
        )
        
        // Ticket details
        .addSectionComponents(
            new SectionBuilder()
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent('**Ticket Information**'),
                    new TextDisplayBuilder().setContent(`📧 **Subject**: ${ticket.subject}\n👤 **Created by**: ${ticket.author.tag}\n📅 **Created**: ${ticket.createdAt}`),
                    new TextDisplayBuilder().setContent(`🏷️ **Category**: ${ticket.category}\n⏰ **Priority**: ${ticket.priority}\n👨‍💼 **Assigned**: ${ticket.assignedTo || 'Unassigned'}`)
                )
                .setThumbnailAccessory(
                    new ThumbnailBuilder()
                        .setURL(ticket.author.avatar)
                        .setDescription(`${ticket.author.tag}'s avatar`)
                )
        )
        
        // Original message
        .addSeparatorComponents(
            new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small)
        )
        
        .addSectionComponents(
            new SectionBuilder()
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent('**Original Message**'),
                    new TextDisplayBuilder().setContent(ticket.originalMessage.substring(0, 800) + (ticket.originalMessage.length > 800 ? '...' : ''))
                )
        );
    
    // Add attachments if any
    if (ticket.attachments && ticket.attachments.length > 0) {
        container.addTextDisplayComponents(
            new TextDisplayBuilder().setContent(`**Attachments** (${ticket.attachments.length})`)
        );
        
        for (const attachment of ticket.attachments.slice(0, 3)) {
            container.addFileComponents(
                new FileBuilder()
                    .setURL(`attachment://${attachment.name}`)
                    .setSpoiler(false)
            );
        }
        
        if (ticket.attachments.length > 3) {
            container.addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`...and ${ticket.attachments.length - 3} more attachments`)
            );
        }
    }
    
    // Recent activity
    if (ticket.recentActivity.length > 0) {
        container.addSeparatorComponents(
            new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small)
        );
        
        const recentText = ticket.recentActivity.slice(0, 3).map(activity => 
            `• **${activity.author}** ${activity.action} - ${activity.timestamp}`
        ).join('\n');
        
        container.addSectionComponents(
            new SectionBuilder()
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent('**Recent Activity**'),
                    new TextDisplayBuilder().setContent(recentText)
                )
                .setButtonAccessory(
                    new ButtonBuilder()
                        .setCustomId(`view_activity_${ticket.id}`)
                        .setLabel('View All')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji('📋')
                )
        );
    }
    
    // Management actions
    container.addSeparatorComponents(
        new SeparatorBuilder()
            .setSpacing(SeparatorSpacingSize.Large)
            .setDivider(true)
    );
    
    // Status management
    const statusActions = [];
    
    if (ticket.status === 'open') {
        statusActions.push(
            new ButtonBuilder()
                .setCustomId(`ticket_claim_${ticket.id}`)
                .setLabel('Claim')
                .setStyle(ButtonStyle.Primary)
                .setEmoji('👋')
        );
    }
    
    if (ticket.status !== 'closed') {
        statusActions.push(
            new ButtonBuilder()
                .setCustomId(`ticket_close_${ticket.id}`)
                .setLabel('Close')
                .setStyle(ButtonStyle.Danger)
                .setEmoji('🔒')
        );
    }
    
    statusActions.push(
        new ButtonBuilder()
            .setCustomId(`ticket_reply_${ticket.id}`)
            .setLabel('Reply')
            .setStyle(ButtonStyle.Success)
            .setEmoji('💬'),
        new ButtonBuilder()
            .setCustomId(`ticket_note_${ticket.id}`)
            .setLabel('Add Note')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('📝')
    );
    
    container.addActionRowComponents(
        new ActionRowBuilder().addComponents(...statusActions.slice(0, 5))
    );
    
    // Priority and assignment
    container.addActionRowComponents(
        new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId(`ticket_priority_${ticket.id}`)
                    .setPlaceholder('Change priority')
                    .addOptions(
                        new StringSelectMenuOptionBuilder()
                            .setLabel('Low Priority')
                            .setValue('low')
                            .setEmoji('🟢')
                            .setDefault(ticket.priority === 'low'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('Medium Priority')
                            .setValue('medium')
                            .setEmoji('🟡')
                            .setDefault(ticket.priority === 'medium'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('High Priority')
                            .setValue('high')
                            .setEmoji('🟠')
                            .setDefault(ticket.priority === 'high'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('Urgent')
                            .setValue('urgent')
                            .setEmoji('🔴')
                            .setDefault(ticket.priority === 'urgent')
                    )
            )
    );
    
    return {
        components: [container],
        files: ticket.attachments || [],
        flags: MessageFlags.IsComponentsV2
    };
}
```

### 5. Game Leaderboard

A dynamic gaming leaderboard with player profiles:

```javascript
async function createGameLeaderboard(gameData, players, currentPlayer) {
    const container = new ContainerBuilder()
        .setAccentColor(0x9932CC)
        
        // Header with game info
        .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(`# ${gameData.name} Leaderboard\n🏆 **Season ${gameData.season}** • Updated ${gameData.lastUpdated}`)
        )
        
        // Top 3 players showcase
        .addSectionComponents(
            new SectionBuilder()
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent('**🥇 Champion**'),
                    new TextDisplayBuilder().setContent(`**${players[0].username}**\n⭐ Level ${players[0].level} • ${players[0].score.toLocaleString()} points\n🔥 Win Streak: ${players[0].winStreak}`),
                    new TextDisplayBuilder().setContent(`🏅 Rank #1 • ${players[0].gamesPlayed} games played`)
                )
                .setThumbnailAccessory(
                    new ThumbnailBuilder()
                        .setURL(players[0].avatar)
                        .setDescription(`${players[0].username}'s avatar`)
                )
        );
    
    // 2nd and 3rd place
    if (players.length >= 2) {
        container.addSectionComponents(
            new SectionBuilder()
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent('**🥈 Runner-up & 🥉 Third Place**'),
                    new TextDisplayBuilder().setContent(`**#2 ${players[1].username}** - ${players[1].score.toLocaleString()} pts\n**#3 ${players[2]?.username || 'Vacant'}** - ${players[2]?.score.toLocaleString() || '0'} pts`)
                )
        );
    }
    
    // Current player's ranking (if not in top 3)
    if (currentPlayer && currentPlayer.rank > 3) {
        container.addSeparatorComponents(
            new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small)
        );
        
        container.addSectionComponents(
            new SectionBuilder()
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent('**Your Ranking**'),
                    new TextDisplayBuilder().setContent(`**${currentPlayer.username}** (#${currentPlayer.rank})\n⭐ Level ${currentPlayer.level} • ${currentPlayer.score.toLocaleString()} points`),
                    new TextDisplayBuilder().setContent(`📈 Progress: ${currentPlayer.progressToNext}pts to next rank`)
                )
                .setButtonAccessory(
                    new ButtonBuilder()
                        .setCustomId('view_my_profile')
                        .setLabel('My Profile')
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji('👤')
                )
        );
    }
    
    // Full leaderboard preview
    container.addSeparatorComponents(
        new SeparatorBuilder()
            .setSpacing(SeparatorSpacingSize.Large)
            .setDivider(true)
    );
    
    const topTenText = players.slice(0, 10).map((player, index) => {
        const medals = ['🥇', '🥈', '🥉'];
        const prefix = index < 3 ? medals[index] : `**#${index + 1}**`;
        return `${prefix} ${player.username} - ${player.score.toLocaleString()}`;
    }).join('\n');
    
    container.addSectionComponents(
        new SectionBuilder()
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent('**Top 10 Players**'),
                new TextDisplayBuilder().setContent(topTenText)
            )
            .setButtonAccessory(
                new ButtonBuilder()
                    .setCustomId('view_full_leaderboard')
                    .setLabel('View All')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('📋')
            )
    );
    
    // Game actions
    container.addActionRowComponents(
        new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('start_game')
                    .setLabel('Play Now')
                    .setStyle(ButtonStyle.Success)
                    .setEmoji('🎮'),
                new ButtonBuilder()
                    .setCustomId('view_stats')
                    .setLabel('My Stats')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('📊'),
                new ButtonBuilder()
                    .setCustomId('achievements')
                    .setLabel('Achievements')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('🏆'),
                new ButtonBuilder()
                    .setCustomId('game_rules')
                    .setLabel('Rules')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('📖')
            )
    );
    
    // Filter options
    container.addActionRowComponents(
        new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('leaderboard_filter')
                    .setPlaceholder('Filter leaderboard')
                    .addOptions(
                        new StringSelectMenuOptionBuilder()
                            .setLabel('All Time')
                            .setValue('all_time')
                            .setEmoji('🏆')
                            .setDefault(true),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('This Month')
                            .setValue('monthly')
                            .setEmoji('📅'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('This Week')
                            .setValue('weekly')
                            .setEmoji('📊'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('Today')
                            .setValue('daily')
                            .setEmoji('⏰'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('Friends Only')
                            .setValue('friends')
                            .setEmoji('👥')
                    )
            )
    );
    
    return {
        components: [container],
        flags: MessageFlags.IsComponentsV2
    };
}
```

### 6. Event Management System

A complete event organization interface:

```javascript
async function createEventManagement(event) {
    const container = new ContainerBuilder()
        .setAccentColor(0xFF4444)
        
        // Event header
        .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(`# 📅 ${event.title}\n${event.description}`)
        );
    
    // Event banner if available
    if (event.bannerURL) {
        container.addMediaGalleryComponents(
            new MediaGalleryBuilder()
                .addItems(
                    new MediaGalleryItemBuilder()
                        .setURL(event.bannerURL)
                        .setDescription('Event banner')
                )
        );
    }
    
    // Event details
    container.addSectionComponents(
        new SectionBuilder()
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent('**Event Details**'),
                new TextDisplayBuilder().setContent(`📅 **Date**: ${event.date}\n⏰ **Time**: ${event.time}\n📍 **Location**: ${event.location}`),
                new TextDisplayBuilder().setContent(`👥 **Capacity**: ${event.attendees.length}/${event.maxCapacity}\n💰 **Price**: ${event.price}\n🎯 **Category**: ${event.category}`)
            )
            .setButtonAccessory(
                new ButtonBuilder()
                    .setCustomId(`event_details_${event.id}`)
                    .setLabel('Full Details')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('ℹ️')
            )
    );
    
    // Organizer info
    container.addSectionComponents(
        new SectionBuilder()
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent('**Organized by**'),
                new TextDisplayBuilder().setContent(`**${event.organizer.name}**\n${event.organizer.bio}`)
            )
            .setThumbnailAccessory(
                new ThumbnailBuilder()
                    .setURL(event.organizer.avatar)
                    .setDescription(`${event.organizer.name}'s avatar`)
            )
    );
    
    // Attendance status
    const userStatus = event.attendees.find(a => a.id === event.currentUserId);
    const statusText = userStatus ? 
        `✅ You're attending${userStatus.plusOne ? ' (+1)' : ''}` :
        '❌ You\'re not attending';
    
    container.addSeparatorComponents(
        new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small)
    );
    
    container.addTextDisplayComponents(
        new TextDisplayBuilder().setContent(`**Your Status**: ${statusText}`)
    );
    
    // Attendance actions
    const attendanceButtons = [];
    
    if (!userStatus) {
        attendanceButtons.push(
            new ButtonBuilder()
                .setCustomId(`event_join_${event.id}`)
                .setLabel('Join Event')
                .setStyle(ButtonStyle.Success)
                .setEmoji('✅')
                .setDisabled(event.attendees.length >= event.maxCapacity)
        );
    } else {
        attendanceButtons.push(
            new ButtonBuilder()
                .setCustomId(`event_leave_${event.id}`)
                .setLabel('Leave Event')
                .setStyle(ButtonStyle.Danger)
                .setEmoji('❌')
        );
    }
    
    attendanceButtons.push(
        new ButtonBuilder()
            .setCustomId(`event_invite_${event.id}`)
            .setLabel('Invite Friends')
            .setStyle(ButtonStyle.Primary)
            .setEmoji('📧'),
        new ButtonBuilder()
            .setCustomId(`event_share_${event.id}`)
            .setLabel('Share')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('🔗')
    );
    
    // Add waitlist button if event is full
    if (event.attendees.length >= event.maxCapacity && !userStatus) {
        attendanceButtons[0] = new ButtonBuilder()
            .setCustomId(`event_waitlist_${event.id}`)
            .setLabel('Join Waitlist')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('⏳');
    }
    
    container.addActionRowComponents(
        new ActionRowBuilder().addComponents(...attendanceButtons.slice(0, 5))
    );
    
    // Event management (for organizers)
    if (event.currentUserId === event.organizer.id) {
        container.addSeparatorComponents(
            new SeparatorBuilder()
                .setSpacing(SeparatorSpacingSize.Large)
                .setDivider(true)
        );
        
        container.addTextDisplayComponents(
            new TextDisplayBuilder().setContent('**🔧 Event Management**')
        );
        
        container.addActionRowComponents(
            new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`event_edit_${event.id}`)
                        .setLabel('Edit Event')
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji('✏️'),
                    new ButtonBuilder()
                        .setCustomId(`event_attendees_${event.id}`)
                        .setLabel(`Attendees (${event.attendees.length})`)
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji('👥'),
                    new ButtonBuilder()
                        .setCustomId(`event_broadcast_${event.id}`)
                        .setLabel('Send Update')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji('📢'),
                    new ButtonBuilder()
                        .setCustomId(`event_cancel_${event.id}`)
                        .setLabel('Cancel Event')
                        .setStyle(ButtonStyle.Danger)
                        .setEmoji('🗑️')
                )
        );
    }
    
    // Recent activity
    if (event.recentActivity.length > 0) {
        container.addSeparatorComponents(
            new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small)
        );
        
        const activityText = event.recentActivity.slice(0, 3).map(activity => 
            `• **${activity.user}** ${activity.action} - ${activity.time}`
        ).join('\n');
        
        container.addSectionComponents(
            new SectionBuilder()
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent('**Recent Activity**'),
                    new TextDisplayBuilder().setContent(activityText)
                )
        );
    }
    
    return {
        components: [container],
        flags: MessageFlags.IsComponentsV2
    };
}
```

## Migration Examples

### Converting from Traditional Embeds

```javascript
// Before: Traditional embed
const oldEmbed = new EmbedBuilder()
    .setTitle('Server Status')
    .setDescription('Current server information')
    .setColor(0x00FF00)
    .addFields(
        { name: 'Status', value: 'Online', inline: true },
        { name: 'Players', value: '42/100', inline: true },
        { name: 'Uptime', value: '7d 12h 30m', inline: true }
    )
    .setImage('https://example.com/server.png')
    .setTimestamp();

await interaction.reply({ embeds: [oldEmbed] });

// After: Components v2 equivalent
const newContainer = new ContainerBuilder()
    .setAccentColor(0x00FF00)
    .addTextDisplayComponents(
        new TextDisplayBuilder().setContent('# Server Status\nCurrent server information')
    )
    .addSectionComponents(
        new SectionBuilder()
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent('**Status**: Online'),
                new TextDisplayBuilder().setContent('**Players**: 42/100\n**Uptime**: 7d 12h 30m')
            )
    )
    .addMediaGalleryComponents(
        new MediaGalleryBuilder()
            .addItems(
                new MediaGalleryItemBuilder()
                    .setURL('https://example.com/server.png')
                    .setDescription('Server status image')
            )
    )
    .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(`*Last updated: ${new Date().toLocaleString()}*`)
    );

await interaction.reply({
    components: [newContainer],
    flags: MessageFlags.IsComponentsV2
});
```

### Home
[home](./readMe.md)
