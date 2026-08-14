import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CampusAIService } from '../../services/aiService';
import type { AIResponse } from '../../services/aiService';
import type { ChatMessage, User } from '../../types';
import {
  INITIAL_ATTENDANCE,
  INITIAL_ASSIGNMENTS,
  INITIAL_PLACEMENTS
} from '../../services/mockData';
import {
  Bot,
  Send,
  Volume2,
  VolumeX,
  X,
  Maximize2,
  Minimize2,
  Sparkles,
  User as UserIcon,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';

interface AICampusCopilotProps {
  onNavigateTab?: (tab: string) => void;
  onGoToLanding?: () => void;
}

export const AICampusCopilot: React.FC<AICampusCopilotProps> = ({ onNavigateTab, onGoToLanding }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'bot',
      text: `👋 Greetings ${user?.name || 'User'}! I am **Aether AI Campus Assistant**. How can I assist you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestions: [
        '📊 Navigate to attendance tracker',
        '📝 Open pending assignments',
        '💼 Show placement opportunities',
        '🔐 How does email OTP register work?'
      ]
    }
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim()) return;

    const dummyUser: User = user || {
      id: 'usr_guest',
      name: 'Guest User',
      email: 'guest@aether.edu',
      role: 'student',
      gender: 'male',
      department: 'Computer Science & Engineering',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      verified: true,
      cgpa: 9.0
    };

    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!queryText) setInputQuery('');
    setLoading(true);

    try {
      const response: AIResponse = await CampusAIService.queryCopilot(
        textToSend,
        dummyUser,
        INITIAL_ATTENDANCE,
        INITIAL_ASSIGNMENTS,
        INITIAL_PLACEMENTS
      );

      const botMsg: ChatMessage = {
        id: `msg_bot_${Date.now()}`,
        sender: 'bot',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: response.suggestions,
        actionType: response.actionType
      };

      setMessages(prev => [...prev, botMsg]);

      // AUTOMATIC NAVIGATION TRIGGER
      if (response.navigateToTab) {
        if (response.navigateToTab === 'landing' && onGoToLanding) {
          onGoToLanding();
        } else if (onNavigateTab) {
          onNavigateTab(response.navigateToTab);
        }
      }

      if (speechEnabled) {
        CampusAIService.speakText(response.text);
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: `msg_err_${Date.now()}`,
          sender: 'bot',
          text: 'Apologies, I encountered an issue retrieving real-time campus data. Please try again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (actionType?: string) => {
    if (!actionType) return;
    if (actionType === 'go_landing' && onGoToLanding) onGoToLanding();
    if (actionType === 'view_attendance' && onNavigateTab) onNavigateTab('attendance');
    if (actionType === 'view_assignments' && onNavigateTab) onNavigateTab('assignments');
    if (actionType === 'view_placements' && onNavigateTab) onNavigateTab('placements');
    if (actionType === 'view_events' && onNavigateTab) onNavigateTab('events');
    if (actionType === 'view_settings' && onNavigateTab) onNavigateTab('settings');
  };

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open AI Campus Copilot Chat"
          className="fixed bottom-6 right-6 z-40 group p-4 bg-sky-600 hover:bg-sky-500 text-white rounded-full shadow-lg shadow-sky-600/30 transition-all transform hover:scale-105 flex items-center gap-3"
        >
          <div className="relative">
            <Bot className="w-6 h-6 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white animate-ping"></span>
          </div>
          <span className="hidden group-hover:inline-block font-bold text-xs tracking-wide pr-1">
            Aether AI Assistant
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all flex flex-col bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden ${
            isExpanded
              ? 'inset-6 max-w-5xl mx-auto my-auto h-[88vh]'
              : 'bottom-6 right-6 w-[420px] h-[580px] max-w-[92vw]'
          }`}
        >
          {/* Header */}
          <div className="p-4 bg-sky-600 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-2xl bg-white/20 text-white">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-white text-sm tracking-wide flex items-center gap-2">
                  Aether AI Copilot
                  <span className="px-2 py-0.5 text-[9px] uppercase font-extrabold bg-white/20 text-white rounded-full">
                    Auto-Navigate
                  </span>
                </h3>
                <p className="text-[11px] text-sky-100 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-white" />
                  Website Q&A & Voice Engine
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-white">
              <button
                onClick={() => {
                  const next = !speechEnabled;
                  setSpeechEnabled(next);
                  if (!next) CampusAIService.stopSpeech();
                }}
                className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                title={speechEnabled ? 'Mute AI Voice' : 'Enable AI Voice'}
              >
                {speechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 rounded-lg hover:bg-white/20 transition-colors hidden sm:block"
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              <button
                onClick={() => {
                  CampusAIService.stopSpeech();
                  setIsOpen(false);
                }}
                className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-8 h-8 rounded-full bg-sky-600 flex items-center justify-center text-white shrink-0 mt-1 shadow-sm">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className="max-w-[85%] space-y-2">
                  <div
                    className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-sky-600 text-white rounded-tr-none shadow-sm'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-sm'
                    }`}
                  >
                    <div className="whitespace-pre-wrap font-sans">
                      {msg.text.split('\n').map((line, idx) => (
                        <p key={idx} className={line.startsWith('•') || line.startsWith('📌') || line.startsWith('💼') ? 'my-1' : ''}>
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Navigation Action Button */}
                  {msg.actionType && (
                    <button
                      onClick={() => handleActionClick(msg.actionType)}
                      className="px-3 py-1.5 bg-sky-100 hover:bg-sky-200 border border-sky-300 rounded-xl text-sky-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <span>Navigate Now</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* Prompt Suggestions */}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.suggestions.map((sug, i) => (
                        <button
                          key={i}
                          onClick={() => handleSend(sug)}
                          className="px-2.5 py-1 text-xs bg-white hover:bg-sky-50 border border-slate-200 hover:border-sky-300 rounded-lg text-slate-700 font-semibold transition-all shadow-sm"
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  )}

                  <span className="block text-[10px] text-slate-400 px-1">
                    {msg.timestamp}
                  </span>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center text-slate-700 shrink-0 mt-1">
                    <UserIcon className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-slate-500 text-xs p-2">
                <Sparkles className="w-4 h-4 text-sky-600 animate-spin" />
                <span>Aether AI is processing your request & navigating...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-3 bg-white border-t border-slate-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask AI (e.g. 'Navigate to assignments', 'How to register?')..."
                className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500"
              />
              <button
                type="submit"
                disabled={!inputQuery.trim() || loading}
                aria-label="Send AI Query"
                className="p-2.5 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white rounded-xl shadow transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
