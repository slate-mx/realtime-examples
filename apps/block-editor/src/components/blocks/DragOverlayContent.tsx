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
  const [value] = useState([JSON.parse(JSON.stringify(element))]) // clone

  return (
    <Slate editor={editor} value={value}>
      <Editable readOnly={true} renderElement={renderElement} renderLeaf={Leaf} />
    </Slate>
  )
}
