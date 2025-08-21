# Discord.js v14.22.0 Migration Guide

## Events.Ready Deprecation

### Overview
The `Events.Ready` event has been deprecated in favor of `Events.ClientReady` to provide better semantic clarity for when the Discord client is fully initialized and ready to receive events.

### Migration Required

**Legacy Implementation**
```javascript
client.once(Events.Ready, (client) => {
    console.log(`Bot initialized. Logged in as ${client.user.tag}`);
});
```

**Updated Implementation**
```javascript
client.once(Events.ClientReady, (client) => {
    console.log(`Bot initialized. Logged in as ${client.user.tag}`);
});
```

### Automated Migration
Use find and replace across your codebase:
- **Find**: `Events.Ready`
- **Replace**: `Events.ClientReady`

---

## Message Pinning API Changes

### Overview
The `fetchPinned()` method has been renamed to `fetchPins()` to better align with Discord.js naming conventions and improve API consistency.

### Migration Required

**Legacy Implementation**
```javascript
const pinnedMessages = await channel.messages.fetchPinned();
console.log(`Retrieved ${pinnedMessages.size} pinned messages`);
```

**Updated Implementation**
```javascript
const pinnedMessages = await channel.messages.fetchPins();
console.log(`Retrieved ${pinnedMessages.size} pinned messages`);
```

### Automated Migration
Use find and replace across your codebase:
- **Find**: `fetchPinned(`
- **Replace**: `fetchPins(`

### Response Structure
The `fetchPins()` method returns a structured object containing pinned message data:

```javascript
const pinnedData = await channel.messages.fetchPins();

// Response structure
{
    items: [
        {
            pinnedTimestamp: 1755164684406,
            pinnedAt: [Date Object],
            message: {
                id: '1405486733575065641',
                createdTimestamp: 1755164549965,
                content: 'Message content',
                author: [User Object],
                pinned: true,
                // Additional message properties...
            }
        }
        // Additional pinned messages...
    ],
    hasMore: boolean
}
```

### Implementation Notes
- The response includes metadata about when messages were pinned
- Messages are returned in reverse chronological order by pin date
- The `hasMore` property indicates if additional pinned messages exist beyond the current fetch limit
- All existing message properties remain accessible through the `message` property of each item
