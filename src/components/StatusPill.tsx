import type { ProjectStatus } from '../mock'

type StatusPillProps = {
  status: ProjectStatus
  label?: string // override del testo mantenendo lo stile dello status
}

const statusConfig: Record<ProjectStatus, { className: string; label: string }> = {
  printing: { className: 'status-pill sp-print', label: 'In stampa' },
  ready:    { className: 'status-pill sp-ready', label: 'Pronto' },
  draft:    { className: 'status-pill sp-new',   label: 'Bozza' },
  error:    { className: 'status-pill sp-err',   label: 'Errore' },
}

export default function StatusPill({ status, label }: StatusPillProps) {
  const cfg = statusConfig[status]
  return <span className={cfg.className}>{label ?? cfg.label}</span>
}
