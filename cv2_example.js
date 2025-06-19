import { Command } from '../../structures/Command.js';
import {
  ContainerBuilder,
  TextDisplayBuilder,
  SectionBuilder,
  SeparatorBuilder,
  MediaGalleryBuilder,
  MediaGalleryItemBuilder,
  FileBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  SelectMenuBuilder,
  ThumbnailBuilder,
  MessageFlags,
  SeparatorSpacingSize,
  ButtonStyle,
  SelectMenuOptionBuilder,
} from 'discord.js';

class CV2Command extends Command {
  constructor() {
    super({
      name: 'cv2',
      description: 'Showcase all Components v2 features',
      usage: 'cv2',
      aliases: ['componentsv2', 'showcase'],
      category: 'examples',
      cooldown: 5,
    });
    
    this.userStates = new Map();
    this.demoData = {
      products: [
        { id: 1, name: 'Premium Bot', price: '$19.99', rating: 4.8 },
        { id: 2, name: 'Moderation Tools', price: '$12.99', rating: 4.6 },
        { id: 3, name: 'Music Player', price: '$15.99', rating: 4.9 },
      ],
      stats: {
        users: 15420,
        servers: 892,
        commands: 47,
        uptime: '99.8%'
      },
      features: [
        'Advanced moderation system',
        'Custom command builder',
        'Multi-language support',
        'Real-time analytics',
        'Premium support'
      ]
    };
  }

  getRandomColor() {
    const colors = [0x5865F2, 0x57F287, 0xFEE75C, 0xED4245, 0xEB459E, 0x9B59B6];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  buildMainContainer(username) {
    const container = new ContainerBuilder()
      .setAccentColor(this.getRandomColor())
      .setSpoiler(false);

    container.addTextDisplayComponents(
      new TextDisplayBuilder()
        .setContent(`# 🚀 Components v2 Showcase\n*Demonstrating every single feature available*\n\nWelcome **${username}**! This message uses every Components v2 feature.`)
    );

    container.addSeparatorComponents(
      new SeparatorBuilder()
        .setSpacing(SeparatorSpacingSize.Large)
        .setDivider(true)
    );

    container.addSectionComponents(
      new SectionBuilder()
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent('## 📊 Live Statistics'),
          new TextDisplayBuilder().setContent(`**Active Users**: ${this.demoData.stats.users.toLocaleString()}\n**Servers**: ${this.demoData.stats.servers}`),
          new TextDisplayBuilder().setContent(`**Commands**: ${this.demoData.stats.commands}\n**Uptime**: ${this.demoData.stats.uptime}`)
        )
        .setButtonAccessory(
          new ButtonBuilder()
            .setCustomId('refresh_stats')
            .setLabel('Refresh Stats')
            .setStyle(ButtonStyle.Primary)
        )
    );

    container.addSeparatorComponents(
      new SeparatorBuilder()
        .setSpacing(SeparatorSpacingSize.Small)
        .setDivider(false)
    );

    container.addSectionComponents(
      new SectionBuilder()
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent('## 🎯 Key Features'),
          new TextDisplayBuilder().setContent(this.demoData.features.map(f => `✅ ${f}`).join('\n'))
        )
        .setThumbnailAccessory(
          new ThumbnailBuilder()
            .setURL('https://cdn.discordapp.com/attachments/123/456/example.png')
        )
    );

    container.addMediaGalleryComponents(
      new MediaGalleryBuilder()
        .addItems(
          new MediaGalleryItemBuilder()
            .setURL('https://picsum.photos/400/300?random=1')
            .setDescription('Dashboard Preview'),
          new MediaGalleryItemBuilder()
            .setURL('https://picsum.photos/400/300?random=2')
            .setDescription('Mobile Interface'),
          new MediaGalleryItemBuilder()
            .setURL('https://picsum.photos/400/300?random=3')
            .setDescription('Analytics Panel')
        )
    );

    container.addSeparatorComponents(
      new SeparatorBuilder()
        .setSpacing(SeparatorSpacingSize.Large)
        .setDivider(true)
    );

