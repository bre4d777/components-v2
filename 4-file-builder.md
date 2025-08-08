# Discord.js Components v2 - File Builder Guide

## Understanding File Components

FileBuilder is a Components v2 component that displays attached files directly within your message layout, rather than as separate attachments below the message. This creates a more integrated, professional appearance for document sharing and file presentations.

## Basic File Component Usage

### Simple File Display

```javascript
const { 
    ContainerBuilder,
    FileBuilder,
    TextDisplayBuilder,
    AttachmentBuilder,
    MessageFlags
} = require('discord.js');
const fs = require('fs').promises;

// Read the file content
const fileContent = await fs.readFile('./documents/report.pdf');

// Create the attachment
const attachment = new AttachmentBuilder(fileContent, { name: 'monthly-report.pdf' });

// Create the file component
const fileComponent = new FileBuilder()
    .setURL('attachment://monthly-report.pdf')  // Must match attachment name
    .setSpoiler(false)                          // Optional: hide behind spoiler
    .setId(1);                                  // Optional: unique identifier

// Build the container
const container = new ContainerBuilder()
    .setAccentColor(0x0099FF)
    .addTextDisplayComponents(
        new TextDisplayBuilder().setContent('# Monthly Report\nPlease review the attached analytics report.')
    )
    .addFileComponents(fileComponent);

// Send the message
await interaction.reply({
    components: [container],
    files: [attachment],
    flags: MessageFlags.IsComponentsV2
});
```

### Key Requirements for File Components

1. **Attachment Required**: File components require corresponding `AttachmentBuilder` objects
2. **Name Matching**: The FileBuilder URL must match the attachment name exactly
3. **URL Format**: Always use `attachment://filename` format for local files
4. **File Limits**: Standard Discord file size limits apply (8MB )
5. **Audio Files**: Audio files can't played if they are inside the components v2 (like we can do it in the normal file;uploads)

## File Types and Display

### Supported File Types

File components work with all Discord-supported file types:

```javascript
// Images
const imageFile = new FileBuilder()
    .setURL('attachment://diagram.png')
    .setSpoiler(false);

// Documents
const pdfFile = new FileBuilder()
    .setURL('attachment://contract.pdf')
    .setSpoiler(false);

// Text files
const logFile = new FileBuilder()
    .setURL('attachment://server.log')
    .setSpoiler(false);

// Archives
const zipFile = new FileBuilder()
    .setURL('attachment://backup.zip')
    .setSpoiler(false);

// Code files
const codeFile = new FileBuilder()
    .setURL('attachment://main.js')
    .setSpoiler(false);
```

### Spoiler Files

Mark files as spoilers to hide them behind Discord's spoiler system:

```javascript
const sensitiveFile = new FileBuilder()
    .setURL('attachment://sensitive-data.xlsx')
    .setSpoiler(true);  // Hides file behind spoiler blur
```

## Advanced File Handling Patterns

### Multiple File Display

```javascript
async function createMultiFileMessage(filePaths) {
    const container = new ContainerBuilder()
        .setAccentColor(0x5865F2)
        .addTextDisplayComponents(
            new TextDisplayBuilder().setContent('# Project Files\nHere are the requested project documents:')
        );
    
    const attachments = [];
    
    for (const [index, filePath] of filePaths.entries()) {
        const fileName = path.basename(filePath);
        const fileContent = await fs.readFile(filePath);
        
        // Create attachment
        const attachment = new AttachmentBuilder(fileContent, { name: fileName });
        attachments.push(attachment);
        
        // Create file component
        const fileComponent = new FileBuilder()
            .setURL(`attachment://${fileName}`)
            .setSpoiler(false)
            .setId(index + 1);
        
        // Add separator between files (except first)
        if (index > 0) {
            container.addSeparatorComponents(
                new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small)
            );
        }
        
        // Add file with description
        container
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`**${fileName}**\n${getFileDescription(fileName)}`)
            )
            .addFileComponents(fileComponent);
    }
    
    return {
        container,
        attachments
    };
}

function getFileDescription(fileName) {
    const ext = path.extname(fileName).toLowerCase();
    const descriptions = {
        '.pdf': 'PDF Document',
        '.docx': 'Word Document',
        '.xlsx': 'Excel Spreadsheet',
        '.pptx': 'PowerPoint Presentation',
        '.zip': 'Archive File',
        '.log': 'Log File',
        '.json': 'JSON Data File',
        '.csv': 'CSV Data File'
    };
    
    return descriptions[ext] || 'File';
}
```

### Dynamic File Generation

```javascript
const { createCanvas } = require('canvas');  // npm install canvas

