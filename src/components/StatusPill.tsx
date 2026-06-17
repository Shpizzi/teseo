import type { ProjectStatus } from '../mock'

type StatusPillProps = {
  status: ProjectStatus
}

const statusConfig: Record<ProjectStatus, { className: string; label: string }> = {
  printing: { className: 'status-pill sp-print', label: 'In stampa' },
  ready:    { className: 'status-pill sp-ready', label: 'Pronto' },
  draft:    { className: 'status-pill sp-new',   label: 'Bozza' },
  error:    { className: 'status-pill sp-err',   label: 'Errore' },
}

export default function StatusPill({ status }: StatusPillProps) {
  const { className, label } = statusConfig[status]
  return <span className={className}>{label}</span>
}
