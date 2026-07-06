import { useSyncExternalStore } from 'react'
import { conversations as seedConvs, chatMessages as seedMsgs, type ChatConversation, type ChatMessage } from './user-pages'

// ponytail: store in-memory come orderStore — si azzera al reload. Serve solo a far
// comparire in /app/messages la chat di supporto creata dal flusso scan.

let convs: ChatConversation[] = [...seedConvs]
let msgs: ChatMessage[] = [...seedMsgs]
const listeners = new Set<() => void>()
const emit = () => listeners.forEach(l => l())

export const SUPPORT_ID = 'support-mesh'

// Apre (una sola volta) la chat col supporto TESEO per la mesh da sistemare.
// Restituisce l'id della conversazione per il deep-link verso /app/messages.
export function openSupportChat(part: string): string {
  if (!convs.some(c => c.id === SUPPORT_ID)) {
    convs = [
      { id: SUPPORT_ID, fablab: 'Supporto TESEO', fablabInitials: 'TS', lastMessage: 'Un esperto sistemerà la tua mesh.', lastTime: 'adesso', unread: 1, projectName: part },
      ...convs,
    ]
    msgs = [
      ...msgs,
      {
        id: 'sup-1', conversationId: SUPPORT_ID, sender: 'fablab', time: 'adesso',
        text: `Ciao! Abbiamo ricevuto la tua richiesta per «${part}». Un nostro esperto controllerà la mesh generata dall'AI, la sistemerà dove serve e ti scrive qui appena è pronta per la stampa. Il controllo è gratuito.`,
      },
    ]
    emit()
  }
  return SUPPORT_ID
}

export function useConversations(): ChatConversation[] {
  return useSyncExternalStore(cb => { listeners.add(cb); return () => listeners.delete(cb) }, () => convs)
}

export function useChatMessages(): ChatMessage[] {
  return useSyncExternalStore(cb => { listeners.add(cb); return () => listeners.delete(cb) }, () => msgs)
}
