import { motion } from 'framer-motion'
import { formatEmoji } from '@/utils'

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