    container.addTextDisplayComponents(
      new TextDisplayBuilder()
        .setContent('## 🛍️ Featured Products')
    );

    this.demoData.products.forEach((product, index) => {
      container.addSectionComponents(
        new SectionBuilder()
          .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(`**${product.name}**`),
            new TextDisplayBuilder().setContent(`Price: **${product.price}**\nRating: ⭐ ${product.rating}/5.0`)
          )
          .setButtonAccessory(
            new ButtonBuilder()
              .setCustomId(`product_${product.id}`)
              .setLabel('View Details')
              .setStyle(ButtonStyle.Secondary)
          )
      );
      
      if (index < this.demoData.products.length - 1) {
        container.addSeparatorComponents(
          new SeparatorBuilder()
            .setSpacing(SeparatorSpacingSize.Small)
            .setDivider(false)
        );
      }
    });

    container.addSeparatorComponents(
      new SeparatorBuilder()
        .setSpacing(SeparatorSpacingSize.Large)
        .setDivider(true)
    );

    container.addFileComponents(
      new FileBuilder()
        .setURL('attachment://demo-file.txt')
        .setSpoiler(false)
    );

    container.addActionRowComponents(
      new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('demo_primary')
            .setLabel('Primary Action')
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId('demo_success')
            .setLabel('Success')
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId('demo_danger')
            .setLabel('Danger')
            .setStyle(ButtonStyle.Danger)
        )
    );

    container.addActionRowComponents(
      new ActionRowBuilder()
        .addComponents(
          new SelectMenuBuilder()
            .setCustomId('demo_select')
            .setPlaceholder('Choose a demo option...')
            .addOptions([
              new SelectMenuOptionBuilder()
                .setLabel('Show Color Variants')
                .setValue('colors')
                .setDescription('Display different accent colors'),
              new SelectMenuOptionBuilder()
                .setLabel('Toggle Spoiler Mode')
                .setValue('spoiler')
                .setDescription('Hide/show content with spoilers'),
              new SelectMenuOptionBuilder()
                .setLabel('Regenerate Content')
                .setValue('regenerate')
                .setDescription('Create new random content'),
              new SelectMenuOptionBuilder()
                .setLabel('Show Interaction Log')
                .setValue('log')
                .setDescription('View your interaction history')
            ])
        )
    );

    container.addActionRowComponents(
      new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('reset_demo')
            .setLabel('Reset Demo')
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setCustomId('export_data')
            .setLabel('Export Data')
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setCustomId('close_demo')
            .setLabel('Close')
            .setStyle(ButtonStyle.Danger)
        )
    );

    return container;
  }

  buildProductDetailContainer(productId, username) {
    const product = this.demoData.products.find(p => p.id === productId);
    if (!product) return null;

    const container = new ContainerBuilder()
      .setAccentColor(0x57F287)
      .setSpoiler(false);

    container.addTextDisplayComponents(
      new TextDisplayBuilder()
        .setContent(`# ${product.name}\n*Detailed product information*`)
    );

    container.addSeparatorComponents(
      new SeparatorBuilder()
        .setSpacing(SeparatorSpacingSize.Small)
        .setDivider(true)
    );

    container.addSectionComponents(
      new SectionBuilder()
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent('## Product Details'),
          new TextDisplayBuilder().setContent(`**Price**: ${product.price}\n**Rating**: ⭐ ${product.rating}/5.0\n**Category**: Premium Tools`),
          new TextDisplayBuilder().setContent(`**Status**: Available\n**Last Updated**: Today\n**Downloads**: ${Math.floor(Math.random() * 10000).toLocaleString()}`)
        )
        .setButtonAccessory(
          new ButtonBuilder()
            .setCustomId(`purchase_${productId}`)
            .setLabel('Purchase Now')
            .setStyle(ButtonStyle.Success)
        )
    );

    container.addMediaGalleryComponents(
      new MediaGalleryBuilder()
        .addItems(
          new MediaGalleryItemBuilder()
            .setURL(`https://picsum.photos/500/400?random=${productId}0`)
            .setDescription(`${product.name} - Main View`),
          new MediaGalleryItemBuilder()
            .setURL(`https://picsum.photos/500/400?random=${productId}1`)
            .setDescription('Configuration Panel'),
          new MediaGalleryItemBuilder()
            .setURL(`https://picsum.photos/500/400?random=${productId}2`)
            .setDescription('Feature Overview')
        )
    );

    container.addSeparatorComponents(
      new SeparatorBuilder()
        .setSpacing(SeparatorSpacingSize.Large)
        .setDivider(true)
    );

    container.addTextDisplayComponents(
      new TextDisplayBuilder()
        .setContent('## 📋 Features Included\n✅ Full access to all commands\n✅ Priority customer support\n✅ Regular updates and patches\n✅ Community access\n✅ Custom configuration options')
    );

    container.addActionRowComponents(
      new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('back_to_main')
            .setLabel('← Back to Main')
            .setStyle(ButtonStyle.Secondary),
          new ButtonBuilder()
            .setCustomId(`purchase_${productId}`)
            .setLabel('Buy Now')
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId(`favorite_${productId}`)
            .setLabel('Add to Favorites')
            .setStyle(ButtonStyle.Primary)
        )
    );

    return container;
  }

  buildInteractionLogContainer(userId) {
    const userState = this.userStates.get(userId) || { interactions: [], startTime: Date.now() };
    
    const container = new ContainerBuilder()
      .setAccentColor(0x9B59B6)
      .setSpoiler(false);

    container.addTextDisplayComponents(
      new TextDisplayBuilder()
        .setContent('# 📊 Interaction Log\n*Your activity during this demo session*')
    );

    container.addSeparatorComponents(
      new SeparatorBuilder()
        .setSpacing(SeparatorSpacingSize.Small)
        .setDivider(true)
    );

    container.addSectionComponents(
      new SectionBuilder()
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent('## Session Statistics'),
          new TextDisplayBuilder().setContent(`**Session Started**: <t:${Math.floor(userState.startTime / 1000)}:R>\n**Total Interactions**: ${userState.interactions.length}`),
          new TextDisplayBuilder().setContent(`**Most Used**: ${this.getMostUsedAction(userState.interactions)}\n**Session Duration**: ${this.getSessionDuration(userState.startTime)}`)
        )
    );

    if (userState.interactions.length > 0) {
      container.addSeparatorComponents(
        new SeparatorBuilder()
          .setSpacing(SeparatorSpacingSize.Small)
          .setDivider(false)
      );

      container.addTextDisplayComponents(
        new TextDisplayBuilder()
          .setContent('## Recent Interactions')
      );

      const recentInteractions = userState.interactions.slice(-5).reverse();
      recentInteractions.forEach((interaction, index) => {
        container.addSectionComponents(
          new SectionBuilder()
            .addTextDisplayComponents(
              new TextDisplayBuilder().setContent(`**${interaction.action}**`),
              new TextDisplayBuilder().setContent(`<t:${Math.floor(interaction.timestamp / 1000)}:t> - ${interaction.details}`)
            )
        );
      });
    } else {
      container.addTextDisplayComponents(
        new TextDisplayBuilder()
          .setContent('*No interactions recorded yet. Start clicking buttons to see your activity!*')
      );
    }

    container.addActionRowComponents(
      new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('clear_log')
            .setLabel('Clear Log')
            .setStyle(ButtonStyle.Danger),
          new ButtonBuilder()
            .setCustomId('back_to_main')
            .setLabel('← Back to Main')
            .setStyle(ButtonStyle.Secondary)
        )
    );

    return container;
  }

  getMostUsedAction(interactions) {
    if (interactions.length === 0) return 'None';
    
    const actionCounts = {};
    interactions.forEach(interaction => {
      actionCounts[interaction.action] = (actionCounts[interaction.action] || 0) + 1;
    });
    
    return Object.keys(actionCounts).reduce((a, b) => 
      actionCounts[a] > actionCounts[b] ? a : b
    );
  }

  getSessionDuration(startTime) {
    const duration = Date.now() - startTime;
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  }

  logInteraction(userId, action, details) {
    if (!this.userStates.has(userId)) {
      this.userStates.set(userId, { interactions: [], startTime: Date.now() });
    }
    
    const userState = this.userStates.get(userId);
    userState.interactions.push({
      action,
      details,
      timestamp: Date.now()
    });
    
    if (userState.interactions.length > 50) {
      userState.interactions = userState.interactions.slice(-50);
    }
  }

  createDemoFile() {
    const content = `Components v2 Demo File
Generated: ${new Date().toISOString()}

This is a sample file to demonstrate the FileBuilder component.
It shows how files can be embedded directly in your Components v2 messages.

Features demonstrated in this showcase:
- ContainerBuilder with accent colors
- TextDisplayBuilder with rich markdown
- SectionBuilder with accessories
- MediaGalleryBuilder with multiple items
- FileBuilder (this file!)
- ActionRowBuilder with buttons and selects
- SeparatorBuilder with spacing and dividers
- ThumbnailBuilder as section accessory

Thank you for exploring Components v2!`;
    
    return Buffer.from(content, 'utf8');
  }

  async execute({ message, client }) {
    try {
      const demoFile = this.createDemoFile();
      
      const container = this.buildMainContainer(message.author.username);
      
      const sent = await message.reply({
        components: [container],
        files: [{
          attachment: demoFile,
          name: 'demo-file.txt'
        }],
        flags: MessageFlags.IsComponentsV2,
      });

      if (!this.userStates.has(message.author.id)) {
        this.userStates.set(message.author.id, { 
          interactions: [], 
          startTime: Date.now() 
        });
      }

      this.logInteraction(message.author.id, 'Command Executed', 'Started CV2 showcase demo');

      const collector = sent.createMessageComponentCollector({ time: 300000 });

      collector.on('collect', async interaction => {
        if (interaction.user.id !== message.author.id) {
          return interaction.reply({ 
            content: 'This demo is private to the user who started it!', 
            ephemeral: true 
          });
        }

        try {
          if (interaction.isButton()) {
            await this.handleButtonInteraction(interaction, message.author.id);
          } else if (interaction.isStringSelectMenu()) {
            await this.handleSelectInteraction(interaction, message.author.id);
          }
        } catch (error) {
          console.error('CV2 Interaction Error:', error);
          await interaction.reply({ 
            content: 'An error occurred processing your interaction!', 
            ephemeral: true 
          });
        }
      });

      collector.on('end', async () => {
        try {
          const expiredContainer = new ContainerBuilder()
            .setAccentColor(0x747F8D)
            .addTextDisplayComponents(
              new TextDisplayBuilder()
                .setContent('# 🚀 Components v2 Showcase\n*This demo has expired*\n\nRun the command again to start a new demonstration.')
            );

          await sent.edit({ 
            components: [expiredContainer],
            flags: MessageFlags.IsComponentsV2
          });
        } catch (error) {
          console.error('Error updating expired message:', error);
        }
      });

    } catch (error) {
      console.error('CV2Command Error:', error);
      await message.reply({ 
        content: 'An error occurred while creating the Components v2 showcase. Please try again!' 
      });
    }
  }

  async handleButtonInteraction(interaction, userId) {
    const customId = interaction.customId;

    if (customId === 'refresh_stats') {
      this.demoData.stats.users += Math.floor(Math.random() * 100);
      this.demoData.stats.servers += Math.floor(Math.random() * 10);
      this.logInteraction(userId, 'Stats Refreshed', 'Updated live statistics');
      
      const container = this.buildMainContainer(interaction.user.username);
      await interaction.update({ 
        components: [container],
        flags: MessageFlags.IsComponentsV2
      });
    }

    else if (customId.startsWith('product_')) {
      const productId = parseInt(customId.split('_')[1]);
      this.logInteraction(userId, 'Product Viewed', `Viewed product ${productId}`);
      
      const container = this.buildProductDetailContainer(productId, interaction.user.username);
      await interaction.update({ 
        components: [container],
        flags: MessageFlags.IsComponentsV2
      });
    }

    else if (customId.startsWith('purchase_')) {
      const productId = parseInt(customId.split('_')[1]);
      const product = this.demoData.products.find(p => p.id === productId);
      this.logInteraction(userId, 'Purchase Attempted', `Attempted to purchase ${product?.name}`);
      
      await interaction.reply({ 
        content: `🛒 **Purchase Simulation**\n\nYou would be purchasing: **${product?.name}** for **${product?.price}**\n\n*This is just a demo - no actual purchase occurred!*`, 
        ephemeral: true 
      });
    }

    else if (customId.startsWith('favorite_')) {
      const productId = parseInt(customId.split('_')[1]);
      const product = this.demoData.products.find(p => p.id === productId);
      this.logInteraction(userId, 'Favorite Added', `Added ${product?.name} to favorites`);
      
      await interaction.reply({ 
        content: `⭐ Added **${product?.name}** to your favorites!`, 
        ephemeral: true 
      });
    }

    else if (customId === 'back_to_main') {
      this.logInteraction(userId, 'Navigation', 'Returned to main showcase');
      
      const container = this.buildMainContainer(interaction.user.username);
      await interaction.update({ 
        components: [container],
        flags: MessageFlags.IsComponentsV2
      });
    }

    else if (customId === 'demo_primary') {
      this.logInteraction(userId, 'Button Clicked', 'Primary style button');
      await interaction.reply({ 
        content: '🔵 **Primary Button Clicked!**\nThis demonstrates the Primary button style.', 
        ephemeral: true 
      });
    }

    else if (customId === 'demo_success') {
      this.logInteraction(userId, 'Button Clicked', 'Success style button');
      await interaction.reply({ 
        content: '🟢 **Success Button Clicked!**\nThis demonstrates the Success button style.', 
        ephemeral: true 
      });
    }

    else if (customId === 'demo_danger') {
      this.logInteraction(userId, 'Button Clicked', 'Danger style button');
      await interaction.reply({ 
        content: '🔴 **Danger Button Clicked!**\nThis demonstrates the Danger button style.', 
        ephemeral: true 
      });
    }

    else if (customId === 'reset_demo') {
      this.userStates.set(userId, { interactions: [], startTime: Date.now() });
      this.logInteraction(userId, 'Demo Reset', 'Cleared interaction history');
      
      const container = this.buildMainContainer(interaction.user.username);
      await interaction.update({ 
        components: [container],
        flags: MessageFlags.IsComponentsV2
      });
    }

    else if (customId === 'export_data') {
      const userState = this.userStates.get(userId) || { interactions: [], startTime: Date.now() };
      const exportData = {
        user: interaction.user.username,
        sessionStart: new Date(userState.startTime).toISOString(),
        totalInteractions: userState.interactions.length,
        interactions: userState.interactions,
        stats: this.demoData.stats
      };
      
      this.logInteraction(userId, 'Data Exported', 'Exported session data');
      
      const exportFile = Buffer.from(JSON.stringify(exportData, null, 2));
      await interaction.reply({ 
        content: '📁 **Data Export Complete**\nYour session data has been exported!',
        files: [{
          attachment: exportFile,
          name: `cv2-demo-export-${Date.now()}.json`
        }],
        ephemeral: true 
      });
    }

    else if (customId === 'close_demo') {
      this.logInteraction(userId, 'Demo Closed', 'Manually closed the demo');
      
      const closedContainer = new ContainerBuilder()
        .setAccentColor(0x747F8D)
        .addTextDisplayComponents(
          new TextDisplayBuilder()
            .setContent('# 🚀 Components v2 Showcase\n*Demo closed by user*\n\nRun the command again to start a new demonstration.')
        );

      await interaction.update({ 
        components: [closedContainer],
        flags: MessageFlags.IsComponentsV2
      });
    }

    else if (customId === 'clear_log') {
      this.userStates.set(userId, { interactions: [], startTime: Date.now() });
      this.logInteraction(userId, 'Log Cleared', 'Cleared interaction history');
      
      const container = this.buildInteractionLogContainer(userId);
      await interaction.update({ 
        components: [container],
        flags: MessageFlags.IsComponentsV2
      });
    }
  }

  async handleSelectInteraction(interaction, userId) {
    const selectedValue = interaction.values[0];

    if (selectedValue === 'colors') {
      this.logInteraction(userId, 'Color Demo', 'Viewed color variants');
      
      const colorContainer = new ContainerBuilder()
        .setAccentColor(this.getRandomColor())
        .addTextDisplayComponents(
          new TextDisplayBuilder()
            .setContent('# 🎨 Color Variants Demo\n*Different accent colors for containers*')
        )
        .addSeparatorComponents(
          new SeparatorBuilder()
            .setSpacing(SeparatorSpacingSize.Small)
            .setDivider(true)
        );

      const colors = [
        { name: 'Blurple', value: 0x5865F2 },
        { name: 'Green', value: 0x57F287 },
        { name: 'Yellow', value: 0xFEE75C },
        { name: 'Red', value: 0xED4245 },
        { name: 'Pink', value: 0xEB459E },
        { name: 'Purple', value: 0x9B59B6 }
      ];

      colors.forEach(color => {
        colorContainer.addSectionComponents(
          new SectionBuilder()
            .addTextDisplayComponents(
              new TextDisplayBuilder().setContent(`**${color.name}**`),
              new TextDisplayBuilder().setContent(`Hex: #${color.value.toString(16).toUpperCase().padStart(6, '0')}`)
            )
        );
      });

      colorContainer.addActionRowComponents(
        new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setCustomId('back_to_main')
              .setLabel('← Back to Main')
              .setStyle(ButtonStyle.Secondary)
          )
      );

      await interaction.update({ 
        components: [colorContainer],
        flags: MessageFlags.IsComponentsV2
      });
    }

    else if (selectedValue === 'spoiler') {
      this.logInteraction(userId, 'Spoiler Demo', 'Toggled spoiler mode');
      
      const spoilerContainer = new ContainerBuilder()
        .setAccentColor(0x747F8D)
        .setSpoiler(true)
        .addTextDisplayComponents(
          new TextDisplayBuilder()
            .setContent('# 🙈 Spoiler Mode Demo\n*This entire container is now hidden behind a spoiler*\n\nClick to reveal the content!')
        )
        .addSeparatorComponents(
          new SeparatorBuilder()
            .setSpacing(SeparatorSpacingSize.Small)
            .setDivider(true)
        )
        .addTextDisplayComponents(
          new TextDisplayBuilder()
            .setContent('This is hidden content that users need to click to see.\n\nSpoiler containers are perfect for:\n• Sensitive information\n• Plot spoilers\n• Hidden rewards\n• Content warnings')
        )
        .addActionRowComponents(
          new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
                .setCustomId('back_to_main')
                .setLabel('← Back to Main')
                .setStyle(ButtonStyle.Secondary)
            )
        );

      await interaction.update({ 
        components: [spoilerContainer],
        flags: MessageFlags.IsComponentsV2
      });
    }

    else if (selectedValue === 'regenerate') {
      this.demoData.stats.users = Math.floor(Math.random() * 50000) + 10000;
      this.demoData.stats.servers = Math.floor(Math.random() * 2000) + 500;
      this.demoData.stats.commands = Math.floor(Math.random() * 100) + 20;
      this.demoData.stats.uptime = `${(Math.random() * 5 + 95).toFixed(1)}%`;
      
      this.logInteraction(userId, 'Content Regenerated', 'Generated new random content');
      
      const container = this.buildMainContainer(interaction.user.username);
      await interaction.update({ 
        components: [container],
        flags: MessageFlags.IsComponentsV2
      });
    }

    else if (selectedValue === 'log') {
      this.logInteraction(userId, 'Log Viewed', 'Opened interaction log');
      
      const container = this.buildInteractionLogContainer(userId);
      await interaction.update({ 
        components: [container],
        flags: MessageFlags.IsComponentsV2
      });
    }

    await interaction.followUp({ 
      content: `📝 **Select Menu Action**: ${selectedValue}\nYou selected: **${interaction.values[0]}**`, 
      ephemeral: true 
    });
  }
}

export default new CV2Command();