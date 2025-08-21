const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Display comprehensive user information')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('The user to get information about')
                .setRequired(false)
        ),

    async execute(interaction) {
        const targetUser = interaction.options.getUser('user') || interaction.user;
        
        try {
            // Fetch complete user data with new v14.22 properties
            const fetchedUser = await interaction.client.users.fetch(targetUser.id, { force: true });
            
            // Create main information embed
            const embed = new EmbedBuilder()
                .setTitle(`User Information: ${fetchedUser.tag}`)
                .setThumbnail(fetchedUser.displayAvatarURL({ size: 256 }))
                .setColor(fetchedUser.hexAccentColor || '#5865F2')
                .setTimestamp()
                .setFooter({ 
                    text: `Requested by ${interaction.user.tag}`, 
                    iconURL: interaction.user.displayAvatarURL() 
                });

            // Basic user information
            embed.addFields(
                {
                    name: 'Basic Information',
                    value: [
                        `**ID:** ${fetchedUser.id}`,
                        `**Username:** ${fetchedUser.username}`,
                        `**Global Name:** ${fetchedUser.globalName || 'None'}`,
                        `**Bot:** ${fetchedUser.bot ? 'Yes' : 'No'}`,
                        `**System:** ${fetchedUser.system ? 'Yes' : 'No'}`,
                        `**Created:** <t:${Math.floor(fetchedUser.createdTimestamp / 1000)}:F>`
                    ].join('\n'),
                    inline: true
                }
            );

            // Guild information (new in v14.22)
            if (fetchedUser.primaryGuild) {
                const guildInfo = [
                    `**Tag:** ${fetchedUser.primaryGuild.tag}`,
                    `**Guild ID:** ${fetchedUser.primaryGuild.identityGuildId}`,
                    `**Identity Enabled:** ${fetchedUser.primaryGuild.identityEnabled ? 'Yes' : 'No'}`
                ];

                embed.addFields({
                    name: 'Guild Tag Information',
                    value: guildInfo.join('\n'),
                    inline: true
                });
            }

            // Collectibles information (new in v14.22)
            if (fetchedUser.collectibles) {
                const collectiblesInfo = [];
                
                if (fetchedUser.collectibles.nameplate) {
                    const nameplate = fetchedUser.collectibles.nameplate;
                    collectiblesInfo.push(
                        `**Nameplate:** ${nameplate.label || 'Custom Nameplate'}`,
                        `**Palette:** ${nameplate.palette || 'Default'}`,
                        `**Asset:** ${nameplate.asset}`
                    );
                }

                if (collectiblesInfo.length > 0) {
                    embed.addFields({
                        name: 'Collectibles',
                        value: collectiblesInfo.join('\n'),
                        inline: true
                    });
                }
            }

            // Avatar decoration information (new in v14.22)
            if (fetchedUser.avatarDecorationData) {
                const decorationInfo = [
                    `**SKU ID:** ${fetchedUser.avatarDecorationData.skuId}`,
                    `**Asset:** ${fetchedUser.avatarDecorationData.asset}`
                ];

                embed.addFields({
                    name: 'Avatar Decoration',
                    value: decorationInfo.join('\n'),
                    inline: true
                });
            }

            // User flags
            if (fetchedUser.flags && fetchedUser.flags.bitfield > 0) {
                const flags = fetchedUser.flags.toArray().join(', ') || 'None';
                embed.addFields({
                    name: 'User Flags',
                    value: flags,
                    inline: false
                });
            }

            // Create action row with asset buttons
            const buttons = [];
            
            // Avatar button (always present)
            buttons.push(
                new ButtonBuilder()
                    .setLabel('Avatar')
                    .setStyle(ButtonStyle.Link)
                    .setURL(fetchedUser.displayAvatarURL({ size: 4096 }))
            );

            // Banner button (if available)
            if (fetchedUser.bannerURL) {
                buttons.push(
                    new ButtonBuilder()
                        .setLabel('Banner')
                        .setStyle(ButtonStyle.Link)
                        .setURL(fetchedUser.bannerURL({ size: 4096 }))
                );
            }

            // Avatar decoration button (new in v14.22)
            if (fetchedUser.avatarDecorationURL) {
                buttons.push(
                    new ButtonBuilder()
                        .setLabel('Avatar Decoration')
                        .setStyle(ButtonStyle.Link)
                        .setURL(fetchedUser.avatarDecorationURL({ size: 1024 }))
                );
            }

            // Guild tag badge button (new in v14.22)
            if (fetchedUser.guildTagBadgeURL) {
                buttons.push(
                    new ButtonBuilder()
                        .setLabel('Guild Badge')
                        .setStyle(ButtonStyle.Link)
                        .setURL(fetchedUser.guildTagBadgeURL({ size: 1024 }))
                );
            }

            // Create action rows (max 5 buttons per row)
            const actionRows = [];
            for (let i = 0; i < buttons.length; i += 5) {
                const row = new ActionRowBuilder()
                    .addComponents(buttons.slice(i, i + 5));
                actionRows.push(row);
            }

            // Send response with embed and buttons
            await interaction.reply({
                embeds: [embed],
                components: actionRows
            });

        } catch (error) {
            console.error('Error in userinfo command:', error);
            
            const errorEmbed = new EmbedBuilder()
                .setTitle('Error')
                .setDescription('An error occurred while fetching user information.')
                .setColor('#FF0000')
                .addFields({
                    name: 'Error Details',
                    value: `\`${error.message}\``,
                    inline: false
                });

            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
            } else {
                await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }
        }
    }
};

