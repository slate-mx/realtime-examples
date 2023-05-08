import { useMemo, useState } from 'react'
import { createEditor } from 'slate'
import { Editable, RenderElementProps, Slate, withReact } from 'slate-react'

import { CustomElement } from '../types'
import { withLayout, withNodeId } from './utils'
import { Leaf } from './Leaf'
import { withShortcuts } from '@/utils'

export const DragOverlayContent = ({
  element,
  renderElement,
}: {
  element: CustomElement
  renderElement: (props: RenderElementProps) => JSX.Element
}) => {
  const editor = useMemo(() => withShortcuts(withNodeId(withLayout(withReact(createEditor())))), [])
  const [value] = useState([JSON.parse(JSON.stringify(element))]) // clone

  return (
    <Slate editor={editor} value={value}>
      <Editable readOnly={true} renderElement={renderElement} renderLeaf={Leaf} />
    </Slate>
  )
}
