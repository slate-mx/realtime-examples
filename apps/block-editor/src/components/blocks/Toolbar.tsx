/*
 * Portions of this code were adapted from Liveblocks, which is licensed
 * under the Apache License Version 2.0. The original code can be found at https://github.com/liveblocks/liveblocks/tree/main/examples/nextjs-block-text-editor-advanced.
 * Copyright 2023 Liveblocks
 *
 * Modifications:
 * - Styling of components
 * - Position method changed
 *
 */
import { useEffect, useRef } from 'react'
import { IconBold, IconItalic, IconStrikethrough, IconUnderline } from '@tabler/icons-react'
import { Editor, Range } from 'slate'
import { useSlate } from 'slate-react'

import { toggleMark } from '@/utils'

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
    const scrollWrapper = document.querySelector('#slate-wrapper')
    const scrollTop = scrollWrapper?.scrollTop ?? 0

    el.style.opacity = '1'
    el.style.top = `${rect.top + scrollTop - 40}px`
    el.style.left = `${rect.left}px`
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
