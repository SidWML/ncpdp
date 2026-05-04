'use client';
import React, { useState, useRef, useEffect } from 'react';
import { IconSparkles, IconSend, IconUser, IconExternalLink, IconAlertTriangle, IconBarChart, IconSearch, IconShield } from '@/components/ui/Icons';

interface Message {
  id: number;
  role: 'bot' | 'user';
  text: string;
  time: string;
  queryId?: number;
  insights?: Insight[];
  followUps?: string[];
  canvasLabel?: string;
  canvasData?: unknown;
}

interface Insight {
  icon: 'warning' | 'info' | 'location' | 'stat';
  text: string;
  color: string;
}

interface AgentChatProps {
  agentName: string;
  agentId: string;
  gradient: string;
  icon?: React.ReactNode;
  suggestions: string[];
  welcomeMessage: string;
  getBotReply?: (userMsg: string) => string | Promise<string>;
  getInsights?: (userMsg: string) => Insight[];
  getFollowUps?: (userMsg: string) => string[];
  getCanvasLabel?: (userMsg: string) => string;
  onBotReplied?: (userMsg: string) => { insights?: Insight[]; followUps?: string[]; canvasLabel?: string; canvasData?: unknown } | void;
  /** Controlled messages — when provided, AgentChat uses these instead of internal state */
  messages?: Message[];
  onMessagesChange?: (msgs: Message[]) => void;
  hideHeader?: boolean;
  fluid?: boolean;
  onOpenCanvas?: (queryId: number, queryText: string, canvasData?: unknown) => void;
}

export type { Message as ChatMessage };

/* Parse **bold** markdown into React nodes */
function parseBold(text: string): React.ReactNode {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={i} style={{ fontWeight: 700 }}>{part.slice(2, -2)}</strong>
      : part
  );
}

function timeNow() {
  const d = new Date();
  const h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, '0');
  return `${h % 12 || 12}:${m} ${h >= 12 ? 'PM' : 'AM'}`;
}

const DEFAULT_REPLY = (msg: string) =>
  `Analyzed 81,500 pharmacy records across 50 states.\nFound 247 matching results for: "${msg.slice(0, 60)}${msg.length > 60 ? '...' : ''}"`;

const DEFAULT_INSIGHTS = (_msg: string): Insight[] => [
  { icon: 'warning', text: '2 pharmacies have expired DEA licenses', color: '#DC2626' },
  { icon: 'location', text: 'Most results concentrated in Texas region', color: '#005C8D' },
  { icon: 'stat', text: '88% of matched pharmacies are currently active', color: '#449055' },
];

const DEFAULT_FOLLOWUPS = (_msg: string): string[] => [
  'Filter to active only',
  'Show expired DEA',
  'View compliance report',
  'Compare by state',
];

const insightIcons: Record<string, React.ReactNode> = {
  warning: <IconAlertTriangle size={13} color="#DC2626"/>,
  info: <IconSparkles size={13} color="#005C8D"/>,
  location: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#005C8D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  stat: <IconBarChart size={13} color="#449055"/>,
};

const DEFAULT_CANVAS_LABEL = (_msg: string) => '247 results';

