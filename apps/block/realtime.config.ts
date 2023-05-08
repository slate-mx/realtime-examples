import { createRealtimeContext } from '@inrealtime/react'

export type RealtimeDocument = {
  blocks: {
    id: string
    type: string | any
    children: { text: string }[]
    url?: string
    alt?: string
    checked?: boolean
  }[]
}

export type PresenceData = {
  id?: string
  selectedBlockId?: string
  emoji?: string
}

export const {
  RealtimeProvider,
  useRealtimeContext,
  useDocumentStatus,
  useConnectionStatus,
  usePresenceStatus,
  useStore,
  usePatch,
  useSubscribe,
  useCollaborators,
  useSubscribeCollaborators,
  useMe,
  usePatchMe,
  useSubscribeMe,
  useBroadcast,
  useBroadcastListener,
} = createRealtimeContext<RealtimeDocument, PresenceData>()
