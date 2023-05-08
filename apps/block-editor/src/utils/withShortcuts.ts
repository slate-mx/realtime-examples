/*
 * Portions of this code were adapted from Liveblocks, which is licensed
 * under the Apache License Version 2.0. The original code can be found at https://github.com/liveblocks/liveblocks/tree/main/examples/nextjs-block-text-editor-advanced.
 * Copyright 2023 Liveblocks
 *
 * Modifications:
 * - Bug fixes
 * - Added insertFragment for copy paste
 *
 */
import { nanoid } from 'nanoid'
import { Editor, Element, Point, Range, Transforms } from 'slate'

import { BlockType, CustomElement } from '@/typings'

const SHORTCUTS: Record<string, BlockType> = {
  '*': BlockType.BulletedList,
  '-': BlockType.BulletedList,
  '+': BlockType.BulletedList,
  '#': BlockType.H1,
  '##': BlockType.H2,
  '###': BlockType.H3,
}

export const withShortcuts = (editor: Editor) => {
  const { deleteBackward, insertText, insertFragment } = editor

  editor.insertText = (text) => {
    const { selection } = editor

    if (text.endsWith(' ') && selection && Range.isCollapsed(selection)) {
      const { anchor } = selection
      const block = Editor.above(editor, {
        match: (n) => Editor.isBlock(editor, n as CustomElement),
      })
      const path = block ? block[1] : []
      const start = Editor.start(editor, path)
      const range = { anchor, focus: start }
      const beforeText = Editor.string(editor, range) + text.slice(0, -1)
      const type = SHORTCUTS[beforeText]

      if (type) {
        Transforms.select(editor, range)

        if (!Range.isCollapsed(range)) {
          Transforms.delete(editor)
        }

        const newProperties: Partial<CustomElement> = {
          type,
        }

        Transforms.setNodes(editor, newProperties, { at: path })

        return
      }
    }

    insertText(text)
  }

  editor.deleteBackward = (...args: unknown[]) => {
    const { selection } = editor

    if (selection && Range.isCollapsed(selection)) {
      const match = Editor.above(editor, {
        match: (n) => Editor.isBlock(editor, n as CustomElement),
      })

      if (match) {
        const [block, path] = match
        const start = Editor.start(editor, path)

        if (
          !Editor.isEditor(block) &&
          Element.isElement(block) &&
          block.type !== BlockType.Paragraph &&
          Point.equals(selection.anchor, start)
        ) {
          const newProperties: Partial<CustomElement> = {
            type: BlockType.Paragraph,
          }
          Transforms.setNodes(editor, newProperties)

          return
        }
      }

      // @ts-ignore
      deleteBackward(...args)
    }
  }

  editor.insertFragment = (fragment) => {
    const newFrags = fragment.map((frag) => ({ ...frag, id: nanoid(16) }))

    insertFragment(newFrags)
  }

  return editor
}