async function createDynamicChart(data) {
    // Generate chart image
    const canvas = createCanvas(800, 600);
    const ctx = canvas.getContext('2d');
    
    // Draw chart (simplified example)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 800, 600);
    ctx.fillStyle = '#5865F2';
    ctx.font = '24px Arial';
    ctx.fillText('Dynamic Chart', 20, 40);
    
    // Add data visualization
    data.forEach((item, index) => {
        const barHeight = (item.value / Math.max(...data.map(d => d.value))) * 400;
        ctx.fillRect(100 + (index * 80), 500 - barHeight, 60, barHeight);
    });
    
    // Convert to buffer
    const buffer = canvas.toBuffer('image/png');
    
    // Create attachment and file component
    const attachment = new AttachmentBuilder(buffer, { name: 'chart.png' });
    const fileComponent = new FileBuilder()
        .setURL('attachment://chart.png')
        .setSpoiler(false);
    
    const container = new ContainerBuilder()
        .setAccentColor(0x57F287)
        .addTextDisplayComponents(
            new TextDisplayBuilder().setContent('# Analytics Report\nGenerated chart based on current data:')
        )
        .addFileComponents(fileComponent);
    
    return { container, attachments: [attachment] };
}

// Usage
const chartData = [
    { label: 'Jan', value: 120 },
    { label: 'Feb', value: 150 },
    { label: 'Mar', value: 180 }
];

const { container, attachments } = await createDynamicChart(chartData);
```

### File Upload with User Input

```javascript
class FileUploadHandler {
    static async handleFileUpload(interaction, fileData, metadata = {}) {
        try {
            // Validate file
            if (!this.validateFile(fileData)) {
                throw new Error('Invalid file type or size');
            }
            
            // Generate filename
            const fileName = metadata.customName || `upload_${Date.now()}.${this.getExtension(fileData)}`;
            
            // Create attachment
            const attachment = new AttachmentBuilder(fileData, { name: fileName });
            
            // Create file component with metadata
            const container = new ContainerBuilder()
                .setAccentColor(0x00FF00)
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent('# File Upload Successful')
                );
            
            // Add file info section
            if (metadata.description) {
                container.addSectionComponents(
                    new SectionBuilder()
                        .addTextDisplayComponents(
                            new TextDisplayBuilder().setContent(`**File Details**`),
                            new TextDisplayBuilder().setContent(`📄 Name: ${fileName}\n📊 Size: ${this.formatFileSize(fileData.length)}\n📝 Description: ${metadata.description}`)
                        )
                );
            }
            
            // Add the file component
            const fileComponent = new FileBuilder()
                .setURL(`attachment://${fileName}`)
                .setSpoiler(metadata.sensitive || false);
            
            container.addFileComponents(fileComponent);
            
            return {
                container,
                attachments: [attachment]
            };
            
        } catch (error) {
            return this.createErrorResponse(error.message);
        }
    }
    
    static validateFile(fileData) {
        const maxSize = 8 * 1024 * 1024; // 8MB
        return fileData.length <= maxSize;
    }
    
    static getExtension(fileData) {
        // Simple magic number detection
        const signatures = {
            '89504E47': 'png',
            'FFD8FF': 'jpg',
            '25504446': 'pdf',
            '504B0304': 'zip'
        };
        
        const header = fileData.slice(0, 4).toString('hex').toUpperCase();
        return signatures[header] || 'bin';
    }
    
    static formatFileSize(bytes) {
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        if (bytes === 0) return '0 Bytes';
        const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
    }
    
    static createErrorResponse(errorMessage) {
        const container = new ContainerBuilder()
            .setAccentColor(0xFF0000)
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`# Upload Failed\n❌ ${errorMessage}`)
            );
        
        return { container, attachments: [] };
    }
}
```

## File Component with Other Components

### File Galleries

Create organized displays of multiple files:

```javascript
async function createFileGallery(fileGroups) {
    const container = new ContainerBuilder()
        .setAccentColor(0x9932CC)
        .addTextDisplayComponents(
            new TextDisplayBuilder().setContent('# Document Library\nOrganized project files by category:')
        );
    
    const allAttachments = [];
    
    for (const group of fileGroups) {
        // Add category header
        container.addSeparatorComponents(
            new SeparatorBuilder()
                .setSpacing(SeparatorSpacingSize.Large)
                .setDivider(true)
        );
        
        container.addTextDisplayComponents(
            new TextDisplayBuilder().setContent(`## ${group.category}`)
        );
        
        // Add files in this category
        for (const file of group.files) {
            const fileName = path.basename(file.path);
            const fileContent = await fs.readFile(file.path);
            
            const attachment = new AttachmentBuilder(fileContent, { name: fileName });
            allAttachments.push(attachment);
            
            const section = new SectionBuilder()
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent(`**${fileName}**`),
                    new TextDisplayBuilder().setContent(file.description || 'No description available')
                )
                .setButtonAccessory(
                    new ButtonBuilder()
                        .setCustomId(`download_${fileName.replace(/\./g, '_')}`)
                        .setLabel('Info')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji('ℹ️')
                );
            
            container.addSectionComponents(section);
            
            const fileComponent = new FileBuilder()
                .setURL(`attachment://${fileName}`)
                .setSpoiler(file.sensitive || false);
            
            container.addFileComponents(fileComponent);
        }
    }
    
    return { container, attachments: allAttachments };
}

