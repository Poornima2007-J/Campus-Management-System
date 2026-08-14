import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Image as ImageIcon,
  Mic,
  Video as VideoIcon,
  Globe,
  CheckCheck,
  Play,
  Pause,
  X
} from 'lucide-react';
import type { UserRole } from '../../types';

export interface ChatMediaItem {
  type: 'text' | 'image' | 'voice' | 'video';
  url?: string;
  duration?: string;
}

export interface ChatMessageItem {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  senderAvatar: string;
  text: string;
  media?: ChatMediaItem;
  timestamp: string;
  translatedText?: string;
  targetLang?: string;
}

interface RealtimeChatProps {
  currentUserRole: UserRole;
  currentUserName: string;
  currentUserAvatar: string;
}

const LANGUAGES = [
  { code: 'ta', name: 'Tamil (தமிழ்)' },
  { code: 'hi', name: 'Hindi (हिंदी)' },
  { code: 'es', name: 'Spanish (Español)' },
  { code: 'fr', name: 'French (Français)' },
  { code: 'de', name: 'German (Deutsch)' },
  { code: 'ja', name: 'Japanese (日本語)' },
  { code: 'zh', name: 'Chinese (中文)' },
  { code: 'en', name: 'English' }
];

// Sample Translation Dictionary for instant accurate translation
const TRANSLATIONS_DICT: Record<string, Record<string, string>> = {
  ta: {
    'Hello Professor, I submitted my CS101 assignment!': 'வணக்கம் பேராசிரியர், எனது CS101 ஒப்படைப்பை சமர்ப்பித்துவிட்டேன்!',
    'Great job! I will grade it shortly.': 'சிறந்த பணி! விரைவில் மதிப்பெண் வழங்குவேன்.',
    'Please check the attendance PIN for today.': 'இன்றைய வருகைக்கான PIN குறியீட்டைச் சரிபார்க்கவும்.',
    'Thank you for your guidance!': 'உங்கள் வழிகாட்டுதலுக்கு நன்றி!'
  },
  hi: {
    'Hello Professor, I submitted my CS101 assignment!': 'नमस्ते प्रोफेसर, मैंने अपना CS101 असाइनमेंट सबमिट कर दिया है!',
    'Great job! I will grade it shortly.': 'बहुत बढ़िया काम! मैं जल्द ही इसे ग्रेड करूँगा।',
    'Please check the attendance PIN for today.': 'कृपया आज के लिए उपस्थिति पिन की जांच करें।',
    'Thank you for your guidance!': 'आपके मार्गदर्शन के लिए धन्यवाद!'
  },
  es: {
    'Hello Professor, I submitted my CS101 assignment!': '¡Hola profesor, envié mi tarea de CS101!',
    'Great job! I will grade it shortly.': '¡Gran trabajo! Lo calificaré en breve.',
    'Please check the attendance PIN for today.': 'Por favor verifique el PIN de asistencia de hoy.',
    'Thank you for your guidance!': '¡Gracias por su orientación!'
  },
  fr: {
    'Hello Professor, I submitted my CS101 assignment!': 'Bonjour Professeur, j\'ai soumis devoir CS101 !',
    'Great job! I will grade it shortly.': 'Excellent travail ! Je vais le noter sous peu.',
    'Please check the attendance PIN for today.': 'Veuillez vérifier le code PIN de présence d\'aujourd\'hui.',
    'Thank you for your guidance!': 'Merci pour vos conseils !'
  }
};

