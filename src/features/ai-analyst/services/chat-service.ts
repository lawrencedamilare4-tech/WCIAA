import { supabase } from '../../../shared/lib/supabase';
import type { Conversation, ChatMessage } from '../types';

/**
 * Fetch all conversations for the current user, newest first.
 */
export async function getConversations(userId: string): Promise<Conversation[]> {
  const { data, error } = await supabase
    .from('chat_conversations')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return data;
}

/**
 * Create a new conversation and return it.
 */
export async function createConversation(userId: string, title?: string): Promise<Conversation> {
  const { data, error } = await supabase
    .from('chat_conversations')
    .insert({ user_id: userId, title: title ?? 'New Chat' })
    .select('*')
    .single();
  if (error) throw error;
  return data;
}

/**
 * Fetch messages for a conversation, oldest first.
 */
export async function getMessages(conversationId: string): Promise<ChatMessage[]> {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data;
}

/**
 * Insert a new message into a conversation.
 */
export async function saveMessage(message: Omit<ChatMessage, 'id' | 'created_at'>): Promise<ChatMessage> {
  const { data, error } = await supabase
    .from('chat_messages')
    .insert(message)
    .select('*')
    .single();
  if (error) throw error;
  return data;
}

/**
 * Update conversation title (used after first AI response).
 */
export async function updateConversationTitle(conversationId: string, title: string): Promise<void> {
  await supabase
    .from('chat_conversations')
    .update({ title, updated_at: new Date().toISOString() })
    .eq('id', conversationId);
}