import { useEffect, useState } from 'react'
import { IconMoon, IconSun } from '@tabler/icons-react'

export const DarkModeToggle = () => {
  const [hasDarkMode, setHasDarkMode] = useState<boolean>()

  const onToggle = () => {
    if (hasDarkMode) {
      localStorage.setItem('theme', 'light')
      document.documentElement.classList.remove('dark')
      setHasDarkMode(false)
    } else {
      localStorage.setItem('theme', 'dark')
      document.documentElement.classList.add('dark')
      setHasDarkMode(true)
    }
  }

  // const onSystem = () => {
  //   localStorage.removeItem('theme')
  // }

  useEffect(() => {
    if (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark')
      setHasDarkMode(true)
    } else {
      document.documentElement.classList.remove('dark')
      setHasDarkMode(false)
    }
  }, [])

  return (
    <div>
      {hasDarkMode !== undefined && (
        <button className='icon-btn' onClick={onToggle}>
          {hasDarkMode ? <IconMoon size={20} /> : <IconSun size={20} />}
        </button>
      )}
    </div>
  )
}
