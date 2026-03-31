'use client';
import React, { useState, useRef, useEffect } from 'react';
import { IconSparkles, IconSend, IconUser, IconExternalLink } from '@/components/ui/Icons';

interface Message {
  id: number;
  role: 'bot' | 'user';
  text: string;
  time: string;
  queryId?: number; // links bot responses to a query for "Open in Canvas"
}

interface AgentChatProps {
  agentName: string;
  agentId: string;
  gradient: string;
  icon?: React.ReactNode;
  suggestions: string[];
  welcomeMessage: string;
  getBotReply?: (userMsg: string) => string;
  hideHeader?: boolean;
  fluid?: boolean;
  /** Called when user clicks "Open in Canvas" on a bot result */
  onOpenCanvas?: (queryId: number, queryText: string) => void;
}

function timeNow() {
  const d = new Date();
  const h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, '0');
  return `${h % 12 || 12}:${m} ${h >= 12 ? 'PM' : 'AM'}`;
}

const DEFAULT_REPLY = (msg: string) =>
  `Analyzed 68,247 pharmacy records across 50 states.\nFound 247 matching results for: "${msg.slice(0, 60)}${msg.length > 60 ? '...' : ''}"`;

export function AgentChat({
  agentName, agentId, gradient, icon, suggestions, welcomeMessage,
  getBotReply = DEFAULT_REPLY, hideHeader, fluid, onOpenCanvas,
}: AgentChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: 'bot', text: welcomeMessage, time: timeNow() },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const queryCounter = useRef(0);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  function send(text: string) {
    if (!text.trim() || typing) return;
    queryCounter.current += 1;
    const qId = queryCounter.current;
    setMessages(m => [...m, { id: Date.now(), role: 'user', text, time: timeNow() }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(m => [...m, {
        id: Date.now() + 1, role: 'bot', text: getBotReply(text), time: timeNow(), queryId: qId,
      }]);
      // Auto-open canvas on first query
      if (onOpenCanvas && qId === 1) {
        setTimeout(() => onOpenCanvas(qId, text), 100);
      }
    }, 1200 + Math.random() * 800);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  }

  const maxW = 720;

  return (
    <div style={{
      width: fluid ? undefined : 360,
      flex: fluid ? 1 : undefined,
      borderLeft: fluid ? 'none' : '1px solid #E2E8F0',
      background: '#fff',
      display: 'flex', flexDirection: 'column', flexShrink: 0,
      height: '100%', minHeight: 0, overflow: 'hidden',
    }}>

      {/* Header */}
      {!hideHeader && (
        <div style={{
          padding: '14px 16px', borderBottom: '1px solid #E2E8F0',
          display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, background: gradient,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            {icon || <IconSparkles size={18} color="#fff"/>}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#1E293B' }}>{agentName}</div>
            <div style={{ fontSize: 11, color: '#10B981', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', display: 'inline-block' }}/>
              {agentId} · Online
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ width: '100%', maxWidth: maxW, margin: '0 auto', padding: '20px 24px 12px', display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
          {messages.map(m => (
            <div key={m.id} style={{
              display: 'flex', gap: 8,
              flexDirection: m.role === 'user' ? 'row-reverse' : 'row',
              alignItems: 'flex-start',
            }}>
              {/* Avatar */}
              <div style={{
                width: 26, height: 26, borderRadius: 8, flexShrink: 0, marginTop: 2,
                background: m.role === 'bot' ? gradient : '#4F46E5',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {m.role === 'bot'
                  ? (icon ? <span style={{ display: 'flex' }}>{icon}</span> : <IconSparkles size={14} color="#fff"/>)
                  : <IconUser size={13} color="#fff"/>
                }
              </div>
              {/* Bubble + canvas card */}
              <div style={{ maxWidth: '80%', display: 'flex', flexDirection: 'column', alignItems: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  padding: '9px 13px',
                  borderRadius: m.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                  background: m.role === 'user' ? '#4F46E5' : '#F3F4F6',
                  color: m.role === 'user' ? '#fff' : '#1F2937',
                  fontSize: 13, lineHeight: 1.55,
                }}>
                  {m.text.split('\n').map((line, i) => (
                    <div key={i} style={{ minHeight: line ? undefined : 6 }}>{line}</div>
                  ))}
                </div>
                {/* Canvas card for bot query responses */}
                {m.role === 'bot' && m.queryId && onOpenCanvas && (
                  <button
                    onClick={() => onOpenCanvas(m.queryId!, m.text)}
                    style={{
                      marginTop: 5, padding: '6px 12px',
                      borderRadius: 8, background: '#EEF2FF', border: '1px solid #C7D2FE',
                      display: 'inline-flex', alignItems: 'center', gap: 8,
                      cursor: 'pointer', transition: 'background .12s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#E0E7FF')}
                    onMouseLeave={e => (e.currentTarget.style.background = '#EEF2FF')}
                  >
                    <IconSparkles size={13} color="#4F46E5"/>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#4F46E5' }}>247 results</span>
                    <span style={{ fontSize: 11, color: '#818CF8' }}>Open in Canvas</span>
                    <IconExternalLink size={10} color="#818CF8"/>
                  </button>
                )}
                <div style={{ fontSize: 10, color: '#D1D5DB', marginTop: 3, paddingLeft: 2 }}>{m.time}</div>
              </div>
            </div>
          ))}

          {typing && (
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <div style={{
                width: 26, height: 26, borderRadius: 8, flexShrink: 0, marginTop: 2,
                background: gradient, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <IconSparkles size={14} color="#fff"/>
              </div>
              <div style={{
                padding: '10px 14px', background: '#F3F4F6',
                borderRadius: '12px 12px 12px 2px', display: 'flex', gap: 4,
              }}>
                {[0, 1, 2].map(i => (
                  <span key={i} style={{
                    width: 6, height: 6, borderRadius: '50%', background: '#9CA3AF',
                    display: 'inline-block', animation: `agentBounce 1s ${i * 0.15}s infinite`,
                  }}/>
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef}/>
        </div>
      </div>

      {/* Suggestions */}
      {messages.length <= 2 && !typing && (
        <div style={{ width: '100%', maxWidth: maxW, margin: '0 auto', padding: '0 24px 10px', display: 'flex', flexDirection: 'column', gap: 4, flexShrink: 0 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 2 }}>
            Suggested
          </div>
          {suggestions.map(s => (
            <button
              key={s}
              onClick={() => send(s)}
              style={{
                padding: '7px 12px', borderRadius: 8, border: '1px solid #E5E7EB',
                background: '#FAFBFC', color: '#374151', fontSize: 12.5, cursor: 'pointer',
                textAlign: 'left', transition: 'border-color .15s, background .15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#C7D2FE'; e.currentTarget.style.background = '#EEF2FF'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.background = '#FAFBFC'; }}
            >{s}</button>
          ))}
        </div>
      )}

      {/* Textarea input */}
      <div style={{ borderTop: '1px solid #E5E7EB', flexShrink: 0, background: '#FAFBFC' }}>
        <div style={{ width: '100%', maxWidth: maxW, margin: '0 auto', padding: '14px 24px', display: 'flex', gap: 10, alignItems: 'flex-end' }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Ask ${agentName}...`}
            rows={1}
            style={{
              flex: 1, padding: '10px 14px', borderRadius: 10,
              border: '1px solid #E5E7EB', fontSize: 13, outline: 'none',
              background: '#fff', color: '#1E293B', resize: 'none',
              fontFamily: 'inherit', lineHeight: 1.5,
              minHeight: 42, maxHeight: 120,
            }}
            onInput={e => {
              const el = e.currentTarget;
              el.style.height = 'auto';
              el.style.height = Math.min(el.scrollHeight, 120) + 'px';
            }}
          />
          <button
            onClick={() => send(input)}
            disabled={!input.trim() || typing}
            style={{
              width: 42, height: 42, borderRadius: 10, border: 'none',
              background: input.trim() && !typing ? '#4F46E5' : '#E5E7EB',
              cursor: input.trim() && !typing ? 'pointer' : 'default',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background .15s', flexShrink: 0,
            }}
          >
            <IconSend size={16} color={input.trim() && !typing ? '#fff' : '#9CA3AF'}/>
          </button>
        </div>
      </div>

      <style>{`@keyframes agentBounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }`}</style>
    </div>
  );
}
