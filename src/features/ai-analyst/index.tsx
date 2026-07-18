// src/features/ai-analyst/index.tsx
import { useState } from 'react';
import { useConversations, useMessages } from './hooks/useConversations';
import { useChat } from './hooks/useChat';
import { ConversationList } from './components/ConversationList';
import { ChatWindow } from './components/ChatWindow';
import { useWalletUser } from '../auth/components/WalletUserProvider';
import { useWallet } from '@/features/wallet/hooks/useWallet';
import { Button } from '@/shared/components/ui/button';
import { Menu, Wallet, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMediaQuery } from '@/shared/hooks/useMediaQuery';

export default function AIAnalystPage() {
  const { user } = useWalletUser();
  const { connect } = useWallet();
  const { conversations, isLoading: convLoading, createConversation } = useConversations();
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: initialMessages = [], isLoading: msgsLoading } = useMessages(activeConvId);
  const { messages, sendMessage, isStreaming, stopStreaming } = useChat(activeConvId, initialMessages);

  const isMobile = useMediaQuery('(max-width: 768px)');

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] space-y-4">
        <Wallet className="h-16 w-16 text-gray-400" />
        <h1 className="text-2xl font-bold">AI Analyst</h1>
        <p className="text-gray-500 text-center max-w-md">
          Connect your wallet to chat with the AI Analyst and get personalised football insights.
        </p>
        <Button onClick={connect}>
          <Wallet className="mr-2 h-4 w-4" />
          Connect Wallet
        </Button>
      </div>
    );
  }

  const handleNewConversation = async () => {
    const newConv = await createConversation();
    setActiveConvId(newConv.id);
    if (isMobile) setSidebarOpen(false);
  };

  const handleSelectConversation = (id: string) => {
    setActiveConvId(id);
    if (isMobile) setSidebarOpen(false);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] relative">
      {/* Mobile overlay */}
      {isMobile && (
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              className="fixed inset-0 z-40 bg-black/50"
              onClick={() => setSidebarOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          )}
        </AnimatePresence>
      )}

      {/* Sidebar / Drawer */}
      <AnimatePresence>
        {(sidebarOpen || !isMobile) && (
          <motion.div
            className={`${
              isMobile
                ? 'fixed inset-y-0 left-0 z-50 w-72 shadow-2xl'
                : 'relative w-72'
            } border-r border-border-primary bg-bg-primary h-full`}
            initial={isMobile ? { x: '-100%' } : false}
            animate={{ x: 0 }}
            exit={isMobile ? { x: '-100%' } : {}}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <ConversationList
              conversations={conversations}
              activeId={activeConvId}
              onSelect={handleSelectConversation}
              onNew={handleNewConversation}
              isLoading={convLoading}
              onClose={() => setSidebarOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-h-0">
        {isMobile && (
          <div className="p-2 border-b border-border-primary">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md hover:bg-bg-secondary"
              aria-label="Open conversations"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        )}

        {activeConvId ? (
          <ChatWindow
            messages={messages}
            onSend={sendMessage}
            isStreaming={isStreaming}
            onStop={stopStreaming}
          />
        ) : (
          <div className="flex-1 text-black flex flex-col items-center justify-center gap-4">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Start a new conversation
            </p>
            <Button className='text-black' onClick={handleNewConversation}>
              <Plus className="mr-2 h-4 w-4" />
              New Chat
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}