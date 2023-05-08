import { CustomElement } from '@/typings'
import { createRealtimeContext } from '@inrealtime/react'

export type RealtimeDocument = {
  blocks: CustomElement[]
}

export type PresenceData = {
  id?: string
  selectedBlockId?: string
  emoji?: string
}

export const {
  RealtimeProvider,
  useRealtimeContext,
  usePresenceStatus,
  useConnectionStatus,
  useDocumentStatus,
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
