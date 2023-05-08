import { useEffect, useRef } from 'react'
import { Editor, Range } from 'slate'
import { useSlate } from 'slate-react'
import { toggleMark } from '../components/utils'
import { IconBold, IconItalic, IconStrikethrough, IconUnderline } from '@tabler/icons-react'

export const Toolbar = () => {
  const ref = useRef<HTMLDivElement | null>(null)
  const editor = useSlate()

  useEffect(() => {
    const el = ref.current
    const { selection } = editor

    if (!el) {
      return
    }

    if (!selection || Range.isCollapsed(selection) || Editor.string(editor, selection) === '') {
      el.style.opacity = '0'
      el.style.top = '-100px'
      el.style.left = '-100px'
      return
    }

    const domSelection = window.getSelection()
    if (domSelection == null || domSelection.rangeCount === 0) {
      return
    }

    const domRange = domSelection.getRangeAt(0)
    const rect = domRange.getBoundingClientRect()

    el.style.opacity = '1'
    el.style.top = `${rect.top + window.scrollY - 110}px`
    el.style.left = `${rect.left + window.scrollX}px`
  })

  const marks = Editor.marks(editor)

  return (
    <div
      ref={ref}
      className='absolute opacity-0 z-10 p-1 flex items-center bg-neutral-50 dark:bg-neutral-800 rounded-md pointer-events-auto shadow-md shadow-neutral-950/20 dark:shadow-neutral-950/80'
      onMouseDown={(e) => e.preventDefault()}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <button
          className={`icon-btn icon-btn-sm ${
            marks?.['bold'] ? '!text-primary bg-neutral-500/10 dark:bg-neutral-950/60' : ''
          }`}
          onClick={() => toggleMark(editor, 'bold')}
          onPointerDown={(e) => e.preventDefault()}
        >
          <IconBold size={18} />
        </button>

        <button
          className={`icon-btn icon-btn-sm ${
            marks?.['italic'] ? '!text-primary bg-neutral-500/10 dark:bg-neutral-950/60' : ''
          }`}
          onClick={() => toggleMark(editor, 'italic')}
          onPointerDown={(e) => e.preventDefault()}
        >
          <IconItalic size={18} />
        </button>

        <button
          className={`icon-btn icon-btn-sm ${
            marks?.['underline'] ? '!text-primary bg-neutral-500/10 dark:bg-neutral-950/60' : ''
          }`}
          onClick={() => toggleMark(editor, 'underline')}
          onPointerDown={(e) => e.preventDefault()}
        >
          <IconUnderline size={18} />
        </button>

        <button
          className={`icon-btn icon-btn-sm ${
            marks?.['strikeThrough'] ? '!text-primary bg-neutral-500/10 dark:bg-neutral-950/60' : ''
          }`}
          onClick={() => toggleMark(editor, 'strikeThrough')}
          onPointerDown={(e) => e.preventDefault()}
        >
          <IconStrikethrough size={18} />
        </button>
      </div>
    </div>
  )
}
