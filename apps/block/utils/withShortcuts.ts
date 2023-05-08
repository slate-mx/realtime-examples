import { Editor as SlateEditor, Element, Point, Range, Transforms } from 'slate'

import { BlockType, CustomElement } from '../types'

const SHORTCUTS: Record<string, BlockType> = {
  '*': BlockType.BulletedList,
  '-': BlockType.BulletedList,
  '+': BlockType.BulletedList,
  '#': BlockType.H1,
  '##': BlockType.H2,
  '###': BlockType.H3,
}

export const withShortcuts = (editor: SlateEditor) => {
  const { deleteBackward, insertText } = editor

  editor.insertText = (text) => {
    const { selection } = editor

    if (text.endsWith(' ') && selection && Range.isCollapsed(selection)) {
      const { anchor } = selection
      const block = SlateEditor.above(editor, {
        match: (n) => SlateEditor.isBlock(editor, n),
      })
      const path = block ? block[1] : []
      const start = SlateEditor.start(editor, path)
      const range = { anchor, focus: start }
      const beforeText = SlateEditor.string(editor, range) + text.slice(0, -1)
      const type = SHORTCUTS[beforeText]

      if (type) {
        Transforms.select(editor, range)

        if (!Range.isCollapsed(range)) {
          Transforms.delete(editor)
        }

        const newProperties: Partial<CustomElement> = {
          type,
        }
        Transforms.setNodes<CustomElement>(editor, newProperties, {
          match: (n) => SlateEditor.isBlock(editor, n),
        })

        return
      }
    }

    insertText(text)
  }

  editor.deleteBackward = (...args: unknown[]) => {
    const { selection } = editor

    if (selection && Range.isCollapsed(selection)) {
      const match = SlateEditor.above(editor, {
        match: (n) => SlateEditor.isBlock(editor, n),
      })

      if (match) {
        const [block, path] = match
        const start = SlateEditor.start(editor, path)

        if (
          !SlateEditor.isEditor(block) &&
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

  return editor
}
