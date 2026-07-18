import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/shared/lib/supabase';
import { useWalletUser } from '@/features/auth/components/WalletUserProvider';
import { toast } from 'sonner';

export function useConversations() {
  const { user } = useWalletUser();
  const queryClient = useQueryClient();
  const walletAddress = user?.walletAddress;

  const conversationsQuery = useQuery({
    queryKey: ['conversations', walletAddress],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chat_conversations')
        .select('*')
        .eq('wallet_address', walletAddress!)
        .order('updated_at', { ascending: false });
      if (error) {
        console.error('Error fetching conversations:', error);
        throw error;
      }
      return data ?? [];
    },
    enabled: !!walletAddress,
    retry: false,
  });

  const createMutation = useMutation({
    mutationFn: async (title?: string) => {
      console.log('Creating conversation for wallet:', walletAddress);
      const { data, error } = await supabase
        .from('chat_conversations')
        .insert({ wallet_address: walletAddress!, title: title ?? 'New Chat' })
        .select('*')
        .single();
      if (error) {
        console.error('Error creating conversation:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations', walletAddress] });
    },
    onError: (err: any) => toast.error(err.message || 'Failed to create conversation'),
  });

  return {
    conversations: conversationsQuery.data ?? [],
    isLoading: conversationsQuery.isLoading,
    isError: conversationsQuery.isError,
    error: conversationsQuery.error,
    createConversation: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
  };
}

export function useMessages(conversationId: string | null) {
  return useQuery({
    queryKey: ['messages', conversationId],
    queryFn: async () => {
      console.log('Fetching messages for conversation:', conversationId);
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', conversationId!)
        .order('created_at', { ascending: true });
      if (error) {
        console.error('Error fetching messages:', error);
        throw error;
      }
      console.log('Fetched messages:', data);
      return data ?? [];
    },
    enabled: !!conversationId,
  });
}