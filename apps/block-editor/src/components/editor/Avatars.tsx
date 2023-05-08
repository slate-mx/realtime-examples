import { useCallback, useEffect } from 'react'
import { RealtimePresenceStatus } from '@inrealtime/react'
import { AnimatePresence, motion } from 'framer-motion'
import { shallow } from 'zustand/shallow'

import { useCollaborators, useMe, usePatchMe, usePresenceStatus } from '../../../realtime.config'
import { formatEmoji } from '@/utils'

const emojis = [
  '🥰',
  '🔥',
  '😶',
  '🏎️',
  '🧠',
  '🤓',
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

export const avatarClassName =
  'h-6 w-6 bg-neutral-100 dark:bg-neutral-800 text-sm border rounded-full flex items-center justify-center -ml-1 shadow-md cursor-default'

export const Avatar = ({ emoji, animate }: { emoji: string; animate?: boolean }) => {
  return animate ? (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      role='img'
      className={`${avatarClassName} border-secondary`}
    >
      {formatEmoji(emoji)}
    </motion.div>
  ) : (
    <div role='img' className={`${avatarClassName} border-secondary`}>
      {formatEmoji(emoji)}
    </div>
  )
}

export const Avatars = () => {
  const status = usePresenceStatus()
  const patchMe = usePatchMe()

  const collaboratorData = useCollaborators(
    (collaborators) =>
      collaborators.map((c) => ({
        clientId: c.clientId,
        emoji: c.data?.emoji ?? `💀`,
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
    <div className='my-3 flex flex-col gap-3 select-none'>
      <div className='mx-2 flex items-center'>
        {!!myEmoji && (
          <div
            role='img'
            className={`${avatarClassName} border-secondary bg-secondary/20 ring-2 ring-secondary/50 ring-offset-2 ring-offset-neutral-50 dark:ring-offset-neutral-950`}
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
