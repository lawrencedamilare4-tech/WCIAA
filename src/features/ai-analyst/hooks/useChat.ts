import { useState, useCallback, useRef, useEffect } from 'react';
import { useWalletUser } from '@/features/auth/components/WalletUserProvider';
import { useWalletStore } from '@/stores/wallet-store';
import { streamChat } from '@/services/ai/ai-client';
import { supabase } from '@/shared/lib/supabase';
import { toast } from 'sonner';
import type { ChatMessage, MessageWithStreaming } from '../types';

export function useChat(conversationId: string | null, initialMessages: ChatMessage[] = []) {
  const { user } = useWalletUser();

  // Always have a wallet address – context first, then store fallback
  const walletAddress = user?.walletAddress ?? useWalletStore.getState().address;

  const [messages, setMessages] = useState<MessageWithStreaming[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const messagesRef = useRef<MessageWithStreaming[]>([]);
  messagesRef.current = messages;

  // Reset messages only when conversationId changes
  const prevConversationId = useRef(conversationId);
  useEffect(() => {
    if (prevConversationId.current !== conversationId) {
      setMessages(initialMessages);
      prevConversationId.current = conversationId;
    }
  }, [conversationId, initialMessages]);

  // Reset when conversationId becomes null
  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      prevConversationId.current = null;
    }
  }, [conversationId]);

  const sendMessage = useCallback(
    async (content: string) => {
      // Only require a valid conversationId and not already streaming
      if (!conversationId || isStreaming) return;

      // Use wallet address (already guaranteed by the hook)
      const currentWallet = walletAddress;
      if (!currentWallet) {
        toast.error('Wallet not connected');
        return;
      }

      const userMsg: MessageWithStreaming = {
        role: 'user',
        content,
        conversation_id: conversationId,
      };
      setMessages((prev) => [...prev, userMsg]);

      // Save user message to DB
      await supabase.from('chat_messages').insert({
        conversation_id: conversationId,
        role: 'user',
        content,
        agent: null,
      });

      // Prepare AI placeholder
      setIsStreaming(true);
      const aiMsg = {
        role: 'assistant',
        content: '',
        conversation_id: conversationId,
        isStreaming: true,
      };
      setMessages((prev) => [...prev, aiMsg]);

      // Build API messages – only non‑streaming messages + the new user message
      const apiMessages = messagesRef.current
        .filter((m) => !m.isStreaming)
        .map((m) => ({ role: m.role, content: m.content }));
      apiMessages.push({ role: 'user', content });

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const stream = await streamChat(apiMessages, { conversationId }, controller.signal);
        const reader = stream.getReader();
        const decoder = new TextDecoder();
        let fullContent = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n').filter((line) => line.startsWith('data: '));
          for (const line of lines) {
            try {
        const json = JSON.parse(line.slice(6));
const newContent = json.choices?.[0]?.delta?.content ?? '';
fullContent += newContent;  
              setMessages((prev) => {
                const updated = [...prev];
                const last = updated[updated.length - 1];
                if (last.role === 'assistant') {
                  updated[updated.length - 1] = { ...last, content: fullContent, isStreaming: true };
                }
                return updated;
              });
            } catch {}
          }
        }

        // Mark streaming complete
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last.role === 'assistant') {
            updated[updated.length - 1] = { ...last, isStreaming: false };
          }
          return updated;
        });

        // Save assistant message
        await supabase.from('chat_messages').insert({
          conversation_id: conversationId,
          role: 'assistant',
          content: fullContent,
          agent: 'chat',
        });

        // Update conversation title for first exchange
        if (messagesRef.current.length === 0) {
          const title = fullContent.slice(0, 50).replace(/\n/g, ' ') + '...';
          await supabase
            .from('chat_conversations')
            .update({ title, updated_at: new Date().toISOString() })
            .eq('id', conversationId);
        }
      } catch (err: any) {
        if (err.name === 'AbortError') return;
        toast.error('AI response failed');
        // Remove incomplete AI message
        setMessages((prev) => prev.filter((m) => !m.isStreaming));
      } finally {
        setIsStreaming(false);
        abortControllerRef.current = null;
      }
    },
    [conversationId, isStreaming, walletAddress]
  );

  const stopStreaming = useCallback(() => {
    abortControllerRef.current?.abort();
  }, []);

  return { messages, sendMessage, isStreaming, stopStreaming };
}