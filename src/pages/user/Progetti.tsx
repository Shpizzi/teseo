import { useState } from 'react'
import { Plus, RotateCcw } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import PrimaryButton from '../../components/PrimaryButton'
import GlassCard from '../../components/GlassCard'
import StatusPill from '../../components/StatusPill'
import ProgressBar from '../../components/ProgressBar'
import { userProjects, type Project } from '../../mock'
import { historyProjects } from '../../mock/user-pages'

// Ordine appena confermato in /app/new: arriva via location.state e viene
// mostrato in cima alla lista, evidenziato (l'ordine non deve "svanire").
type NewOrderState = { newOrder?: { name: string; fablab: string } } | null

export default function Progetti() {
  const [activeTab, setActiveTab] = useState<'corsi' | 'storico'>('corsi')
  const navigate = useNavigate()
  const newOrder = (useLocation().state as NewOrderState)?.newOrder

  const justOrdered: Project | undefined = newOrder
    ? {
        id: 'new', name: newOrder.name, fablab: newOrder.fablab, material: 'PLA',
        progress: 0, status: 'draft', eta: 'in attesa di conferma',
      }
    : undefined
  const inCorso = [...(justOrdered ? [justOrdered] : []), ...userProjects]
  const inStampa = inCorso.filter(p => p.status === 'printing').length
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
            {inCorso.length + historyProjects.length} TOTALI · {inStampa} IN STAMPA
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
          In corso &nbsp;{inCorso.length}
        </button>
        <button style={tabStyle('storico')} onClick={() => setActiveTab('storico')}>
          Storico &nbsp;{historyProjects.length}
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
            {inCorso.map(project => {
              const isNew = project.id === 'new'
              const isDraft = project.status === 'draft' && !project.fablab
              return (
                <div
                  key={project.id}
                  onClick={isNew ? undefined : () => navigate(`/app/progetti/${project.id}`)}
                  style={{ cursor: isNew ? 'default' : 'pointer' }}
                >
                  <GlassCard
                    style={{
                      padding: 18,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 12,
                      cursor: 'inherit',
                      transition: '0.2s',
                      ...(isNew ? { border: '1px solid var(--cyan)' } : {}),
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
                          {isDraft ? 'Bozza · nessun produttore' : `${project.fablab} · ${project.material}`}
                        </div>
                      </div>
                    </div>

                    {/* Progress */}
                    <ProgressBar value={project.progress} label={`${project.progress}%`} />

                    {/* Footer */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                      <StatusPill status={project.status} label={isNew ? 'Inviato' : undefined} />
                      {isDraft ? (
                        <button
                          onClick={e => {
                            e.stopPropagation()
                            navigate('/app/new', { state: { modelName: project.name } })
                          }}
                          style={{
                            background: 'transparent', color: 'var(--cyan)', border: '1px solid var(--line-2)',
                            fontFamily: 'inherit', fontWeight: 600, fontSize: 12, padding: '6px 14px',
                            borderRadius: 100, cursor: 'pointer', transition: '0.18s',
                          }}
                        >
                          Trova produttore →
                        </button>
                      ) : (
                        project.eta && (
                          <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--muted)' }}>
                            {project.eta}
                          </span>
                        )
                      )}
                    </div>
                  </GlassCard>
                </div>
              )
            })}
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
                  transition: '0.2s',
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
                <StatusPill
                  status={project.status === 'completed' ? 'ready' : 'draft'}
                  label={project.status === 'completed' ? 'Completato' : 'Annullato'}
                />
                {project.status === 'completed' && (
                  <button
                    onClick={() => navigate('/app/new', { state: { modelName: project.name } })}
                    title="Riordina lo stesso pezzo"
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      background: 'transparent', color: 'var(--cyan)', border: '1px solid var(--line-2)',
                      fontFamily: 'inherit', fontWeight: 600, fontSize: 12, padding: '6px 14px',
                      borderRadius: 100, cursor: 'pointer', transition: '0.18s', flex: '0 0 auto',
                    }}
                  >
                    <RotateCcw size={13} />
                    Ristampa
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
