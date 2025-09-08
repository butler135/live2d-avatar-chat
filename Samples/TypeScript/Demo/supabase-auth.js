// Supabase Authentication Module for NeuroChat
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = 'https://vgbqixrzqsxnhjfmzuob.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnYnFpeHJ6cXN4bmhqZm16dW9iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU3NDk4ODIsImV4cCI6MjA0MTMyNTg4Mn0.YE0B3xqP9sJ1bnwHrLzUgtEDPRs8dY6BF6oZeCXFm3g'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Auth helpers
export const signInWithGoogle = () => supabase.auth.signInWithOAuth({ provider: 'google' })
export const signInWithGithub = () => supabase.auth.signInWithOAuth({ provider: 'github' })  
export const signInWithDiscord = () => supabase.auth.signInWithOAuth({ provider: 'discord' })
export const signOut = () => supabase.auth.signOut()

// Chat history functions
export const saveChatMessage = async (message, isUser = false) => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  
  return await supabase.from('chat_messages').insert({
    user_id: user.id,
    message,
    is_user: isUser,
    timestamp: new Date().toISOString()
  })
}

export const getChatHistory = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []
  
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('user_id', user.id)
    .order('timestamp', { ascending: true })
    .limit(50)
    
  return error ? [] : data
}