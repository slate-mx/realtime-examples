import { useCallback } from 'react'
import { RealtimeConnectionStatus } from '@inrealtime/react'

import { useConnectionStatus } from '../../../realtime.config'

export const RealtimeStatusDot = () => {
  const baseClass = 'h-3 w-3 rounded-full bg-neutral-500'
  const status = useConnectionStatus()

  const renderDot = useCallback(() => {
    switch (status) {
      case RealtimeConnectionStatus.Closed:
        return <div className={`${baseClass} bg-red-500/60 border border-red-500`} />
      case RealtimeConnectionStatus.Open:
        return (
          <div className='relative flex h-3 w-3'>
            <span className='animate-ping-slow absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-80'></span>
            <span className='relative inline-flex rounded-full h-3 w-3 bg-green-500/60 border border-green-500'></span>
          </div>
        )
      default:
        return (
          <div className={`${baseClass} bg-yellow-500/60 border border-yellow-500 animate-pulse`} />
        )
    }
  }, [status])

  return <div>{renderDot()}</div>
}
