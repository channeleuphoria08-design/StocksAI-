import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2, Bot, User } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { GoogleGenAI } from '@google/genai';
import { motion, AnimatePresence } from 'motion/react';

interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
}

export const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'model',
      content: 'Hello! I am your AI financial assistant. Ask me anything about stocks, market trends, or investing strategies.',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("Gemini API key is missing.");
      }

      if (!chatRef.current) {
        const ai = new GoogleGenAI({ apiKey });
        chatRef.current = ai.chats.create({
          model: "gemini-3-flash-preview",
          config: {
            systemInstruction: "You are a helpful and knowledgeable financial assistant. Provide concise, accurate, and easy-to-understand answers about stocks, investing, and the stock market. Do not provide personalized financial advice, but rather educational information. Format your responses with simple markdown.",
          },
        });
      }

      const response = await chatRef.current.sendMessage({ message: userMessage.content });

      const modelMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: response.text || "I'm sorry, I couldn't generate a response.",
      };

      setMessages((prev) => [...prev, modelMessage]);
    } catch (error: any) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: "Sorry, I encountered an error while processing your request. Please try again later.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 bg-emerald-500 text-white rounded-full shadow-lg shadow-emerald-500/20 z-50 transition-transform ${isOpen ? 'hidden' : 'flex'}`}
      >
        <MessageSquare className="w-6 h-6" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 w-[380px] h-[600px] max-h-[80vh] bg-zinc-950 border border-white/10 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-zinc-900/50">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-100">AI Assistant</h3>
                  <p className="text-xs text-emerald-400">Online</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-white/5 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      msg.role === 'user' ? 'bg-zinc-800 ml-2' : 'bg-emerald-500/20 mr-2'
                    }`}>
                      {msg.role === 'user' ? (
                        <User className="w-4 h-4 text-zinc-300" />
                      ) : (
                        <Bot className="w-4 h-4 text-emerald-400" />
                      )}
                    </div>
                    <div className={`p-3 rounded-2xl text-sm ${
                      msg.role === 'user' 
                        ? 'bg-emerald-600 text-white rounded-tr-sm' 
                        : 'bg-zinc-800 text-zinc-200 rounded-tl-sm border border-white/5'
                    }`}>
                      <div 
                        className="prose prose-invert prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: formatMarkdown(msg.content) }}
                      />
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex max-w-[85%] flex-row">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-emerald-500/20 mr-2">
                      <Bot className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="p-4 rounded-2xl bg-zinc-800 text-zinc-200 rounded-tl-sm border border-white/5 flex items-center space-x-2">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/10 bg-zinc-900/50">
              <form onSubmit={handleSend} className="flex items-center space-x-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about stocks..."
                  className="flex-1 bg-zinc-950 border-white/10 focus-visible:ring-emerald-500 rounded-full"
                  disabled={isLoading}
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  className="rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex-shrink-0"
                  disabled={!input.trim() || isLoading}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Simple markdown formatter
function formatMarkdown(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code class="bg-black/30 px-1 py-0.5 rounded text-emerald-300">$1</code>')
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>');
}
