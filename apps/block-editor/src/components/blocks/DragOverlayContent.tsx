/*
 * Portions of this code were adapted from Liveblocks, which is licensed
 * under the Apache License Version 2.0. The original code can be found at https://github.com/liveblocks/liveblocks/tree/main/examples/nextjs-block-text-editor-advanced.
 * Copyright 2023 Liveblocks
 *
 * Modifications:
 * - Added withHistory wrapper
 *
 */
import { useMemo, useState } from 'react'
import { createEditor } from 'slate'
import { withHistory } from 'slate-history'
import { Editable, RenderElementProps, Slate, withReact } from 'slate-react'

import { CustomElement } from '@/typings'
import { withLayout, withNodeId, withShortcuts } from '@/utils'

import { Leaf } from './Leaf'

export const DragOverlayContent = ({
  element,
  renderElement,
}: {
  element: CustomElement
  renderElement: (props: RenderElementProps) => JSX.Element
}) => {
  const editor = useMemo(
    () => withShortcuts(withNodeId(withLayout(withReact(withHistory(createEditor()))))),
    [],
  )
  const [value] = useState([JSON.parse(JSON.stringify(element))])

  return (
    <Slate editor={editor} value={value}>
      <Editable readOnly={true} renderElement={renderElement} renderLeaf={Leaf} />
    </Slate>
  )
}