export function AgentChat({
  agentName, agentId, gradient, icon, suggestions, welcomeMessage,
  getBotReply = DEFAULT_REPLY,
  getInsights = DEFAULT_INSIGHTS,
  getFollowUps = DEFAULT_FOLLOWUPS,
  getCanvasLabel = DEFAULT_CANVAS_LABEL,
  onBotReplied,
  messages: controlledMessages,
  onMessagesChange,
  hideHeader, fluid, onOpenCanvas,
}: AgentChatProps) {
  const welcomeMsg: Message = { id: 1, role: 'bot', text: welcomeMessage, time: timeNow() };
  const [internalMessages, setInternalMessages] = useState<Message[]>([welcomeMsg]);
  const isControlled = controlledMessages !== undefined && onMessagesChange !== undefined;
  // When controlled but empty, show welcome message visually but don't persist it
  const messages = isControlled
    ? (controlledMessages!.length > 0 ? controlledMessages! : [welcomeMsg])
    : internalMessages;
  const setMessages = isControlled
    ? (updater: Message[] | ((prev: Message[]) => Message[])) => {
        const current = controlledMessages!.length > 0 ? controlledMessages! : [welcomeMsg];
        const next = typeof updater === 'function' ? updater(current) : updater;
        onMessagesChange!(next);
      }
    : setInternalMessages;
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [activeMode, setActiveMode] = useState<'ask' | 'analyze' | 'compare'>('ask');
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

    const replyResult = getBotReply(text);
    const isAsync = replyResult instanceof Promise;

    if (isAsync) {
      (replyResult as Promise<string>).then(replyText => {
        setTyping(false);
        const overrides = onBotReplied?.(text);
        const insights = overrides?.insights ?? getInsights(text);
        const followUps = overrides?.followUps ?? getFollowUps(text);
        const canvasLabel = overrides?.canvasLabel ?? getCanvasLabel(text);
        const canvasData = overrides?.canvasData ?? undefined;
        setMessages(m => [...m, {
          id: Date.now() + 1, role: 'bot', text: replyText, time: timeNow(), queryId: qId,
          insights, followUps, canvasLabel, canvasData,
        }]);
        if (onOpenCanvas && qId === 1) {
          setTimeout(() => onOpenCanvas(qId, text, undefined), 100);
        }
      });
    } else {
      setTimeout(() => {
        setTyping(false);
        const insights = getInsights(text);
        const followUps = getFollowUps(text);
        const canvasLabel = getCanvasLabel(text);
        setMessages(m => [...m, {
          id: Date.now() + 1, role: 'bot', text: replyResult as string, time: timeNow(), queryId: qId,
          insights, followUps, canvasLabel,
        }]);
        if (onOpenCanvas && qId === 1) {
          setTimeout(() => onOpenCanvas(qId, text, undefined), 100);
        }
      }, 1200 + Math.random() * 800);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  }

  const maxW = 720;
  const modes = [
    { id: 'ask' as const, label: 'Ask', icon: <IconSearch size={11}/> },
    { id: 'analyze' as const, label: 'Analyze', icon: <IconBarChart size={11}/> },
    { id: 'compare' as const, label: 'Compare', icon: <IconShield size={11}/> },
  ];

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
            <div style={{ fontSize: 11, color: '#76C799', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#76C799', display: 'inline-block' }}/>
              {agentId} · Online
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ width: '100%', maxWidth: maxW, margin: '0 auto', padding: '20px 24px 12px', display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
          {messages.map(m => (
            <div key={m.id}>
              <div style={{
                display: 'flex', gap: 8,
                flexDirection: m.role === 'user' ? 'row-reverse' : 'row',
                alignItems: 'flex-start',
              }}>
                {/* Avatar */}
                <div style={{
                  width: 26, height: 26, borderRadius: 8, flexShrink: 0, marginTop: 2,
                  background: m.role === 'bot' ? gradient : '#005C8D',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {m.role === 'bot'
                    ? (icon ? <span style={{ display: 'flex' }}>{icon}</span> : <IconSparkles size={14} color="#fff"/>)
                    : <IconUser size={13} color="#fff"/>
                  }
                </div>
                {/* Bubble */}
                <div style={{ maxWidth: '80%', display: 'flex', flexDirection: 'column', alignItems: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    padding: m.role === 'bot' && m.queryId ? '12px 16px' : '9px 13px',
                    borderRadius: m.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                    background: m.role === 'user' ? '#005C8D' : m.queryId ? '#FAFBFC' : '#F3F4F6',
                    color: m.role === 'user' ? '#fff' : '#1F2937',
                    fontSize: 13, lineHeight: 1.55,
                    border: m.role === 'bot' && m.queryId ? '1px solid #E5E7EB' : 'none',
                    boxShadow: m.role === 'bot' && m.queryId ? '0 2px 8px rgba(0,0,0,0.04)' : 'none',
                  }}>
                    {m.text.split('\n').map((line, i) => (
                      <div key={i} style={{ minHeight: line ? undefined : 6 }}>{parseBold(line)}</div>
                    ))}
                  </div>

                  {/* AI Insights — below bot response with queryId */}
                  {m.role === 'bot' && m.insights && m.insights.length > 0 && (
                    <div style={{
                      marginTop: 8, padding: '10px 14px', borderRadius: 10,
                      background: 'linear-gradient(135deg, #FAFBFC 0%, #E8F3F9 100%)',
                      border: '1px solid #E8EFF8',
                      display: 'flex', flexDirection: 'column', gap: 6,
                      maxWidth: '100%',
                    }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '.06em', display: 'flex', alignItems: 'center', gap: 5 }}>
                        <IconSparkles size={10} color="#94A3B8"/> AI Insights
                      </div>
                      {m.insights.map((ins, i) => (
                        <div key={i} style={{
                          display: 'flex', alignItems: 'center', gap: 8,
                          fontSize: 12, color: '#374151', lineHeight: 1.4,
                        }}>
                          <span style={{
                            width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                            background: `${ins.color}12`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            {insightIcons[ins.icon]}
                          </span>
                          <span>{parseBold(ins.text)}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Canvas card for bot query responses */}
                  {m.role === 'bot' && m.queryId && onOpenCanvas && (
                    <button
                      onClick={() => onOpenCanvas(m.queryId!, m.text, m.canvasData)}
                      style={{
                        marginTop: 6, padding: '6px 12px',
                        borderRadius: 8, background: '#E8F3F9', border: '1px solid #8FC2D8',
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        cursor: 'pointer', transition: 'background .12s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#C6E0EC')}
                      onMouseLeave={e => (e.currentTarget.style.background = '#E8F3F9')}
                    >
                      <IconSparkles size={13} color="#005C8D"/>
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#005C8D' }}>{parseBold(m.canvasLabel || '247 results')}</span>
                      <span style={{ fontSize: 11, color: '#2D8AB5' }}>Open in Canvas</span>
                      <IconExternalLink size={10} color="#2D8AB5"/>
                    </button>
                  )}

                  {/* Follow-up action chips */}
                  {m.role === 'bot' && m.followUps && m.followUps.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                      {m.followUps.map((fu, i) => (
                        <button
                          key={i}
                          onClick={() => send(fu)}
                          style={{
                            padding: '5px 12px', borderRadius: 20, fontSize: 11.5, fontWeight: 500,
                            border: '1px solid #E2E8F0', background: '#fff', color: '#475569',
                            cursor: 'pointer', transition: 'all .15s',
                            display: 'flex', alignItems: 'center', gap: 4,
                          }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = '#005C8D'; e.currentTarget.style.color = '#005C8D'; e.currentTarget.style.background = '#E8F3F9'; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.color = '#475569'; e.currentTarget.style.background = '#fff'; }}
                        >
                          {fu}
                        </button>
                      ))}
                    </div>
                  )}

                  <div style={{ fontSize: 10, color: '#D1D5DB', marginTop: 3, paddingLeft: 2 }}>{m.time}</div>
                </div>
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
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
                <div style={{ fontSize: 10, color: '#CBD5E1', paddingLeft: 2 }}>
                  Analyzing records...
                </div>
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
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#8FC2D8'; e.currentTarget.style.background = '#E8F3F9'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.background = '#FAFBFC'; }}
            >{s}</button>
          ))}
        </div>
      )}

      {/* Enhanced input area */}
      <div style={{ borderTop: '1px solid #E5E7EB', flexShrink: 0, background: '#FAFBFC' }}>
        {/* Mode chips */}
        <div style={{ width: '100%', maxWidth: maxW, margin: '0 auto', padding: '10px 24px 0', display: 'flex', gap: 6, alignItems: 'center' }}>
          {modes.map(mode => (
            <button
              key={mode.id}
              onClick={() => setActiveMode(mode.id)}
              style={{
                padding: '3px 10px', borderRadius: 12, fontSize: 11, fontWeight: 500,
                border: '1px solid',
                borderColor: activeMode === mode.id ? '#005C8D' : '#E5E7EB',
                background: activeMode === mode.id ? '#E8F3F9' : '#fff',
                color: activeMode === mode.id ? '#005C8D' : '#94A3B8',
                cursor: 'pointer', transition: 'all .15s',
                display: 'flex', alignItems: 'center', gap: 4,
              }}
            >
              {mode.icon} {mode.label}
            </button>
          ))}
          <span style={{ marginLeft: 'auto', fontSize: 10, color: '#CBD5E1' }}>
            Shift+Enter for new line
          </span>
        </div>
        <div style={{ width: '100%', maxWidth: maxW, margin: '0 auto', padding: '8px 24px 14px', display: 'flex', gap: 10, alignItems: 'flex-end' }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              activeMode === 'ask' ? `Ask ${agentName} anything...` :
              activeMode === 'analyze' ? `Describe what to analyze...` :
              `What would you like to compare?`
            }
            rows={1}
            style={{
              flex: 1, padding: '10px 14px', borderRadius: 10,
              border: '1.5px solid #E5E7EB', fontSize: 13, outline: 'none',
              background: '#fff', color: '#1E293B', resize: 'none',
              fontFamily: 'inherit', lineHeight: 1.5,
              minHeight: 42, maxHeight: 120,
              transition: 'border-color .15s, box-shadow .15s',
            }}
            onFocus={e => { e.currentTarget.style.borderColor = '#005C8D'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,92,141,0.1)'; }}
            onBlur={e => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.boxShadow = 'none'; }}
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
              background: input.trim() && !typing ? 'linear-gradient(135deg, #005C8D, #2D8AB5)' : '#E5E7EB',
              cursor: input.trim() && !typing ? 'pointer' : 'default',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all .15s', flexShrink: 0,
              boxShadow: input.trim() && !typing ? '0 2px 8px rgba(0,92,141,0.3)' : 'none',
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
