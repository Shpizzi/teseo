import { useState } from 'react'
import { Send } from 'lucide-react'
import GlassCard from '../../components/GlassCard'
import { conversations, chatMessages } from '../../mock/user-pages'

export default function Messaggi() {
  const [activeConv, setActiveConv] = useState(conversations[0].id)
  const [inputText, setInputText] = useState('')

  const currentConv = conversations.find(c => c.id === activeConv)!
  const messages = chatMessages.filter(m => m.conversationId === activeConv)

  return (
    <>
      {/* Topbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: '0 0 auto' }}>
        <div>
          <h1 style={{ fontWeight: 600, fontSize: 25, letterSpacing: '-0.01em', color: 'var(--ink)' }}>
            Messaggi
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: 12, marginTop: 3, fontFamily: 'var(--mono)', letterSpacing: '0.02em' }}>
            3 CONVERSAZIONI · 1 NON LETTO
          </p>
        </div>
      </div>

      {/* Main layout */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '280px 1fr', gap: 16, minHeight: 0 }}>
        {/* Left: conversation list */}
        <GlassCard style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 4, overflow: 'hidden' }}>
          <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 4px 12px', borderBottom: '1px solid var(--line)', marginBottom: 4 }}>
            Messaggi
          </div>
          {conversations.map(conv => {
            const isActive = conv.id === activeConv
            return (
              <div
                key={conv.id}
                onClick={() => setActiveConv(conv.id)}
                style={{
                  padding: '12px 10px',
                  borderRadius: 13,
                  cursor: 'pointer',
                  background: isActive ? 'var(--glass-2)' : 'transparent',
                  borderLeft: isActive ? '2px solid var(--cyan)' : '2px solid transparent',
                  transition: '0.18s',
                }}
                onMouseEnter={e => {
                  if (!isActive) (e.currentTarget as HTMLDivElement).style.background = 'var(--glass)'
                }}
                onMouseLeave={e => {
                  if (!isActive) (e.currentTarget as HTMLDivElement).style.background = 'transparent'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  {/* Avatar */}
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: 'var(--glass-2)',
                      border: '1px solid var(--line-2)',
                      display: 'grid',
                      placeItems: 'center',
                      fontSize: 12,
                      fontWeight: 700,
                      fontFamily: 'var(--mono)',
                      color: 'var(--cyan)',
                      flex: '0 0 auto',
                    }}
                  >
                    {conv.fablabInitials}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)' }}>{conv.fablab}</span>
                      <span style={{ marginLeft: 'auto', fontSize: 10.5, fontFamily: 'var(--mono)', color: 'var(--muted)' }}>{conv.lastTime}</span>
                    </div>
                    <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--muted)', marginTop: 1 }}>{conv.projectName}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingLeft: 46 }}>
                  <span style={{ flex: 1, fontSize: 13, color: 'var(--muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {conv.lastMessage}
                  </span>
                  {conv.unread > 0 && (
                    <span
                      style={{
                        background: 'var(--cyan)',
                        color: '#f4faed',
                        fontSize: 10,
                        fontWeight: 700,
                        fontFamily: 'var(--mono)',
                        padding: '1px 7px',
                        borderRadius: 100,
                        flex: '0 0 auto',
                      }}
                    >
                      {conv.unread}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </GlassCard>

        {/* Right: chat area */}
        <GlassCard style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Chat header */}
          <div
            style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--line)',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              flex: '0 0 auto',
            }}
          >
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>{currentConv.fablab}</div>
              <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--muted)', marginTop: 1 }}>{currentConv.projectName}</div>
            </div>
            <div style={{ marginLeft: 'auto' }}>
              <span
                style={{
                  fontSize: 10,
                  fontFamily: 'var(--mono)',
                  color: 'var(--muted)',
                  border: '1px solid var(--line-2)',
                  padding: '3px 10px',
                  borderRadius: 100,
                }}
              >
                ATTIVO
              </span>
            </div>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflow: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              padding: 16,
            }}
          >
            {messages.map(msg => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '72%',
                }}
              >
                <div
                  style={{
                    background: msg.sender === 'user' ? 'var(--cyan)' : 'var(--glass-2)',
                    border: msg.sender === 'fablab' ? '1px solid var(--line)' : 'none',
                    color: msg.sender === 'user' ? '#f4faed' : 'var(--ink)',
                    borderRadius: msg.sender === 'user' ? '13px 13px 4px 13px' : '13px 13px 13px 4px',
                    padding: '10px 14px',
                    fontSize: 13.5,
                    lineHeight: 1.5,
                  }}
                >
                  {msg.text}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    fontFamily: 'var(--mono)',
                    color: 'var(--muted)',
                    marginTop: 3,
                    textAlign: msg.sender === 'user' ? 'right' : 'left',
                  }}
                >
                  {msg.time}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div
            style={{
              display: 'flex',
              gap: 10,
              padding: '14px 16px',
              borderTop: '1px solid var(--line)',
              flex: '0 0 auto',
            }}
          >
            <input
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder="Scrivi un messaggio…"
              style={{
                flex: 1,
                background: 'var(--glass)',
                border: '1px solid var(--line)',
                borderRadius: 100,
                padding: '11px 18px',
                color: 'var(--ink)',
                fontFamily: 'inherit',
                fontSize: 13.5,
                outline: 'none',
              }}
            />
            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: 'var(--forest)',
                color: '#fff',
                border: 'none',
                fontFamily: 'inherit',
                fontWeight: 700,
                fontSize: 14,
                padding: '0 20px',
                height: 44,
                borderRadius: 100,
                cursor: 'pointer',
                transition: '0.2s',
                flex: '0 0 auto',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--cyan)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--forest)' }}
            >
              <Send size={16} />
              Invia
            </button>
          </div>
        </GlassCard>
      </div>
    </>
  )
}
