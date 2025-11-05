# AI Assistant Integration - React.js Documentation

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Component Structure](#component-structure)
4. [How It Works](#how-it-works)
5. [Sending Messages](#sending-messages)
6. [Message History](#message-history)
7. [Tool Results Display](#tool-results-display)
8. [API Integration](#api-integration)
9. [State Management](#state-management)
10. [Usage Examples](#usage-examples)

---

## Overview

The AI Assistant is a full-featured chat interface integrated into the React.js frontend that allows users to interact with an AI-powered assistant for property searches and real estate inquiries. The system uses server-side session management to maintain conversation context across multiple interactions.

### Key Features

- **Real-time Chat Interface**: Full-screen modal with message bubbles
- **Server-Side History**: Conversation history managed on the backend
- **Tool Integration**: AI can execute tools (like property search) and display results
- **Session Management**: Persistent conversations using session IDs
- **Auto-scrolling**: Automatically scrolls to latest messages
- **Loading States**: Visual feedback during AI processing

---

## Architecture

### High-Level Flow

```
User Input → Frontend (React) → API Request → Backend (Laravel) → Gemini AI → MCP Tools → Response → Frontend Display
```

### Technology Stack

- **Frontend Framework**: React.js with TypeScript
- **State Management**: React Hooks (useState) + TanStack Query
- **UI Components**: Radix UI + Tailwind CSS
- **API Client**: Axios-based API client
- **Backend**: Laravel with Gemini AI integration

---

## Component Structure

### File Organization

```
web/src/
├── components/features/aiAssistant/
│   ├── AiAssistantModal.tsx      # Main modal container
│   ├── AiTriggerButton.tsx       # Floating action button
│   ├── AiAssistantHeader.tsx     # Modal header
│   ├── AiChatArea.tsx            # Message display area
│   ├── AiMessageBubble.tsx       # Individual message component
│   ├── AiInputArea.tsx           # Message input field
│   ├── AiTypingIndicator.tsx     # Loading animation
│   └── AiPropertyResults.tsx     # Property search results display
├── hooks/queries/
│   └── useAiAssistant.ts         # TanStack Query hook
├── services/api/
│   └── aiAssistant.ts            # API service functions
└── types/
    └── aiAssistant.ts            # TypeScript type definitions
```

### Component Hierarchy

```
AiTriggerButton
└── AiAssistantModal
    ├── AiAssistantHeader
    ├── AiChatArea
    │   ├── AiMessageBubble (for each message)
    │   ├── AiPropertyResults (for tool results)
    │   └── AiTypingIndicator (when loading)
    └── AiInputArea
```

---

## How It Works

### 1. Initialization Flow

```typescript
// User clicks the AI button
<AiTriggerButton /> 
  → Opens <AiAssistantModal />
    → Initializes empty messages array
    → Shows welcome screen with quick actions
```

### 2. Message Sending Flow

```
User types message → Clicks send
  ↓
handleSend() in AiAssistantModal
  ↓
1. Add user message to local state (optimistic update)
  ↓
2. Call API with message + session_id
  ↓
3. Backend processes with Gemini AI
  ↓
4. Backend may call MCP tools (e.g., property search)
  ↓
5. Backend returns response with message + tools
  ↓
6. Update local state with AI response
  ↓
7. Display message + tool results in chat
```

### 3. Session Management Flow

```
First Message:
  → No session_id → Backend creates new session
  → Returns session_id in response
  → Frontend stores session_id in state

Subsequent Messages:
  → Include session_id in request
  → Backend retrieves conversation history
  → AI processes with full context
  → Maintains conversation continuity
```

---

## Sending Messages

### Frontend Implementation

#### 1. User Input Handling

The input is handled in `AiInputArea.tsx`:

```typescript
// User types in textarea
const [message, setMessage] = useState('');

// On send button click or Enter key
const handleSend = () => {
  const trimmedMessage = message.trim();
  if (!trimmedMessage || isLoading) return;
  
  onSend(trimmedMessage);  // Calls parent's handleSend
  setMessage('');          // Clear input
};
```

#### 2. Message Processing in Modal

The main logic is in `AiAssistantModal.tsx`:

```typescript
const handleSend = async (content: string) => {
  // 1. Optimistically add user message to UI
  const userMessage: AiMessageDisplay = {
    id: generateMessageId(),
    role: 'user',
    content,
    timestamp: new Date(),
  };
  setMessages((prev) => [...prev, userMessage]);

  // 2. Send to API
  const response = await chatMutation.mutateAsync({
    message: content,
    session_id: sessionId || undefined,  // Include session if exists
  });

  // 3. Save session_id for future requests
  if (response.session_id) {
    setSessionId(response.session_id);
  }

  // 4. Add AI response to UI
  const aiMessage: AiMessageDisplay = {
    id: generateMessageId(),
    role: 'assistant',
    content: response.message,
    timestamp: new Date(),
    tools: response.tools || [],  // Include tool results if any
  };
  setMessages((prev) => [...prev, aiMessage]);
};
```

#### 3. API Request

The API call is made through TanStack Query:

```typescript
// useAiAssistant.ts
export function useAiAssistantChat() {
  return useMutation<AiChatResponse, Error, AiChatRequest>({
    mutationFn: async (payload: AiChatRequest) => {
      const response = await aiAssistantApi.sendMessage(payload);
      return response.data.data || response.data;
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to send message');
    },
  });
}
```

#### 4. API Service

```typescript
// aiAssistant.ts
export const aiAssistantApi = {
  sendMessage: (payload: AiChatRequest) => {
    return api.post<AiChatApiResponse>(
      '/api/v1/frontend/ai-assistant/chat',
      payload
    );
  },
};
```

### Request/Response Format

#### Request
```typescript
{
  message: string;           // User's message
  session_id?: string;       // Optional: for continuing conversation
}
```

#### Response
```typescript
{
  message: string;           // AI's response text
  session_id: string;        // Session ID for next request
  finish_reason?: string;    // API finish reason
  tools?: AiToolResult[];    // Tool execution results (if any)
}
```

---

## Message History

### How History Works

The AI Assistant uses **server-side session management** to maintain conversation history. The frontend does NOT store history permanently - it only keeps messages in memory during the current session.

### History Flow

```
First Message:
  Request: { message: "Find apartments", session_id: undefined }
  Response: { message: "...", session_id: "abc123", ... }
  → Frontend stores session_id

Second Message:
  Request: { message: "Under 500000", session_id: "abc123" }
  Backend: Retrieves all previous messages from database
  Backend: Sends full history to Gemini AI
  Response: { message: "...", session_id: "abc123", ... }
  → AI understands context from previous messages
```

### Frontend Message Display

Messages are stored in component state:

```typescript
// AiAssistantModal.tsx
const [messages, setMessages] = useState<AiMessageDisplay[]>([]);
const [sessionId, setSessionId] = useState<string | null>(null);
```

**Important Notes:**
- Messages are stored in React state (temporary, lost on page refresh)
- Session ID is stored in React state (temporary)
- Full conversation history is managed on the backend
- Backend automatically retrieves history when session_id is provided

### Message Structure

```typescript
interface AiMessageDisplay {
  id: string;                    // Unique message ID
  role: 'user' | 'assistant';    // Message sender
  content: string;               // Message text
  timestamp: Date;               // When message was sent
  tools?: AiToolResult[];        // Tool results (assistant only)
}
```

### Displaying Messages

Messages are rendered in `AiChatArea.tsx`:

```typescript
{messages.map((message) => (
  <div key={message.id}>
    <AiMessageBubble message={message} />
    {/* Display tool results if any */}
    {message.tools?.map((tool, toolIndex) => (
      <AiPropertyResults key={toolIndex} tool={tool} />
    ))}
  </div>
))}
```

### Loading History on Modal Open

Currently, the modal starts with an empty messages array. To load previous messages:

1. **Option 1**: Fetch history from backend when modal opens
2. **Option 2**: Keep messages in state even after modal closes (current implementation could be enhanced)

**Example Enhancement:**

```typescript
useEffect(() => {
  if (open && sessionId) {
    // Fetch previous messages from backend
    fetchConversationHistory(sessionId);
  }
}, [open, sessionId]);
```

---

## Tool Results Display

### How Tools Work

When the AI needs to search for properties, it calls an MCP tool. The backend executes the tool and returns results in the response.

### Tool Result Structure

```typescript
interface AiToolResult {
  type: string;        // e.g., "property_search"
  name: string;        // Tool name
  result?: any;        // Tool execution result
  error?: string;      // Error message if failed
}
```

### Property Search Result Format

```typescript
{
  type: "property_search",
  name: "search_properties",
  result: {
    count: 5,
    properties: [
      {
        id: 123,
        title: "Modern Apartment",
        price: "5000000 MMK",
        area_sqft: "1200",
        bedrooms: 2,
        bathrooms: 1,
        address: "Yangon, Myanmar",
        property_type: "Apartment",
        listing_type: "For Sale",
        image_url: "https://...",
        // ... other fields
      },
      // ... more properties
    ]
  }
}
```

### Displaying Tool Results

Tool results are displayed in `AiPropertyResults.tsx`:

```typescript
export function AiPropertyResults({ tool }: { tool: AiToolResult }) {
  // Only display property_search results
  if (tool.type !== 'property_search' || !tool.result) {
    return null;
  }

  const result = tool.result as { count: number; properties: AiProperty[] };
  const properties = result.properties || [];

  return (
    <div>
      <h3>Found {result.count} properties</h3>
      <div className="grid">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
}
```

### Rendering Flow

```
AI Response with Tools
  ↓
Stored in message.tools array
  ↓
AiChatArea maps through messages
  ↓
For each message.tools, renders AiPropertyResults
  ↓
AiPropertyResults displays property cards
```

---

## API Integration

### Endpoint

```
POST /api/v1/frontend/ai-assistant/chat
```

### Request Headers

```
Content-Type: application/json
Authorization: Bearer {token}  // If authentication required
```

### Request Body

```json
{
  "message": "Find apartments in Yangon",
  "session_id": "optional-session-id"
}
```

### Response Structure

```json
{
  "success": true,
  "message": "AI response received successfully",
  "data": {
    "message": "I found some apartments for you...",
    "session_id": "abc123def456",
    "finish_reason": "STOP",
    "tools": [
      {
        "type": "property_search",
        "name": "search_properties",
        "result": {
          "count": 5,
          "properties": [...]
        }
      }
    ]
  }
}
```

### Error Handling

```typescript
// Errors are handled in the mutation hook
onError: (error: any) => {
  const errorMessage = 
    error?.response?.data?.message || 
    error?.message || 
    'Failed to send message';
  toast.error(errorMessage);
}
```

---

## State Management

### Component State

#### AiAssistantModal

```typescript
const [messages, setMessages] = useState<AiMessageDisplay[]>([]);
const [sessionId, setSessionId] = useState<string | null>(null);
```

- **messages**: Array of all messages in current conversation
- **sessionId**: Current session ID for API requests

#### AiInputArea

```typescript
const [message, setMessage] = useState('');
```

- **message**: Current input field value

### Server State (TanStack Query)

```typescript
const chatMutation = useAiAssistantChat();
```

- **isPending**: Loading state
- **mutateAsync**: Function to send message
- **error**: Error state (handled automatically)

### State Flow

```
User Input → Local State (message)
  ↓
Send → Optimistic Update (messages)
  ↓
API Call → TanStack Query (loading state)
  ↓
Success → Update messages + sessionId
  ↓
Error → Toast notification (via mutation hook)
```

---

## Usage Examples

### Basic Usage

The AI Assistant is automatically integrated via the trigger button:

```tsx
// In Layout component
import { AiTriggerButton } from '@/components/features/aiAssistant';

<Layout>
  {/* ... other content */}
  <AiTriggerButton />  {/* Floating button */}
</Layout>
```

### Manual Integration

If you want to integrate manually:

```tsx
import { AiAssistantModal } from '@/components/features/aiAssistant';
import { useState } from 'react';

function MyComponent() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>Open AI</button>
      <AiAssistantModal open={open} onOpenChange={setOpen} />
    </>
  );
}
```

### Custom Quick Actions

To customize quick actions, edit `AiChatArea.tsx`:

```typescript
const QUICK_ACTIONS = [
  { 
    icon: Home, 
    label: 'Find apartments', 
    prompt: 'Find apartments in Yangon' 
  },
  // Add more actions...
] as const;
```

### Accessing Messages Programmatically

Currently, messages are only accessible within the modal. To access them externally:

```typescript
// Option 1: Use a context provider
const AiAssistantContext = createContext();

// Option 2: Use a global state management (Zustand, Redux)
// Option 3: Export messages from modal (not recommended)
```

---

## Key Features Explained

### 1. Auto-scrolling

```typescript
// AiChatArea.tsx
useEffect(() => {
  const timer = setTimeout(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, 100);
  return () => clearTimeout(timer);
}, [messages, isLoading]);
```

Automatically scrolls to bottom when new messages arrive.

### 2. Loading States

```typescript
// Show typing indicator
{isLoading && <AiTypingIndicator />}

// Disable input during loading
<AiInputArea isLoading={chatMutation.isPending} />
```

### 3. Optimistic Updates

User messages appear immediately, even before API response:

```typescript
// Add user message first
setMessages((prev) => [...prev, userMessage]);

// Then add AI response when received
setMessages((prev) => [...prev, aiMessage]);
```

### 4. Error Handling

Errors are handled at multiple levels:

1. **API Level**: HTTP errors
2. **Mutation Hook**: Toast notifications
3. **Component Level**: Disabled states during errors

---

## Best Practices

### 1. Message ID Generation

Always use unique IDs for messages:

```typescript
const generateMessageId = () => 
  `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
```

### 2. Session Management

Always include session_id after first message:

```typescript
const response = await chatMutation.mutateAsync({
  message: content,
  session_id: sessionId || undefined,  // Include if exists
});
```

### 3. Type Safety

Always use TypeScript types:

```typescript
import type { AiMessageDisplay, AiChatRequest } from '@/types/aiAssistant';
```

### 4. Error Handling

Never forget error handling:

```typescript
try {
  // API call
} catch (error) {
  // Error is handled by mutation hook
  // But you can add additional handling here
}
```

---

## Troubleshooting

### Messages Not Appearing

1. Check if `messages` state is being updated
2. Verify API response structure
3. Check browser console for errors

### Session Not Persisting

1. Verify `session_id` is being saved: `console.log(sessionId)`
2. Check if session_id is included in subsequent requests
3. Verify backend session management

### Tool Results Not Displaying

1. Check if `tools` array exists in response
2. Verify `tool.type === 'property_search'`
3. Check `AiPropertyResults` component render logic

### Input Not Clearing

1. Verify `handleSend` clears message state
2. Check textarea reset logic
3. Verify no form submission interference

---

## Future Enhancements

### Potential Improvements

1. **Persist Messages**: Store messages in localStorage or backend
2. **Load History**: Fetch previous messages when modal opens
3. **Message Search**: Search through conversation history
4. **Export Chat**: Export conversation as text/PDF
5. **Voice Input**: Add voice message support
6. **File Attachments**: Support image/file attachments
7. **Markdown Support**: Render markdown in messages
8. **Code Highlighting**: Syntax highlighting for code blocks

---

## Conclusion

The AI Assistant integration provides a seamless chat experience with:
- ✅ Server-side conversation history
- ✅ Real-time message updates
- ✅ Tool result display
- ✅ Error handling
- ✅ Loading states
- ✅ Responsive design

For questions or issues, refer to the code comments or contact the development team.

---

**Last Updated**: 2025-01-XX
**Version**: 1.0.0

