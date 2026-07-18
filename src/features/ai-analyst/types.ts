import type { Database } from '../../shared/types/supabase';

export type Conversation = Database['public']['Tables']['chat_conversations']['Row'];
export type ChatMessage = Database['public']['Tables']['chat_messages']['Row'];

export interface MessageWithStreaming extends ChatMessage {
  isStreaming?: boolean; // true while AI is writing tokens
}