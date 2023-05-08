import { Avatars, DarkModeToggle, Editor, Star } from '@/components'

export default function Home() {
  return (
    <div className='min-h-screen wrapper'>
      <nav className='w-full h-16 flex items-center justify-between gap-5 px-5'>
        <div className='flex items-center gap-3 font-semibold'>
          <Star size={24} />
          Realtime block editor
        </div>

        <div className='flex items-center gap-3'>
          <DarkModeToggle />
          <Avatars />
        </div>
      </nav>

      <Editor />
    </div>
  )
}
