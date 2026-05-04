'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { IconSparkles, IconX, IconSearch } from '@/components/ui/Icons';

/* ── Types ────────────────────────────────────────────────────────── */
export interface ThreadMessage {
  id: number;
  role: 'user' | 'bot';
  text: string;
  time: string;
  canvasData?: unknown; // QueryContext or ReportData — stored opaquely
}

export interface ChatThread {
  id: string;
  title: string;
  messages: ThreadMessage[];
  createdAt: number;
  updatedAt: number;
  page: string; // 'ai-search' | 'agents' | 'ai-reports'
  agentId?: string; // for agents page — which agent
}

/* ── localStorage helpers ─────────────────────────────────────────── */
const STORAGE_KEY = 'ds-chat-threads';

function loadThreads(): ChatThread[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveThreads(threads: ChatThread[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(threads)); } catch {}
}

/* ── Date grouping ────────────────────────────────────────────────── */
function groupByDate(threads: ChatThread[]): { label: string; threads: ChatThread[] }[] {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const yesterday = today - 86400000;
  const week = today - 7 * 86400000;

  const groups: { label: string; threads: ChatThread[] }[] = [
    { label: 'Today', threads: [] },
    { label: 'Yesterday', threads: [] },
    { label: 'This Week', threads: [] },
    { label: 'Older', threads: [] },
  ];

  const sorted = [...threads].sort((a, b) => b.updatedAt - a.updatedAt);
  for (const t of sorted) {
    if (t.updatedAt >= today) groups[0].threads.push(t);
    else if (t.updatedAt >= yesterday) groups[1].threads.push(t);
    else if (t.updatedAt >= week) groups[2].threads.push(t);
    else groups[3].threads.push(t);
  }
  return groups.filter(g => g.threads.length > 0);
}

/* ── Hook: useThreads ─────────────────────────────────────────────── */
export function useThreads(page: string, agentId?: string) {
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Load on mount
  useEffect(() => {
    const all = loadThreads();
    const filtered = all.filter(t => t.page === page && (agentId ? t.agentId === agentId : true));
    setThreads(filtered);
  }, [page, agentId]);

  // Save whenever threads change
  useEffect(() => {
    if (threads.length === 0) return;
    const all = loadThreads();
    const others = all.filter(t => !(t.page === page && (agentId ? t.agentId === agentId : true)));
    saveThreads([...others, ...threads]);
  }, [threads, page, agentId]);

  const activeThread = threads.find(t => t.id === activeId) || null;

  const createThread = useCallback((firstMessage: string) => {
    const thread: ChatThread = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      title: firstMessage.slice(0, 50) + (firstMessage.length > 50 ? '...' : ''),
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      page,
      agentId,
    };
    setThreads(prev => [thread, ...prev]);
    setActiveId(thread.id);
    return thread.id;
  }, [page, agentId]);

  const addMessage = useCallback((threadId: string, msg: ThreadMessage) => {
    setThreads(prev => prev.map(t =>
      t.id === threadId
        ? { ...t, messages: [...t.messages, msg], updatedAt: Date.now() }
        : t
    ));
  }, []);

  const deleteThread = useCallback((threadId: string) => {
    setThreads(prev => prev.filter(t => t.id !== threadId));
    if (activeId === threadId) setActiveId(null);
  }, [activeId]);

  return { threads, activeThread, activeId, setActiveId, createThread, addMessage, deleteThread };
}

/* ── Sidebar Component ────────────────────────────────────────────── */
interface ChatThreadsSidebarProps {
  threads: ChatThread[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export function ChatThreadsSidebar({ threads, activeId, onSelect, onNew, onDelete, onClose }: ChatThreadsSidebarProps) {
  const [search, setSearch] = useState('');
  const filtered = search
    ? threads.filter(t => t.title.toLowerCase().includes(search.toLowerCase()))
    : threads;
  const groups = groupByDate(filtered);

  return (
    <div style={{
      width: 260, flexShrink: 0, background: '#FAFBFC', borderRight: '1px solid #E8ECF4',
      display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{ padding: '12px 14px', borderBottom: '1px solid #E8ECF4', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <button onClick={onNew} style={{
          flex: 1, padding: '8px 12px', borderRadius: 8, border: '1px solid #E2E8F0',
          background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
          fontSize: 13, fontWeight: 600, color: '#005C8D', transition: 'all .15s',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = '#E8F3F9'; e.currentTarget.style.borderColor = '#8FC2D8'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#E2E8F0'; }}
        >
          <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> New Chat
        </button>
        <button onClick={onClose} style={{
          width: 32, height: 32, borderRadius: 8, border: '1px solid #E2E8F0', background: '#fff',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <IconX size={14} color="#94A3B8"/>
        </button>
      </div>

      {/* Search */}
      <div style={{ padding: '8px 14px', flexShrink: 0 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px',
          background: '#fff', border: '1px solid #E2E8F0', borderRadius: 8,
        }}>
          <IconSearch size={12} color="#94A3B8"/>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search chats..."
            style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 12, color: '#334155', flex: 1 }}
          />
        </div>
      </div>

      {/* Thread list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 8px 12px' }}>
        {groups.length === 0 && (
          <div style={{ padding: '24px 14px', textAlign: 'center', color: '#94A3B8', fontSize: 12 }}>
            No conversations yet
          </div>
        )}
        {groups.map(g => (
          <div key={g.label}>
            <div style={{ padding: '10px 8px 4px', fontSize: 10, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '.05em' }}>
              {g.label}
            </div>
            {g.threads.map(t => {
              const active = t.id === activeId;
              return (
                <div
                  key={t.id}
                  onClick={() => onSelect(t.id)}
                  style={{
                    padding: '8px 10px', borderRadius: 8, cursor: 'pointer',
                    background: active ? '#E8F3F9' : 'transparent',
                    border: active ? '1px solid #C6E0EC' : '1px solid transparent',
                    marginBottom: 2, display: 'flex', alignItems: 'center', gap: 8,
                    transition: 'all .12s',
                  }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.background = '#F8FAFC'; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                >
                  <IconSparkles size={12} color={active ? '#005C8D' : '#CBD5E1'}/>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 12, fontWeight: active ? 600 : 500,
                      color: active ? '#1E293B' : '#475569',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                      {t.title}
                    </div>
                    <div style={{ fontSize: 10, color: '#94A3B8', marginTop: 1 }}>
                      {t.messages.length} messages
                    </div>
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); onDelete(t.id); }}
                    style={{
                      width: 20, height: 20, borderRadius: 4, border: 'none', background: 'transparent',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      opacity: 0.4, transition: 'opacity .12s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.opacity = '1'; }}
                    onMouseLeave={e => { e.currentTarget.style.opacity = '0.4'; }}
                  >
                    <IconX size={10} color="#94A3B8"/>
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
