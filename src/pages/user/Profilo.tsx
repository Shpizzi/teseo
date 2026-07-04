import { useState } from 'react'
import GlassCard from '../../components/GlassCard'
import PrimaryButton from '../../components/PrimaryButton'
import { userProjects } from '../../mock'
import { savedModels } from '../../mock/user-pages'
import { toast } from '../../components/Toast'

export default function Profilo() {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [notifEmail, setNotifEmail] = useState(true)
  const [notifSms, setNotifSms] = useState(false)
  const [newsletter, setNewsletter] = useState(true)
  const [matPLA, setMatPLA] = useState(true)
  const [matPETG, setMatPETG] = useState(true)
  const [matABS, setMatABS] = useState(false)
  const [matResina, setMatResina] = useState(false)
  const [matNylon, setMatNylon] = useState(false)

  const Toggle = ({ on, onToggle }: { on: boolean; onToggle: () => void }) => (
    <div
      onClick={onToggle}
      style={{
        width: 42,
        height: 22,
        borderRadius: 100,
        background: on ? 'var(--cyan)' : 'var(--glass-2)',
        border: `1px solid ${on ? 'var(--cyan)' : 'var(--line-2)'}`,
        position: 'relative',
        cursor: 'pointer',
        flex: '0 0 auto',
        transition: '0.2s',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 3,
          left: on ? 22 : 3,
          width: 14,
          height: 14,
          borderRadius: '50%',
          background: on ? '#f4faed' : 'var(--muted)',
          transition: '0.2s',
        }}
      />
    </div>
  )

  const ToggleRow = ({ label, sub, on, onToggle }: { label: string; sub: string; on: boolean; onToggle: () => void }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--line)' }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{label}</div>
        <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--muted)', marginTop: 2 }}>{sub}</div>
      </div>
      <Toggle on={on} onToggle={onToggle} />
    </div>
  )

  return (
    <>
      {/* Hero header card */}
      <GlassCard
        hero
        style={{
          padding: '22px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          flex: '0 0 auto',
        }}
      >
        {/* Avatar */}
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: 'var(--glass-2)',
            border: '1px solid var(--line-2)',
            display: 'grid',
            placeItems: 'center',
            fontFamily: 'var(--mono)',
            color: 'var(--cyan)',
            fontSize: 28,
            fontWeight: 700,
            flex: '0 0 auto',
          }}
        >
          F
        </div>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--ink)', marginBottom: 4 }}>
            Francesca Ricci
          </h2>
          <div style={{ fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--muted)', marginBottom: 8 }}>
            Account base
          </div>
          <div style={{ fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--muted)' }}>
            {String(userProjects.filter(p => p.status !== 'draft').length).padStart(2, '0')} stampe attive · {String(savedModels.length).padStart(2, '0')} modelli salvati
          </div>
        </div>
      </GlassCard>

      {/* Two columns */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, minHeight: 0 }}>
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, overflow: 'auto' }}>
          {/* Preferenze */}
          <GlassCard style={{ padding: 22 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink)', marginBottom: 4 }}>
              Preferenze
            </h3>
            <ToggleRow
              label="Notifiche email"
              sub="aggiornamenti sullo stato delle stampe"
              on={notifEmail}
              onToggle={() => setNotifEmail(v => !v)}
            />
            <ToggleRow
              label="Ricezione SMS"
              sub="avvisi urgenti via messaggio"
              on={notifSms}
              onToggle={() => setNotifSms(v => !v)}
            />
            <ToggleRow
              label="Newsletter"
              sub="novità, offerte e aggiornamenti"
              on={newsletter}
              onToggle={() => setNewsletter(v => !v)}
            />
          </GlassCard>

          {/* Materiali preferiti */}
          <GlassCard style={{ padding: 22 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink)', marginBottom: 14 }}>
              Materiali preferiti
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {([
                { label: 'PLA', on: matPLA, toggle: () => setMatPLA(v => !v) },
                { label: 'PETG', on: matPETG, toggle: () => setMatPETG(v => !v) },
                { label: 'ABS', on: matABS, toggle: () => setMatABS(v => !v) },
                { label: 'Resina', on: matResina, toggle: () => setMatResina(v => !v) },
                { label: 'Nylon', on: matNylon, toggle: () => setMatNylon(v => !v) },
              ]).map(m => (
                <span
                  key={m.label}
                  onClick={m.toggle}
                  style={{
                    padding: '7px 16px',
                    borderRadius: 100,
                    fontSize: 12,
                    fontFamily: 'var(--mono)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: '0.2s',
                    background: m.on ? 'var(--cyan)' : 'transparent',
                    color: m.on ? '#f4faed' : 'var(--muted)',
                    border: m.on ? '1px solid var(--cyan)' : '1px solid var(--line)',
                  }}
                >
                  {m.label}
                </span>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Right column */}
        <GlassCard style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 0, overflow: 'auto' }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink)', marginBottom: 16 }}>
            Account
          </h3>

          {[
            { label: 'EMAIL', value: 'francesca.r@mail.com' },
            { label: 'PASSWORD', value: '••••••••' },
            { label: 'PIANO', value: 'Account base' },
          ].map((row, i) => (
            <div
              key={row.label}
              style={{
                padding: '14px 0',
                borderBottom: i < 2 ? '1px solid var(--line)' : 'none',
              }}
            >
              <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
                {row.label}
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>
                {row.value}
              </div>
            </div>
          ))}

          <div style={{ marginTop: 20 }}>
            <PrimaryButton onClick={() => toast('Ti abbiamo inviato una email per reimpostare la password')}>
              Cambia password
            </PrimaryButton>
          </div>

          <div style={{ margin: '18px 0', borderTop: '1px solid var(--line)' }} />

          {confirmDelete ? (
            <div style={{ border: '1px dashed #e40014', borderRadius: 11, padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <span style={{ fontSize: 13, color: 'var(--ink)', fontWeight: 600 }}>
                Eliminare l'account? Progetti e modelli salvati andranno persi.
              </span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => {
                    setConfirmDelete(false)
                    toast("Ti abbiamo inviato una email per confermare l'eliminazione")
                  }}
                  style={{
                    background: 'transparent', color: '#e40014', border: '1px dashed #e40014',
                    fontFamily: 'inherit', fontWeight: 600, fontSize: 12.5, padding: '8px 16px',
                    borderRadius: 100, cursor: 'pointer',
                  }}
                >
                  Sì, elimina
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  style={{
                    background: 'transparent', color: 'var(--muted)', border: '1px solid var(--line)',
                    fontFamily: 'inherit', fontWeight: 600, fontSize: 12.5, padding: '8px 16px',
                    borderRadius: 100, cursor: 'pointer',
                  }}
                >
                  No, mantieni l'account
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: 13,
                fontFamily: 'inherit',
                color: 'var(--muted)',
                textAlign: 'left',
                padding: 0,
                transition: '0.2s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--ink)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--muted)' }}
            >
              Elimina account
            </button>
          )}
        </GlassCard>
      </div>
    </>
  )
}
