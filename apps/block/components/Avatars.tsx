import { RealtimePresenceStatus } from '@inrealtime/react'
import { useCollaborators, useMe, usePatchMe, usePresenceStatus } from '@/realtime.config'
import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect } from 'react'
import { shallow } from 'zustand/shallow'
import { formatEmoji } from '@/utils'
import { Avatar, avatarClassName } from './Avatar'

const emojis = [
  '🥰',
  '🔥',
  '😶',
  '🏎️',
  '🧠',
  '😶‍🌫️',
  '👀',
  '🤙',
  '🍺',
  '🫖',
  '☕️',
  '🚀',
  '😅',
  '😇',
  '🥸',
  '🥳',
]

export const Avatars = () => {
  const status = usePresenceStatus()
  const patchMe = usePatchMe()

  const collaboratorData = useCollaborators(
    (collaborators) =>
      collaborators.map((c) => ({
        clientId: c.clientId,
        emoji: c.data?.emoji ?? '☺️',
      })),
    shallow,
  )
  const myEmoji = useMe((me) => me.data?.emoji)

  const updateMyEmoji = useCallback(() => {
    const emoji = formatEmoji(emojis[Math.floor(Math.random() * emojis.length)])

    patchMe({
      emoji,
    })
  }, [patchMe])

  useEffect(() => {
    if (status === RealtimePresenceStatus.Ready && !myEmoji) {
      updateMyEmoji()
    }
  }, [status])

  return (
    <div className='my-3 flex flex-col gap-3'>
      <div className='mx-2 flex items-center'>
        {!!myEmoji && (
          <div
            role='img'
            className={`${avatarClassName} border-primary bg-primary/20 ring-2 ring-primary/50 ring-offset-2 ring-offset-neutral-50 dark:ring-offset-neutral-950`}
          >
            {formatEmoji(myEmoji)}
          </div>
        )}

        <AnimatePresence>
          {collaboratorData?.map(({ clientId, emoji }) => (
            <Avatar key={clientId} emoji={emoji} animate />
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
