'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { motion } from 'framer-motion';
import { Loader2, Mail, MailOpen, Search } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { toast } from 'sonner';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Mesajlar yüklenirken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleRead = async (messageId: string, currentReadStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ is_read: !currentReadStatus })
        .eq('id', messageId);

      if (error) throw error;

      setMessages(messages.map(msg =>
        msg.id === messageId ? { ...msg, is_read: !currentReadStatus } : msg
      ));

      if (selectedMessage?.id === messageId) {
        setSelectedMessage(prev => prev ? { ...prev, is_read: !currentReadStatus } : null);
      }

      toast.success(`Mesaj ${!currentReadStatus ? 'okundu' : 'okunmadı'} olarak işaretlendi`);
    } catch (error) {
      console.error('Error toggling message read status:', error);
      toast.error('Mesaj durumu güncellenirken bir hata oluştu');
    }
  };

  const filteredMessages = messages.filter(msg =>
    msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[var(--color-primary)]">
          Mesajlar
        </h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-fg-muted)]" />
          <input
            type="text"
            placeholder="Mesajlarda ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent w-64"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mesaj Listesi */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1 space-y-4"
        >
          {filteredMessages.length === 0 ? (
            <div className="text-center py-8 text-[var(--color-fg-muted)]">
              <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Henüz mesaj bulunmuyor.</p>
            </div>
          ) : (
            filteredMessages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                  selectedMessage?.id === message.id
                    ? 'bg-[var(--color-primary)] text-white shadow-lg'
                    : message.is_read
                    ? 'bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-hover)]'
                    : 'bg-[var(--color-primary)]/10 hover:bg-[var(--color-primary)]/20'
                }`}
                onClick={() => {
                  setSelectedMessage(message);
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{message.subject}</h3>
                    <p className="text-sm truncate opacity-80">{message.name}</p>
                    <p className="text-xs opacity-60">
                      {format(new Date(message.created_at), 'd MMMM yyyy HH:mm', { locale: tr })}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Mesaj Detayı */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2"
        >
          {selectedMessage ? (
            <div className="bg-[var(--color-bg-secondary)] rounded-lg p-6 space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{selectedMessage.subject}</h2>
                  <div className="space-y-1 text-[var(--color-fg-muted)]">
                    <p>Gönderen: {selectedMessage.name}</p>
                    <p>E-posta: {selectedMessage.email}</p>
                    <p>
                      Tarih: {format(new Date(selectedMessage.created_at), 'd MMMM yyyy HH:mm', { locale: tr })}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleRead(selectedMessage.id, selectedMessage.is_read)}
                    className={`p-2 rounded-lg transition-colors ${
                      selectedMessage.is_read
                        ? 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20'
                        : 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
                    }`}
                    title={selectedMessage.is_read ? 'Okunmadı olarak işaretle' : 'Okundu olarak işaretle'}
                  >
                    {selectedMessage.is_read ? (
                      <Mail className="w-5 h-5" />
                    ) : (
                      <MailOpen className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
              <div className="border-t border-[var(--color-border)] pt-6">
                <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-[var(--color-fg-muted)]">
              <p>Mesaj seçilmedi</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
} 