// Alternative message-based implementation for legacy bots
class MessageUserInfoHandler {
    constructor(client) {
        this.client = client;
    }

    async handleUserInfo(message) {
        const args = message.content.split(' ');
        let targetUser;

        // Parse target user from arguments or mentions
        if (args[1]) {
            const userId = args[1].replace(/[<@!>]/g, '');
            try {
                targetUser = await this.client.users.fetch(userId, { force: true });
            } catch {
                return message.reply('❌ User not found or invalid user ID.');
            }
        } else if (message.mentions.users.size > 0) {
            const mentionedUser = message.mentions.users.first();
            targetUser = await this.client.users.fetch(mentionedUser.id, { force: true });
        } else {
            targetUser = await this.client.users.fetch(message.author.id, { force: true });
        }

        try {
            // Generate comprehensive user information
            const userInfo = this.formatUserInfo(targetUser);
            
            // Split content if it exceeds Discord's message limit
            const chunks = this.splitContent(userInfo, 2000);
            
            for (let i = 0; i < chunks.length; i++) {
                if (i === 0) {
                    await message.reply(chunks[i]);
                } else {
                    await message.channel.send(chunks[i]);
                }
            }

        } catch (error) {
            console.error('Error in message-based userinfo:', error);
            await message.reply(`❌ Error fetching user information: ${error.message}`);
        }
    }

    formatUserInfo(user) {
        let content = `**User Information: ${user.tag}**\n`;
        
        // Basic information
        content += `\n**Basic Details:**\n`;
        content += `• **ID:** ${user.id}\n`;
        content += `• **Username:** ${user.username}\n`;
        content += `• **Global Name:** ${user.globalName || 'None'}\n`;
        content += `• **Bot:** ${user.bot ? 'Yes' : 'No'}\n`;
        content += `• **Created:** <t:${Math.floor(user.createdTimestamp / 1000)}:F>\n`;

        // Asset URLs
        content += `\n**Assets:**\n`;
        content += `• **Avatar:** ${user.displayAvatarURL({ size: 1024 })}\n`;
        
        if (user.bannerURL) {
            content += `• **Banner:** ${user.bannerURL({ size: 1024 })}\n`;
        }

        // New v14.22 features
        if (user.avatarDecorationURL) {
            content += `• **Avatar Decoration:** ${user.avatarDecorationURL({ size: 1024 })}\n`;
        }

        if (user.guildTagBadgeURL) {
            content += `• **Guild Tag Badge:** ${user.guildTagBadgeURL({ size: 1024 })}\n`;
        }

        // Primary guild information
        if (user.primaryGuild) {
            content += `\n**Guild Tag:**\n`;
            content += `• **Tag:** ${user.primaryGuild.tag}\n`;
            content += `• **Guild ID:** ${user.primaryGuild.identityGuildId}\n`;
            content += `• **Identity Enabled:** ${user.primaryGuild.identityEnabled ? 'Yes' : 'No'}\n`;
        }

        // Collectibles information
        if (user.collectibles) {
            content += `\n**Collectibles:**\n`;
            
            if (user.collectibles.nameplate) {
                const nameplate = user.collectibles.nameplate;
                content += `• **Nameplate Asset:** ${nameplate.asset}\n`;
                content += `• **Nameplate Palette:** ${nameplate.palette || 'Default'}\n`;
            }
        }

        // Avatar decoration data
        if (user.avatarDecorationData) {
            content += `\n**Avatar Decoration Details:**\n`;
            content += `• **Asset:** ${user.avatarDecorationData.asset}\n`;
            content += `• **SKU ID:** ${user.avatarDecorationData.skuId}\n`;
        }

        // User flags
        if (user.flags && user.flags.bitfield > 0) {
            const flags = user.flags.toArray();
            content += `\n**User Flags:** ${flags.join(', ')}\n`;
        }

        return content;
    }

    splitContent(content, maxLength) {
        if (content.length <= maxLength) return [content];
        
        const chunks = [];
        let currentChunk = '';
        const lines = content.split('\n');
        
        for (const line of lines) {
            if ((currentChunk + line + '\n').length > maxLength) {
                if (currentChunk) {
                    chunks.push(currentChunk.trim());
                    currentChunk = '';
                }
            }
            currentChunk += line + '\n';
        }
        
        if (currentChunk) {
            chunks.push(currentChunk.trim());
        }
        
        return chunks;
    }
}

module.exports.MessageUserInfoHandler = MessageUserInfoHandler;
