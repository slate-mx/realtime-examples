import { Avatars } from './Avatars'
import { RealtimeStatusDot } from './RealtimeStatusDot'

export const EditorBar = () => {
  return (
    <div className='fixed z-40 top-3 left-3 right-3'>
      <div className='w-full h-14 px-4 flex items-center justify-between bg-neutral-900/50 backdrop-blur-md border border-neutral-800 rounded-lg'>
        <div className='flex items-center gap-3'>
          <RealtimeStatusDot />
          <Avatars />
        </div>

        <div className='flex items-center gap-3'></div>
      </div>
    </div>
  )
}
