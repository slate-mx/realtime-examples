import { RenderElementProps } from 'slate-react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { CustomElement } from '../types'
import { BlockActions } from './BlockActions'
import { useCollaborators } from '@/realtime.config'
import { Avatar } from './Avatar'

export const SortableElement = ({
  attributes,
  element,
  children,
  renderElement,
  onDelete,
  onInsertBelow,
}: RenderElementProps & {
  renderElement: any
  onDelete: () => void
  onInsertBelow: (block: CustomElement) => void
}) => {
  const sortable = useSortable({ id: element.id })

  const collaborators = useCollaborators((collaborators) =>
    collaborators.filter((user) => user.data.selectedBlockId === element.id),
  )

  return (
    <div
      className='group relative flex flex-col bg-transparent hover:bg-neutral-500/5 dark:hover:bg-neutral-500/25 transition-colors rounded-md'
      {...attributes}
    >
      <div
        className='outline-none cursor-text'
        {...sortable.attributes}
        ref={sortable.setNodeRef}
        style={{
          transition: sortable.transition,
          transform: CSS.Transform.toString(sortable.transform),
          pointerEvents: sortable.isSorting ? 'none' : undefined,
          opacity: sortable.isDragging ? 0 : 1,
        }}
      >
        {renderElement({ element, children })}

        <div
          className='absolute top-2 -right-4 translate-x-full select-none mx-2 flex items-center pointer-events-none'
          contentEditable={false}
        >
          {collaborators?.map((col) =>
            col.data?.emoji ? <Avatar key={col.clientId} emoji={col.data.emoji} /> : null,
          )}
        </div>

        <div
          className='opacity-0 group-hover:opacity-100 absolute bottom-1.5 left-0 pr-2 -translate-x-full'
          contentEditable={false}
          style={{ userSelect: 'none' }}
        >
          <BlockActions
            blockId={element.id}
            element={element}
            onDelete={onDelete}
            onInsertBelow={onInsertBelow}
          />
        </div>
      </div>
    </div>
  )
}
