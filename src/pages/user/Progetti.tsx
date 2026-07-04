import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import PrimaryButton from '../../components/PrimaryButton'
import GlassCard from '../../components/GlassCard'
import StatusPill from '../../components/StatusPill'
import ProgressBar from '../../components/ProgressBar'
import { userProjects } from '../../mock'
import { historyProjects } from '../../mock/user-pages'

export default function Progetti() {
  const [activeTab, setActiveTab] = useState<'corsi' | 'storico'>('corsi')
  const navigate = useNavigate()

  const inCorso = userProjects.filter(p => p.status !== 'draft' || p.fablab)
  const tabStyle = (tab: 'corsi' | 'storico') => ({
    padding: '8px 18px',
    borderRadius: 100,
    cursor: 'pointer',
    fontFamily: 'var(--mono)' as const,
    fontSize: 12,
    fontWeight: 600,
    transition: '0.18s',
    border: 'none',
    background: activeTab === tab ? 'var(--cyan)' : 'transparent',
    color: activeTab === tab ? '#f4faed' : 'var(--muted)',
  })

  return (
    <>
      {/* Topbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: '0 0 auto' }}>
        <div>
          <h1 style={{ fontWeight: 600, fontSize: 25, letterSpacing: '-0.01em', color: 'var(--ink)' }}>
            I miei progetti
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: 12, marginTop: 3, fontFamily: 'var(--mono)', letterSpacing: '0.02em' }}>
            4 TOTALI · 2 IN LAVORAZIONE
          </p>
        </div>
        <div style={{ flex: 1 }} />
        <PrimaryButton onClick={() => navigate('/app/new')}>
          <Plus size={18} />
          Nuova stampa
        </PrimaryButton>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          gap: 4,
          flex: '0 0 auto',
          background: 'var(--glass)',
          border: '1px solid var(--line)',
          borderRadius: 100,
          padding: 4,
          width: 'fit-content',
        }}
      >
        <button style={tabStyle('corsi')} onClick={() => setActiveTab('corsi')}>
          In corso &nbsp;2
        </button>
        <button style={tabStyle('storico')} onClick={() => setActiveTab('storico')}>
          Storico &nbsp;3
        </button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
        {activeTab === 'corsi' ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 14,
              alignContent: 'start',
            }}
          >
            {inCorso.map(project => (
              <div key={project.id} onClick={() => navigate(`/app/progetti/${project.id}`)} style={{ cursor: 'pointer' }}>
              <GlassCard
                style={{
                  padding: 18,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  cursor: 'pointer',
                  transition: '0.2s',
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div className="thumb-mini" />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 14.5, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {project.name}
                    </div>
                    <div style={{ fontSize: 11.5, fontFamily: 'var(--mono)', color: 'var(--muted)', marginTop: 3 }}>
                      {project.status === 'draft' ? 'Bozza · nessun produttore' : `${project.fablab} · ${project.material}`}
                    </div>
                  </div>
                </div>

                {/* Progress */}
                <ProgressBar value={project.progress} label={`${project.progress}%`} />

                {/* Footer */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <StatusPill status={project.status} />
                  {project.eta && (
                    <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--muted)' }}>
                      {project.eta}
                    </span>
                  )}
                </div>
              </GlassCard>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
            {historyProjects.map(project => (
              <div
                key={project.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: 16,
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--glass)',
                  border: '1px solid var(--line)',
                  cursor: 'pointer',
                  transition: '0.2s',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLDivElement
                  el.style.borderColor = 'var(--line-2)'
                  el.style.background = 'var(--glass-2)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLDivElement
                  el.style.borderColor = 'var(--line)'
                  el.style.background = 'var(--glass)'
                }}
              >
                <div className="thumb-mini" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14.5, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {project.name}
                  </div>
                  <div style={{ fontSize: 11.5, fontFamily: 'var(--mono)', color: 'var(--muted)', marginTop: 3 }}>
                    {project.fablab} · {project.material} · {project.completedDate}
                  </div>
                </div>
                <div style={{ fontFamily: 'var(--mono)', color: 'var(--cyan)', fontSize: 13, fontWeight: 600 }}>
                  {project.cost}
                </div>
                <span
                  className={`status-pill ${project.status === 'completed' ? 'sp-ready' : 'sp-err'}`}
                >
                  {project.status === 'completed' ? 'Completato' : 'Annullato'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
