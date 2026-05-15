'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useEffect, useRef, useState, ReactNode } from 'react';

const transport = new DefaultChatTransport({ api: '/api/chat' });

function renderMarkdownLinks(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const href = match[2].startsWith('http') ? match[2] : match[2].startsWith('/') ? match[2] : `/${match[2]}`;
    parts.push(
      <a key={match.index} href={href} className="text-gold underline underline-offset-2 hover:text-gold-light transition-colors" target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}>
        {match[1]}
      </a>
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}

const TEASER_KEY = 'gr-sage-teaser-dismissed-v1';

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [teaserVisible, setTeaserVisible] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [input, setInput] = useState('');

  const { messages, sendMessage, status, error } = useChat({ transport });

  const isLoading = status === 'submitted' || status === 'streaming';

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus input when panel opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  // Show teaser once per session, ~18s after landing, only if chat isn't open
  useEffect(() => {
    try {
      if (sessionStorage.getItem(TEASER_KEY) === '1') return;
    } catch {}
    const timer = setTimeout(() => {
      if (!open) setTeaserVisible(true);
    }, 45000);
    return () => clearTimeout(timer);
  }, [open]);

  function dismissTeaser() {
    setTeaserVisible(false);
    try { sessionStorage.setItem(TEASER_KEY, '1'); } catch {}
  }

  function openChatFromTeaser() {
    dismissTeaser();
    setOpen(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    sendMessage({ text: trimmed });
    setInput('');
  }

  return (
    <>
      {/* Teaser bubble — appears once per session, above the chat icon */}
      {!open && teaserVisible && (
        <div className="fixed bottom-[7.5rem] right-4 sm:bottom-24 sm:right-6 z-30 max-w-[260px] animate-[fadeIn_0.4s_ease-out]">
          <button
            onClick={dismissTeaser}
            aria-label="Dismiss"
            className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-obsidian-light border border-white/10 text-cream-dim hover:text-cream hover:border-white/30 transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <button
            onClick={openChatFromTeaser}
            className="block text-left rounded-2xl rounded-br-sm bg-obsidian-mid border border-emerald/30 px-4 py-3 shadow-lg shadow-black/40 hover:border-emerald/60 transition-colors"
          >
            <p className="font-jetbrains text-[10px] uppercase tracking-wider text-emerald-light mb-1">
              Sage · Peptide Concierge
            </p>
            <p className="font-dm-sans text-sm text-cream leading-snug">
              Have a question? I&apos;m Sage — ask me anything about peptides.
            </p>
          </button>
        </div>
      )}

      {/* Chat bubble button */}
      {!open && (
        <button
          onClick={() => { dismissTeaser(); setOpen(true); }}
          aria-label="Open chat"
          className="fixed bottom-24 right-4 sm:bottom-6 sm:right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-emerald shadow-lg shadow-emerald/30 transition-transform hover:scale-105 active:scale-95"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-0 right-0 z-50 flex h-[100dvh] w-full flex-col border border-blue/20 bg-obsidian-mid sm:bottom-6 sm:right-6 sm:h-[500px] sm:w-[380px] sm:rounded">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-blue/10 bg-obsidian px-4 py-3 sm:rounded-t">
            <div>
              <h3 className="font-cormorant text-base font-semibold text-white">
                Sage
              </h3>
              <p className="font-jetbrains text-[10px] uppercase tracking-wider text-emerald-light">
                Peptide Concierge
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="flex h-8 w-8 items-center justify-center text-cream-dim transition-colors hover:text-white"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {messages.length === 0 && (
              <div className="flex h-full items-center justify-center px-4">
                <p className="text-center font-dm-sans text-sm text-cream-dim/70 leading-relaxed">
                  Hi, I&apos;m Sage. Ask me about peptides, products, pricing, or
                  what to read first.
                </p>
              </div>
            )}
            {messages.map((message) => {
              const isUser = message.role === 'user';
              return (
                <div
                  key={message.id}
                  className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] px-3 py-2 font-dm-sans text-sm leading-relaxed ${
                      isUser
                        ? 'bg-emerald/20 text-cream'
                        : 'bg-obsidian-light text-cream-dim'
                    }`}
                  >
                    {message.parts.map((part, i) =>
                      part.type === 'text' ? (
                        <span key={i} className="whitespace-pre-wrap">
                          {isUser ? part.text : renderMarkdownLinks(part.text)}
                        </span>
                      ) : null,
                    )}
                  </div>
                </div>
              );
            })}
            {isLoading && messages[messages.length - 1]?.role === 'user' && (
              <div className="flex justify-start">
                <div className="bg-obsidian-light px-3 py-2 text-cream-dim">
                  <span className="inline-flex gap-1 font-jetbrains text-xs">
                    <span className="animate-pulse">.</span>
                    <span className="animate-pulse" style={{ animationDelay: '0.2s' }}>.</span>
                    <span className="animate-pulse" style={{ animationDelay: '0.4s' }}>.</span>
                  </span>
                </div>
              </div>
            )}
            {error && (
              <div className="px-3 py-2 font-dm-sans text-xs text-error">
                Something went wrong. Please try again.
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="border-t border-blue/10 bg-obsidian px-3 py-3 sm:rounded-b"
          >
            <div className="relative">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Sage about peptides..."
                disabled={isLoading}
                className="w-full bg-obsidian-light border border-blue/20 pl-3 pr-12 py-2.5 font-jetbrains text-base sm:text-sm text-cream placeholder:text-cream-dim/40 outline-none transition-colors focus:border-emerald/50 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                aria-label="Send message"
                className="absolute right-1 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center text-emerald-light transition-colors hover:text-emerald disabled:opacity-30"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="none"
                >
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
