const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roleinfo')
        .setDescription('Display comprehensive role information with gradient visualization')
        .addRoleOption(option =>
            option
                .setName('role')
                .setDescription('The role to get information about')
                .setRequired(true)
        ),

    async execute(interaction) {
        const targetRole = interaction.options.getRole('role');
        
        try {
            // Fetch complete role data
            const role = await interaction.guild.roles.fetch(targetRole.id);
            
            if (!role) {
                return await interaction.reply({
                    content: '❌ Role not found.',
                    ephemeral: true
                });
            }

            // Create main information embed
            const embed = new EmbedBuilder()
                .setTitle(`Role Information: ${role.name}`)
                .setColor(role.color || '#5865F2')
                .setTimestamp()
                .setFooter({ 
                    text: `Requested by ${interaction.user.tag}`, 
                    iconURL: interaction.user.displayAvatarURL() 
                });

            // Add role icon if available
            if (role.icon) {
                embed.setThumbnail(role.iconURL({ size: 256 }));
            }

            // Basic role information
            embed.addFields(
                {
                    name: 'Basic Information',
                    value: [
                        `**ID:** ${role.id}`,
                        `**Name:** ${role.name}`,
                        `**Color:** ${role.hexColor}`,
                        `**Position:** ${role.position}`,
                        `**Hoisted:** ${role.hoist ? 'Yes' : 'No'}`,
                        `**Mentionable:** ${role.mentionable ? 'Yes' : 'No'}`,
                        `**Managed:** ${role.managed ? 'Yes' : 'No'}`,
                        `**Created:** <t:${Math.floor(role.createdTimestamp / 1000)}:F>`
                    ].join('\n'),
                    inline: true
                },
                {
                    name: 'Members',
                    value: `**Count:** ${role.members.size}`,
                    inline: true
                }
            );

            // Enhanced gradient colors information (new in v14.22)
            if (role.colors) {
                const colorInfo = [];
                
                if (role.colors.primaryColor !== null && role.colors.primaryColor !== undefined) {
                    colorInfo.push(`**Primary:** ${this.intToHex(role.colors.primaryColor)} (${role.colors.primaryColor})`);
                }
                if (role.colors.secondaryColor !== null && role.colors.secondaryColor !== undefined) {
                    colorInfo.push(`**Secondary:** ${this.intToHex(role.colors.secondaryColor)} (${role.colors.secondaryColor})`);
                }
                if (role.colors.tertiaryColor !== null && role.colors.tertiaryColor !== undefined) {
                    colorInfo.push(`**Tertiary:** ${this.intToHex(role.colors.tertiaryColor)} (${role.colors.tertiaryColor})`);
                }

                if (colorInfo.length > 0) {
                    embed.addFields({
                        name: 'Gradient Colors',
                        value: colorInfo.join('\n'),
                        inline: false
                    });
                }
            }

            // Role permissions
            if (role.permissions.bitfield > 0n) {
                const keyPermissions = role.permissions.toArray()
                    .filter(perm => !['USE_EXTERNAL_EMOJIS', 'USE_VAD', 'CONNECT'].includes(perm))
                    .slice(0, 10); // Show first 10 important permissions
                
                if (keyPermissions.length > 0) {
                    embed.addFields({
                        name: `Key Permissions (${role.permissions.toArray().length} total)`,
                        value: keyPermissions.map(perm => `• ${perm.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}`).join('\n'),
                        inline: false
                    });
                }
            }

            const components = [];
            let attachment = null;

            // Create gradient visualization if role has colors
            if (role.colors) {
                const gradientBuffer = await this.createGradientImage(role);
                if (gradientBuffer) {
                    attachment = new AttachmentBuilder(gradientBuffer, { 
                        name: `role-gradient-${role.id}.png` 
                    });
                    embed.setImage(`attachment://role-gradient-${role.id}.png`);
                }
            }

            // Create action buttons
            const buttons = [];
            
            // Role icon button (if available)
            if (role.icon) {
                buttons.push(
                    new ButtonBuilder()
                        .setLabel('Role Icon')
                        .setStyle(ButtonStyle.Link)
                        .setURL(role.iconURL({ size: 1024 }))
                );
            }

            // Add members list button for smaller roles
            if (role.members.size > 0 && role.members.size <= 50) {
                buttons.push(
                    new ButtonBuilder()
                        .setCustomId(`role_members_${role.id}`)
                        .setLabel(`View Members (${role.members.size})`)
                        .setStyle(ButtonStyle.Secondary)
                );
            }

            // Add permissions button
            if (role.permissions.bitfield > 0n) {
                buttons.push(
                    new ButtonBuilder()
                        .setCustomId(`role_permissions_${role.id}`)
                        .setLabel('All Permissions')
                        .setStyle(ButtonStyle.Secondary)
                );
            }

            if (buttons.length > 0) {
                const actionRow = new ActionRowBuilder().addComponents(buttons.slice(0, 5));
                components.push(actionRow);
            }

            // Send response
            const replyOptions = {
                embeds: [embed],
                components: components
            };

            if (attachment) {
                replyOptions.files = [attachment];
            }

            await interaction.reply(replyOptions);

        } catch (error) {
            console.error('Error in roleinfo command:', error);
            
            const errorEmbed = new EmbedBuilder()
                .setTitle('Error')
                .setDescription('An error occurred while fetching role information.')
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
    },

    // Utility method for converting integer colors to hex
    intToHex(color) {
        if (color === null || color === undefined) return '#000000';
        return '#' + color.toString(16).padStart(6, '0').toUpperCase();
    },

    // Utility method for determining contrasting text color
    getContrastColor(hexColor) {
        const r = parseInt(hexColor.slice(1, 3), 16);
        const g = parseInt(hexColor.slice(3, 5), 16);
        const b = parseInt(hexColor.slice(5, 7), 16);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness > 128 ? '#000000' : '#FFFFFF';
    },

    // Create gradient visualization image
    async createGradientImage(role) {
        try {
            // This would require canvas package: npm install canvas
            // Commented out to avoid dependency issues in example
            /*
            const { createCanvas } = require('canvas');
            const canvas = createCanvas(800, 200);
            const ctx = canvas.getContext('2d');

            const availableColors = [];
            if (role.colors.primaryColor !== null && role.colors.primaryColor !== undefined) {
                availableColors.push(role.colors.primaryColor);
            }
            if (role.colors.secondaryColor !== null && role.colors.secondaryColor !== undefined) {
                availableColors.push(role.colors.secondaryColor);
            }
            if (role.colors.tertiaryColor !== null && role.colors.tertiaryColor !== undefined) {
                availableColors.push(role.colors.tertiaryColor);
            }

            if (availableColors.length === 0) return null;

            if (availableColors.length === 1) {
                const color = this.intToHex(availableColors[0]);
                ctx.fillStyle = color;
                ctx.fillRect(0, 0, 800, 200);

                ctx.fillStyle = this.getContrastColor(color);
                ctx.font = '24px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(role.name, 400, 100);
                ctx.fillText(`Color: ${color}`, 400, 140);
            } else {
                const gradient = ctx.createLinearGradient(0, 0, 800, 0);

                for (let i = 0; i < availableColors.length; i++) {
                    const position = i / (availableColors.length - 1);
                    const color = this.intToHex(availableColors[i]);
                    gradient.addColorStop(position, color);
                }

                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, 800, 200);

                // Add text with outline for better visibility
                ctx.fillStyle = '#FFFFFF';
                ctx.strokeStyle = '#000000';
                ctx.lineWidth = 2;
                ctx.font = 'bold 24px Arial';
                ctx.textAlign = 'center';

                ctx.strokeText(role.name, 400, 80);
                ctx.fillText(role.name, 400, 80);

                const colorText = availableColors.map(c => this.intToHex(c)).join(' → ');
                ctx.font = '16px Arial';
                ctx.strokeText(`Colors: ${colorText}`, 400, 120);
                ctx.fillText(`Colors: ${colorText}`, 400, 120);

                ctx.strokeText(`Gradient Colors: ${availableColors.length}`, 400, 150);
                ctx.fillText(`Gradient Colors: ${availableColors.length}`, 400, 150);
            }

            return canvas.toBuffer('image/png');
            */
            
            // Placeholder return for example
            return null;
        } catch (error) {
            console.error('Error creating gradient image:', error);
            return null;
        }
    }
};

