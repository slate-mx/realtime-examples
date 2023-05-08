import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { useMemo } from 'react'

import { RealtimeProvider } from '../realtime.config'
import { BlockEditor } from '@/components/blocks'
import { EditorBar } from './components/editor/EditorBar'

dayjs.extend(utc)

// TODO: Loader for later
// if (documentStatus !== RealtimeDocumentStatus.Ready) {
//   return (
//     <div className='w-full max-w-3xl mx-auto px-16 py-20 flex flex-col gap-5'>
//       <div className='flex gap-3 items-center'>
//         <div className='skeleton h-20 w-20 rounded' />
//         <div className='grow flex flex-col gap-3'>
//           <div className='skeleton w-20 h-5 rounded' />
//           <div className='skeleton w-full h-8 rounded' />
//         </div>
//       </div>

//       <div className='skeleton h-16 w-full rounded' />

//       <div className='flex flex-col gap-3'>
//         <div className='skeleton h-8 w-full rounded' />
//         <div className='skeleton h-8 w-full rounded' />
//         <div className='skeleton h-8 w-full rounded' />
//         <div className='skeleton h-8 w-full rounded' />
//       </div>
//     </div>
//   )
// }

function App() {
  const startOfHour = useMemo(() => dayjs().utc().format('YYMMDDHH').toString(), [])

  return (
    <RealtimeProvider
      documentId={startOfHour}
      publicAuthKey={import.meta.env.VITE_REALTIME_PUBLIC_AUTH_KEY}
      throttle={50}
    >
      <div className='flex h-screen'>
        <div id='slate-wrapper' className='relative h-full overflow-y-scroll flex-1'>
          <EditorBar />

          <div className='relative min-h-full w-full flex flex-col pt-16 pb-24 overflow-x-hidden'>
            <BlockEditor />
          </div>
        </div>
      </div>
    </RealtimeProvider>
  )
}

export default App
