// src/features/ai-analyst/index.tsx
import { useState } from 'react';
import { useConversations, useMessages } from './hooks/useConversations';
import { useChat } from './hooks/useChat';
import { ConversationList } from './components/ConversationList';
import { ChatWindow } from './components/ChatWindow';
import { useWalletUser } from '../auth/components/WalletUserProvider';

export default function AIAnalystPage() {
  const { user } = useWalletUser();
  const { conversations, isLoading: convLoading, createConversation } = useConversations();
  const [activeConvId, setActiveConvId] = useState<string | null>(null);

  const { data: initialMessages = [], isLoading: msgsLoading } = useMessages(activeConvId);
  const { messages, sendMessage, isStreaming, stopStreaming } = useChat(activeConvId, initialMessages);

  const handleNewConversation = async () => {
    console.log("gg", user);
    
    if (!user) return;
    console.log("hh");
    
    const newConv = await createConversation();
    setActiveConvId(newConv.id);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <ConversationList
        conversations={conversations}
        activeId={activeConvId}
        onSelect={setActiveConvId}
        onNew={handleNewConversation}
        isLoading={convLoading}
      />
      <div className="flex-1 flex flex-col min-h-0">
        {activeConvId ? (
          <ChatWindow
            messages={messages}
            onSend={sendMessage}
            isStreaming={isStreaming}
            onStop={stopStreaming}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
            Select a conversation or start a new one.
          </div>
        )}
      </div>
    </div>
  );
}