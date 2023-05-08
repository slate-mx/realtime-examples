/*
 * Portions of this code were adapted from Liveblocks, which is licensed
 * under the Apache License Version 2.0. The original code can be found at https://github.com/liveblocks/liveblocks/tree/main/examples/nextjs-block-text-editor-advanced.
 * Copyright 2023 Liveblocks
 *
 * Modifications:
 * - Removed unnecessary utils
 *
 */
import { nanoid } from 'nanoid'
import { Editor, Operation } from 'slate'

import { Format } from '@/typings'

export const withNodeId = (editor: Editor) => {
  const { apply } = editor

  editor.apply = (operation: Operation) => {
    if (operation.type === 'insert_node' && operation.path.length === 1) {
      return apply(operation)
    }

    if (operation.type === 'split_node' && operation.path.length === 1) {
      ;(operation.properties as any).id = nanoid(16)
      return apply(operation)
    }

    return apply(operation)
  }

  return editor
}

export function toggleMark(editor: Editor, format: Format) {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

export function isMarkActive(editor: Editor, format: Format) {
  const marks = Editor.marks(editor)
  return marks ? marks[format] === true : false
}

export function withLayout(editor: Editor) {
  const { normalizeNode } = editor

  editor.normalizeNode = ([node, path]) => {
    return normalizeNode([node, path])
  }

  return editor
}

type CursorType = 'grab' | 'grabbing'

export function setGlobalCursor(type: CursorType) {
  document.body.classList.add(type)
}

export function removeGlobalCursor(type: CursorType) {
  document.body.classList.remove(type)
}
