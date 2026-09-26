'use client';

import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

function ApexAvatar() {
  return (
    <svg viewBox="0 0 64 64" className="h-full w-full drop-shadow-[0_0_12px_rgba(103,232,249,0.35)]" aria-hidden="true">
      <defs>
        <linearGradient id="plateGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1c2f3a" />
          <stop offset="100%" stopColor="#081119" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="64" height="64" rx="18" fill="rgba(9, 16, 21, 0.7)" stroke="rgba(103, 232, 249, 0.74)" strokeWidth="0.7" />

      <path d="M13 20H51V24H13V20Z" fill="rgba(103,232,249,0.15)" stroke="rgba(103,232,249,0.7)" strokeWidth="0.9" />
      <path d="M13 40H51V44H13V40Z" fill="rgba(103,232,249,0.15)" stroke="rgba(103,232,249,0.7)" strokeWidth="0.9" />

      <rect x="16" y="18" width="5" height="28" rx="2.2" fill="rgba(17, 25, 32, 0.9)" stroke="rgba(103,232,249,0.7)" strokeWidth="0.9" />
      <rect x="43" y="18" width="5" height="28" rx="2.2" fill="rgba(17, 25, 32, 0.9)" stroke="rgba(103,232,249,0.7)" strokeWidth="0.9" />

      <ellipse cx="32" cy="32" rx="14" ry="15" fill="url(#plateGlow)" stroke="rgba(103,232,249,0.9)" strokeWidth="1.1" />
      <ellipse cx="32" cy="32" rx="8.5" ry="9.2" fill="rgba(7, 14, 19, 0.82)" stroke="rgba(103,232,249,0.75)" strokeWidth="0.9" />

      <path d="M22 32H42" stroke="rgba(103,232,249,0.65)" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'model',
      content: 'I am Apex. Your coach, your judge, and your accountability. I do not tolerate excuses. State your objective. Are you here to build muscle or waste my time? Drop your stats, your split, and what you want to achieve.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorBanner, setErrorBanner] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const quickPrompts = [
    'Roast my workout split',
    'What are my daily protein requirements?',
    'Leg day motivation',
    'How to fix a bench press plateau',
  ];

  const sendMessage = async (textToSend) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    const userMessage = { role: 'user', content: text };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);
    setErrorBanner('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        const serverError = data?.error || 'Apex says: the system is offline. Try again in a moment.';
        setErrorBanner(serverError);
        setMessages((prev) => [...prev, { role: 'model', content: serverError }]);
        return;
      }

      setMessages((prev) => [...prev, { role: 'model', content: data.reply }]);
    } catch (err) {
      const fallback = 'SYSTEM ERROR: Your connection is as weak as your squat depth. Fix it.';
      setErrorBanner(fallback);
      setMessages((prev) => [...prev, { role: 'model', content: fallback }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-[#050b14] text-slate-50">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-8%] top-[-6%] h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute right-[-5%] top-20 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />
      </div>

      <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/50 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/40 bg-slate-900/80 shadow-[0_0_30px_rgba(103,232,249,0.18)]"
            >
              <span className="text-lg font-black tracking-[-0.12em] text-cyan-300" style={{ textShadow: '0 0 14px rgba(103, 232, 249, 0.9)' }}>
                R
              </span>
              <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-slate-950 bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,1)]" />
            </motion.div>

            <div>
              <div className="flex items-center gap-3">
                <motion.h1
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  className="text-lg font-black tracking-[0.22em] text-white sm:text-xl"
                >
                  RITUAL<span className="bg-gradient-to-r from-cyan-300 via-sky-300 to-violet-400 bg-clip-text text-transparent">.AI</span>
                </motion.h1>

                <motion.span
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="rounded-full border border-violet-400/40 bg-violet-500/10 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-violet-200"
                >
                  Coach Apex
                </motion.span>
              </div>
              <p className="text-[10px] uppercase tracking-[0.26em] text-slate-400">
                Obsession • Discipline • Hypertrophy
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1.5 sm:flex">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(74,222,128,1)] animate-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-[0.26em] text-emerald-200">
              Online
            </span>
          </div>
        </div>
      </header>

      {errorBanner && (
        <div className="mx-auto mt-6 w-full max-w-5xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-violet-400/40 bg-violet-500/10 px-4 py-3 text-sm text-violet-100 shadow-[0_0_25px_rgba(139,92,246,0.18)]"
          >
            {errorBanner}
          </motion.div>
        </div>
      )}

      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-6 sm:px-6">
        <div className="flex-1 overflow-y-auto rounded-[28px] border border-white/8 bg-slate-950/30 p-3 shadow-[0_30px_80px_rgba(15,23,42,0.45)] backdrop-blur-md sm:p-5">
          <div className="space-y-5">
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18, delay: index * 0.02 }}
                className={`flex items-end gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'model' && (
                  <div className="flex h-10 w-10 shrink-0 overflow-hidden rounded-[14px] border border-cyan-400/40 bg-gradient-to-br from-[#0d1d2b] via-[#0b1723] to-[#101827] shadow-[0_0_20px_rgba(103,232,249,0.1)]">
                    <ApexAvatar />
                  </div>
                )}

                <div
                  className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed sm:text-[15px] ${
                    msg.role === 'user'
                      ? 'rounded-br-md bg-gradient-to-r from-violet-500 to-cyan-500 text-white shadow-[0_12px_30px_rgba(139,92,246,0.35)]'
                      : 'rounded-bl-md border border-white/10 bg-slate-900/80 text-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.35)]'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                </div>
              </motion.div>
            ))}

            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-end gap-3"
              >
                <div className="flex h-10 w-10 shrink-0 overflow-hidden rounded-[14px] border border-cyan-400/40 bg-gradient-to-br from-[#0d1d2b] via-[#0b1723] to-[#101827] shadow-[0_0_20px_rgba(103,232,249,0.1)]">
                  <ApexAvatar />
                </div>

                <div className="rounded-2xl rounded-bl-md border border-white/10 bg-slate-900/80 px-4 py-3 shadow-[0_12px_30px_rgba(15,23,42,0.35)]">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-cyan-300 animate-pulse">
                      Apex is judging your form...
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-cyan-300 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="h-2 w-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="h-2 w-2 rounded-full bg-cyan-300 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {quickPrompts.map((prompt, i) => (
            <motion.button
              key={i}
              type="button"
              whileHover={{ y: -2, boxShadow: '0 0 25px rgba(103, 232, 249, 0.18)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => sendMessage(prompt)}
              disabled={loading}
              className="whitespace-nowrap rounded-full border border-white/10 bg-slate-900/70 px-3.5 py-2 text-[11px] font-medium text-slate-200 transition-all duration-200 hover:border-cyan-400/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              ⚡ {prompt}
            </motion.button>
          ))}
        </div>

        <div className="mt-4 rounded-[28px] border border-white/10 bg-slate-950/50 p-3 shadow-[0_20px_60px_rgba(15,23,42,0.45)] backdrop-blur-xl sm:p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="mx-auto flex flex-col gap-3 sm:flex-row"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Report your workout or ask a lifting question..."
              disabled={loading}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
            />

            <motion.button
              type="submit"
              whileHover={{ y: -1, boxShadow: '0 0 28px rgba(139, 92, 246, 0.35)' }}
              whileTap={{ scale: 0.98 }}
              disabled={loading || !input.trim()}
              className="rounded-2xl bg-gradient-to-r from-violet-500 via-violet-500 to-cyan-500 px-5 py-3.5 text-[11px] font-black uppercase tracking-[0.22em] text-white shadow-[0_16px_30px_rgba(139,92,246,0.35)] transition-all duration-200 disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-500 disabled:shadow-none"
            >
              Execute
            </motion.button>
          </form>
        </div>
      </div>
    </main>
  );
}