// Button interaction handlers (add to your main bot file)
const handleRoleButtonInteractions = {
    async handleRoleMembers(interaction) {
        const roleId = interaction.customId.split('_')[2];
        const role = await interaction.guild.roles.fetch(roleId);
        
        if (!role) {
            return await interaction.reply({
                content: '❌ Role not found.',
                ephemeral: true
            });
        }

        if (role.members.size === 0) {
            return await interaction.reply({
                content: '📭 This role has no members.',
                ephemeral: true
            });
        }

        const memberList = role.members
            .map(member => `• ${member.user.tag} (${member.id})`)
            .slice(0, 20) // Limit to first 20 members
            .join('\n');

        const embed = new EmbedBuilder()
            .setTitle(`Members with role: ${role.name}`)
            .setDescription(memberList)
            .setColor(role.color || '#5865F2')
            .setFooter({ 
                text: `${role.members.size} total members${role.members.size > 20 ? ' • Showing first 20' : ''}` 
            });

        await interaction.reply({
            embeds: [embed],
            ephemeral: true
        });
    },

    async handleRolePermissions(interaction) {
        const roleId = interaction.customId.split('_')[2];
        const role = await interaction.guild.roles.fetch(roleId);
        
        if (!role) {
            return await interaction.reply({
                content: '❌ Role not found.',
                ephemeral: true
            });
        }

        const permissions = role.permissions.toArray();
        
        if (permissions.length === 0) {
            return await interaction.reply({
                content: '📭 This role has no special permissions.',
                ephemeral: true
            });
        }

        const permissionList = permissions
            .map(perm => `• ${perm.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}`)
            .join('\n');

        const embed = new EmbedBuilder()
            .setTitle(`Permissions for role: ${role.name}`)
            .setDescription(permissionList)
            .setColor(role.color || '#5865F2')
            .setFooter({ text: `${permissions.length} total permissions` });

        await interaction.reply({
            embeds: [embed],
            ephemeral: true
        });
    }
};