export const RealtimeChat: React.FC<RealtimeChatProps> = ({
  currentUserRole,
  currentUserName,
  currentUserAvatar
}) => {
  const [messages, setMessages] = useState<ChatMessageItem[]>([
    {
      id: 'msg_1',
      senderId: 'faculty_1',
      senderName: 'Dr. Elena Rostova (Faculty)',
      senderRole: 'faculty',
      senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      text: 'Hello Students! Welcome to CS101 Advanced Web Architecture. Feel free to ask any queries here.',
      timestamp: '10:00 AM'
    },
    {
      id: 'msg_2',
      senderId: 'student_1',
      senderName: 'Manimegalai S (Student)',
      senderRole: 'student',
      senderAvatar: currentUserAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      text: 'Hello Professor, I submitted my CS101 assignment!',
      timestamp: '10:05 AM'
    },
    {
      id: 'msg_3',
      senderId: 'faculty_1',
      senderName: 'Dr. Elena Rostova (Faculty)',
      senderRole: 'faculty',
      senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      text: 'Great job! I will grade it shortly.',
      timestamp: '10:08 AM'
    }
  ]);

  const [inputMsg, setInputMsg] = useState('');
  const [selectedLang, setSelectedLang] = useState('ta');
  const [selectedMedia, setSelectedMedia] = useState<ChatMediaItem | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recordingTimerRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle Text Send
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMsg.trim() && !selectedMedia) return;

    const newMsg: ChatMessageItem = {
      id: `msg_${Date.now()}`,
      senderId: currentUserRole === 'student' ? 'student_1' : 'faculty_1',
      senderName: currentUserName || (currentUserRole === 'student' ? 'Student' : 'Faculty Professor'),
      senderRole: currentUserRole,
      senderAvatar: currentUserAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      text: inputMsg || (selectedMedia?.type === 'image' ? '📸 Sent a photo attachment' : selectedMedia?.type === 'voice' ? '🎙️ Sent a voice note' : '🎥 Sent a video attachment'),
      media: selectedMedia || undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMsg]);
    setInputMsg('');
    setSelectedMedia(null);

    // Auto simulated response from Faculty/Student after 1.5 seconds
    setTimeout(() => {
      if (currentUserRole === 'student') {
        const reply: ChatMessageItem = {
          id: `msg_${Date.now() + 1}`,
          senderId: 'faculty_1',
          senderName: 'Dr. Elena Rostova (Faculty)',
          senderRole: 'faculty',
          senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
          text: 'Thank you for your message! I have received your attachment and verified it in the faculty portal.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, reply]);
      }
    }, 1500);
  };

  // Attach Image / Video file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setSelectedMedia({
            type,
            url: reader.result
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Start Voice Note Recording
  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    recordingTimerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };

  // Stop Voice Note Recording and Attach
  const stopRecording = () => {
    setIsRecording(false);
    clearInterval(recordingTimerRef.current);
    setSelectedMedia({
      type: 'voice',
      url: 'https://actions.google.com/sounds/v1/ambiences/rain_heavy.ogg', // Sample voice note
      duration: `${recordingTime}s`
    });
  };

  // Multi-Language Translation Engine
  const handleTranslateMessage = (msgId: string, langCode: string) => {
    setMessages(prev =>
      prev.map(m => {
        if (m.id === msgId) {
          const dict = TRANSLATIONS_DICT[langCode];
          const translated = (dict && dict[m.text]) || `[${langCode.toUpperCase()} Translation]: ${m.text}`;
          return {
            ...m,
            translatedText: translated,
            targetLang: langCode
          };
        }
        return m;
      })
    );
  };

  return (
    <div className="flex flex-col h-[600px] bg-slate-900 rounded-3xl border border-slate-700 shadow-2xl overflow-hidden animate-fade-in font-sans">
      
      {/* CHAT HEADER (WhatsApp Style) */}
      <div className="px-6 py-4 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={
                currentUserRole === 'student'
                  ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
                  : currentUserAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
              }
              alt="Chat Partner"
              className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-800"></span>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              {currentUserRole === 'student' ? 'Dr. Elena Rostova (Faculty)' : 'Student Channel (CS101)'}
              <span className="px-2 py-0.5 text-[10px] bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30 rounded-full">
                Online 🟢
              </span>
            </h4>
            <p className="text-[11px] text-slate-400">Real-Time Messaging • End-to-End Encrypted</p>
          </div>
        </div>

        {/* Translation Language Selector */}
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-sky-400" />
          <select
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value)}
            className="px-2.5 py-1 bg-slate-700 border border-slate-600 rounded-xl text-xs text-white focus:outline-none"
          >
            {LANGUAGES.map(lang => (
              <option key={lang.code} value={lang.code}>{lang.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* MESSAGES BODY */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-950/60 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]">
        {messages.map((msg) => {
          const isMe = (currentUserRole === 'student' && msg.senderRole === 'student') || (currentUserRole === 'faculty' && msg.senderRole === 'faculty');

          return (
            <div
              key={msg.id}
              className={`flex items-end gap-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              {!isMe && (
                <img src={msg.senderAvatar} alt={msg.senderName} className="w-7 h-7 rounded-full object-cover border border-slate-600" />
              )}

              <div
                className={`max-w-xs sm:max-w-md p-4 rounded-2xl space-y-2 relative shadow-lg ${
                  isMe
                    ? 'bg-sky-600 text-white rounded-br-none'
                    : 'bg-slate-800 border border-slate-700 text-slate-100 rounded-bl-none'
                }`}
              >
                {!isMe && (
                  <p className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">{msg.senderName}</p>
                )}

                {/* Text Content */}
                <p className="text-xs leading-relaxed">{msg.text}</p>

                {/* Media Preview (Photo / Voice / Video) */}
                {msg.media?.type === 'image' && msg.media.url && (
                  <div className="mt-2 rounded-xl overflow-hidden border border-white/20">
                    <img src={msg.media.url} alt="Attached Photo" className="w-full max-h-48 object-cover" />
                  </div>
                )}

                {msg.media?.type === 'video' && msg.media.url && (
                  <div className="mt-2 rounded-xl overflow-hidden border border-white/20">
                    <video src={msg.media.url} controls className="w-full max-h-48 rounded-xl" />
                  </div>
                )}

                {msg.media?.type === 'voice' && (
                  <div className="mt-2 p-2.5 bg-black/20 rounded-xl flex items-center gap-3">
                    <button
                      onClick={() => setIsPlayingAudio(isPlayingAudio === msg.id ? null : msg.id)}
                      className="p-2 bg-sky-500 text-white rounded-full hover:bg-sky-400"
                    >
                      {isPlayingAudio === msg.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                    <div className="flex-1 space-y-1">
                      <div className="h-1 bg-white/30 rounded-full overflow-hidden">
                        <div className={`h-full bg-sky-300 ${isPlayingAudio === msg.id ? 'w-2/3 transition-all duration-1000' : 'w-0'}`}></div>
                      </div>
                      <span className="text-[10px] opacity-80 font-mono">🎙️ Voice Note ({msg.media.duration || '0:05'})</span>
                    </div>
                  </div>
                )}

                {/* Translated Text Banner */}
                {msg.translatedText && (
                  <div className="mt-2 p-2.5 bg-black/30 border border-sky-400/40 rounded-xl text-[11px] text-sky-200 space-y-1 animate-fade-in">
                    <div className="flex items-center gap-1 font-bold text-sky-300">
                      <Globe className="w-3.5 h-3.5" />
                      <span>Translated to {msg.targetLang?.toUpperCase()}</span>
                    </div>
                    <p className="italic">{msg.translatedText}</p>
                  </div>
                )}

                {/* Footer Controls (Timestamp + Translate Button) */}
                <div className="flex items-center justify-between pt-1 text-[10px] opacity-75 gap-3">
                  <button
                    onClick={() => handleTranslateMessage(msg.id, selectedLang)}
                    className="hover:underline flex items-center gap-1 font-bold text-sky-300 hover:text-white transition-colors"
                  >
                    <Globe className="w-3 h-3" /> Translate
                  </button>

                  <div className="flex items-center gap-1 font-mono">
                    <span>{msg.timestamp}</span>
                    {isMe && <CheckCheck className="w-3.5 h-3.5 text-sky-300" />}
                  </div>
                </div>

              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* MEDIA PREVIEW ATTACHMENT BAR */}
      {selectedMedia && (
        <div className="px-6 py-2 bg-slate-800 border-t border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-sky-400 font-bold">
            {selectedMedia.type === 'image' && <ImageIcon className="w-4 h-4" />}
            {selectedMedia.type === 'video' && <VideoIcon className="w-4 h-4" />}
            {selectedMedia.type === 'voice' && <Mic className="w-4 h-4" />}
            <span>Attached {selectedMedia.type.toUpperCase()} file ready to send</span>
          </div>
          <button onClick={() => setSelectedMedia(null)} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* INPUT FOOTER */}
      <form onSubmit={handleSendMessage} className="p-4 bg-slate-800 border-t border-slate-700 flex items-center gap-3">
        
        {/* Attachment Options */}
        <div className="flex items-center gap-1 text-slate-400">
          <label className="p-2 hover:bg-slate-700 hover:text-sky-400 rounded-xl cursor-pointer transition-colors" title="Attach Photo">
            <ImageIcon className="w-4 h-4" />
            <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'image')} className="hidden" />
          </label>

          <label className="p-2 hover:bg-slate-700 hover:text-sky-400 rounded-xl cursor-pointer transition-colors" title="Attach Video">
            <VideoIcon className="w-4 h-4" />
            <input type="file" accept="video/*" onChange={(e) => handleFileUpload(e, 'video')} className="hidden" />
          </label>

          {isRecording ? (
            <button
              type="button"
              onClick={stopRecording}
              className="p-2 bg-red-600 text-white rounded-xl animate-pulse font-bold text-xs flex items-center gap-1"
            >
              <Mic className="w-4 h-4" /> {recordingTime}s
            </button>
          ) : (
            <button
              type="button"
              onClick={startRecording}
              className="p-2 hover:bg-slate-700 hover:text-sky-400 rounded-xl transition-colors"
              title="Record Voice Note"
            >
              <Mic className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Message Input Box */}
        <input
          type="text"
          value={inputMsg}
          onChange={(e) => setInputMsg(e.target.value)}
          placeholder="Type WhatsApp-style message..."
          className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500 placeholder-slate-500"
        />

        {/* Send Button */}
        <button
          type="submit"
          className="p-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl shadow-md transition-all"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
};
