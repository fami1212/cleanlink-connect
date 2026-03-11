
-- Create conversations table
CREATE TABLE public.conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  client_id uuid NOT NULL,
  provider_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(order_id)
);

-- Create messages table
CREATE TABLE public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id uuid NOT NULL,
  content text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Conversations RLS: participants can view
CREATE POLICY "Participants can view conversations"
ON public.conversations FOR SELECT
TO authenticated
USING (auth.uid() = client_id OR auth.uid() IN (
  SELECT p.user_id FROM public.providers p WHERE p.id = provider_id
));

-- Conversations RLS: clients can create (linked to their order)
CREATE POLICY "Clients can create conversations"
ON public.conversations FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = client_id);

-- Messages RLS: participants can view
CREATE POLICY "Participants can view messages"
ON public.messages FOR SELECT
TO authenticated
USING (conversation_id IN (
  SELECT c.id FROM public.conversations c
  WHERE c.client_id = auth.uid() OR c.provider_id IN (
    SELECT p.id FROM public.providers p WHERE p.user_id = auth.uid()
  )
));

-- Messages RLS: participants can send
CREATE POLICY "Participants can send messages"
ON public.messages FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = sender_id AND
  conversation_id IN (
    SELECT c.id FROM public.conversations c
    WHERE c.client_id = auth.uid() OR c.provider_id IN (
      SELECT p.id FROM public.providers p WHERE p.user_id = auth.uid()
    )
  )
);

-- Messages RLS: recipients can mark as read
CREATE POLICY "Recipients can update read status"
ON public.messages FOR UPDATE
TO authenticated
USING (
  sender_id != auth.uid() AND
  conversation_id IN (
    SELECT c.id FROM public.conversations c
    WHERE c.client_id = auth.uid() OR c.provider_id IN (
      SELECT p.id FROM public.providers p WHERE p.user_id = auth.uid()
    )
  )
);

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;

-- Update trigger for conversations
CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
