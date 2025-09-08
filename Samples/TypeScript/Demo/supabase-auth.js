// Supabase Authentication Module for NeuroChat
class SupabaseAuth {
  constructor() {
    this.supabaseUrl = 'https://vgbqixrzqsxnhjfmzuob.supabase.co';
    this.supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnYnFpeHJ6cXN4bmhqZm16dW9iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU3NDk4ODIsImV4cCI6MjA0MTMyNTg4Mn0.YE0B3xqP9sJ1bnwHrLzUgtEDPRs8dY6BF6oZeCXFm3g';
    this.supabase = null;
  }

  async initialize() {
    // Load Supabase from CDN
    if (!window.supabase) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js';
      document.head.appendChild(script);
      
      await new Promise(resolve => {
        script.onload = resolve;
      });
    }
    
    this.supabase = window.supabase.createClient(this.supabaseUrl, this.supabaseKey);
  }

  signInWithGoogle() {
    return this.supabase.auth.signInWithOAuth({ provider: 'google' });
  }

  signInWithGithub() {
    return this.supabase.auth.signInWithOAuth({ provider: 'github' });
  }

  signInWithDiscord() {
    return this.supabase.auth.signInWithOAuth({ provider: 'discord' });
  }

  signOut() {
    return this.supabase.auth.signOut();
  }

  async saveChatMessage(message, isUser = false) {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) return null;
    
    return await this.supabase.from('chat_messages').insert({
      user_id: user.id,
      message,
      is_user: isUser,
      timestamp: new Date().toISOString()
    });
  }

  async getChatHistory() {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) return [];
    
    const { data, error } = await this.supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', user.id)
      .order('timestamp', { ascending: true })
      .limit(50);
      
    return error ? [] : data;
  }
}

// Make it available globally
window.SupabaseAuth = SupabaseAuth;