// Usage
const fileGroups = [
    {
        category: 'Documentation',
        files: [
            { path: './docs/readme.md', description: 'Project overview and setup instructions' },
            { path: './docs/api.pdf', description: 'API documentation and examples' }
        ]
    },
    {
        category: 'Configuration',
        files: [
            { path: './config/settings.json', description: 'Application configuration', sensitive: true },
            { path: './config/database.env', description: 'Database connection settings', sensitive: true }
        ]
    }
];
```

### Interactive File Management

```javascript
class FileManager {
    constructor() {
        this.files = new Map();
    }
    
    async createFileManagementInterface(fileList) {
        const container = new ContainerBuilder()
            .setAccentColor(0x7289DA)
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent('# File Management System\nManage your uploaded files:')
            );
        
        // File list section
        if (fileList.length === 0) {
            container.addTextDisplayComponents(
                new TextDisplayBuilder().setContent('*No files uploaded yet.*')
            );
        } else {
            for (const [index, file] of fileList.entries()) {
                const section = new SectionBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder().setContent(`**${file.name}**`),
                        new TextDisplayBuilder().setContent(`📊 Size: ${this.formatFileSize(file.size)}\n📅 Uploaded: ${file.uploadDate}`)
                    )
                    .setButtonAccessory(
                        new ButtonBuilder()
                            .setCustomId(`manage_file_${index}`)
                            .setLabel('Manage')
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji('⚙️')
                    );
                
                container.addSectionComponents(section);
                
                // Add the actual file if available
                if (file.attachment) {
                    const fileComponent = new FileBuilder()
                        .setURL(`attachment://${file.name}`)
                        .setSpoiler(file.sensitive);
                    
                    container.addFileComponents(fileComponent);
                }
            }
        }
        
        // Management actions
        container.addSeparatorComponents(
            new SeparatorBuilder()
                .setSpacing(SeparatorSpacingSize.Large)
                .setDivider(true)
        );
        
        container.addActionRowComponents(
            new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('upload_new')
                        .setLabel('Upload New File')
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji('📁'),
                    new ButtonBuilder()
                        .setCustomId('refresh_list')
                        .setLabel('Refresh')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji('🔄'),
                    new ButtonBuilder()
                        .setCustomId('cleanup_files')
                        .setLabel('Cleanup')
                        .setStyle(ButtonStyle.Danger)
                        .setEmoji('🗑️')
                )
        );
        
        return container;
    }
    
    formatFileSize(bytes) {
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        if (bytes === 0) return '0 Bytes';
        const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
    }
}
```

## Best Practices

### 1. File Organization
- Group related files together
- Use clear, descriptive file names
- Provide context for each file with TextDisplay components

### 2. File Security
- Use spoilers for sensitive files
- Validate file types and sizes before processing
- Never expose system paths or sensitive metadata

### 3. User Experience
- Always provide file descriptions
- Use appropriate file names that indicate content
- Consider mobile users - files should be easily identifiable

### 4. Performance
- Monitor file sizes to stay within Discord limits
- Cache generated files when appropriate
- Clean up temporary files after use

### 5. Error Handling
- Validate files before creating components
- Provide clear error messages for failed uploads
- Have fallback options for unsupported file types

## Integration Examples

### Complete File Sharing System

```javascript
async function createFileShareMessage(files, shareOptions = {}) {
    const attachments = [];
    const container = new ContainerBuilder()
        .setAccentColor(shareOptions.accentColor || 0x3498DB);
    
    // Header
    container.addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
            shareOptions.title ? `# ${shareOptions.title}` : '# Shared Files'
        )
    );
    
    if (shareOptions.description) {
        container.addTextDisplayComponents(
            new TextDisplayBuilder().setContent(shareOptions.description)
        );
    }
    
    // Process each file
    for (const fileInfo of files) {
        const fileContent = await fs.readFile(fileInfo.path);
        const attachment = new AttachmentBuilder(fileContent, { name: fileInfo.name });
        attachments.push(attachment);
        
        // File section
        const fileSection = new SectionBuilder()
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`**${fileInfo.name}**`),
                new TextDisplayBuilder().setContent(fileInfo.description || '')
            );
        
        if (shareOptions.showDownloadButtons) {
            fileSection.setButtonAccessory(
                new ButtonBuilder()
                    .setCustomId(`download_${fileInfo.id}`)
                    .setLabel('Download Info')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('💾')
            );
        }
        
        container.addSectionComponents(fileSection);
        
        const fileComponent = new FileBuilder()
            .setURL(`attachment://${fileInfo.name}`)
            .setSpoiler(fileInfo.sensitive || false);
        
        container.addFileComponents(fileComponent);
        
        // Add separator between files
        if (files.indexOf(fileInfo) < files.length - 1) {
            container.addSeparatorComponents(
                new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small)
            );
        }
    }
    
    // Optional actions
    if (shareOptions.allowFeedback) {
        container.addActionRowComponents(
            new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('files_helpful')
                        .setLabel('Helpful')
                        .setStyle(ButtonStyle.Success)
                        .setEmoji('👍'),
                    new ButtonBuilder()
                        .setCustomId('files_report')
                        .setLabel('Report Issue')
                        .setStyle(ButtonStyle.Danger)
                        .setEmoji('⚠️')
                )
        );
    }
    
    return { container, attachments };
}
```

### Next
[Next](./5-examples.md)