// Alternative message-based role info handler
class MessageRoleInfoHandler {
    constructor(client) {
        this.client = client;
    }

    async handleRoleInfo(message) {
        const args = message.content.split(' ');
        let targetRole;

        if (!message.guild) {
            return message.reply('❌ This command only works in guilds.');
        }

        // Parse target role from arguments or mentions
        if (args[1]) {
            const roleId = args[1].replace(/[<@&>]/g, '');
            try {
                targetRole = await message.guild.roles.fetch(roleId);
            } catch {
                return message.reply('❌ Role not found or invalid role ID.');
            }
        } else if (message.mentions.roles.size > 0) {
            targetRole = message.mentions.roles.first();
        } else {
            return message.reply('❌ Please specify a role ID or mention a role.');
        }

        if (!targetRole) {
            return message.reply('❌ Role not found.');
        }

        try {
            // Generate comprehensive role information
            const roleInfo = this.formatRoleInfo(targetRole);
            
            // Handle gradient image if role has colors
            let attachment = null;
            if (targetRole.colors) {
                attachment = await this.createGradientAttachment(targetRole);
            }

            const replyOptions = { content: roleInfo };
            if (attachment) {
                replyOptions.files = [attachment];
            }

            await message.reply(replyOptions);

        } catch (error) {
            console.error('Error in message-based roleinfo:', error);
            await message.reply(`❌ Error fetching role information: ${error.message}`);
        }
    }

    formatRoleInfo(role) {
        let content = `**Role Information: ${role.name}**\n`;
        
        // Basic information
        content += `\n**Basic Details:**\n`;
        content += `• **ID:** ${role.id}\n`;
        content += `• **Name:** ${role.name}\n`;
        content += `• **Color:** ${role.hexColor}\n`;
        content += `• **Position:** ${role.position}\n`;
        content += `• **Hoisted:** ${role.hoist ? 'Yes' : 'No'}\n`;
        content += `• **Mentionable:** ${role.mentionable ? 'Yes' : 'No'}\n`;
        content += `• **Managed:** ${role.managed ? 'Yes' : 'No'}\n`;
        content += `• **Members:** ${role.members.size}\n`;
        content += `• **Created:** <t:${Math.floor(role.createdTimestamp / 1000)}:F>\n`;

        // Role icon
        if (role.icon) {
            content += `\n**Role Icon:** ${role.iconURL({ size: 1024 })}\n`;
        }

        // Gradient colors (new in v14.22)
        if (role.colors) {
            content += `\n**Gradient Colors:**\n`;
            if (role.colors.primaryColor !== null && role.colors.primaryColor !== undefined) {
                content += `• **Primary:** ${this.intToHex(role.colors.primaryColor)} (${role.colors.primaryColor})\n`;
            }
            if (role.colors.secondaryColor !== null && role.colors.secondaryColor !== undefined) {
                content += `• **Secondary:** ${this.intToHex(role.colors.secondaryColor)} (${role.colors.secondaryColor})\n`;
            }
            if (role.colors.tertiaryColor !== null && role.colors.tertiaryColor !== undefined) {
                content += `• **Tertiary:** ${this.intToHex(role.colors.tertiaryColor)} (${role.colors.tertiaryColor})\n`;
            }
        }

        // Key permissions
        const permissions = role.permissions.toArray();
        if (permissions.length > 0) {
            const keyPerms = permissions
                .filter(perm => !['USE_EXTERNAL_EMOJIS', 'USE_VAD', 'CONNECT'].includes(perm))
                .slice(0, 10);
            
            content += `\n**Key Permissions (${permissions.length} total):**\n`;
            content += keyPerms.map(perm => 
                `• ${perm.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}`
            ).join('\n');
        }

        return content;
    }

    intToHex(color) {
        if (color === null || color === undefined) return '#000000';
        return '#' + color.toString(16).padStart(6, '0').toUpperCase();
    }

    async createGradientAttachment(role) {
        try {
            // This would require canvas package for gradient generation
            // Return null for example purposes
            return null;
        } catch (error) {
            console.error('Error creating gradient attachment:', error);
            return null;
        }
    }
}

module.exports.MessageRoleInfoHandler = MessageRoleInfoHandler;
module.exports.handleRoleButtonInteractions = handleRoleButtonInteractions;