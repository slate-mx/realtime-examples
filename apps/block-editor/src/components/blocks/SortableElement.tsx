import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { RenderElementProps } from 'slate-react'

import { useCollaborators } from '../../../realtime.config'
import { BlockType, CustomElement } from '@/typings'

import { Avatar } from '../editor'

import { BlockActions } from './BlockActions'

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

  const marginMap = {
    [BlockType.H1]: 'mt-5 mb-2',
    [BlockType.H2]: 'mt-4 mb-1',
    [BlockType.H3]: 'mt-3 mb-0.5',
    [BlockType.Paragraph]: 'mt-0.5 mb-0.5',
    [BlockType.BulletedList]: 'mt-1.5 mb-1.5',
  }

  return (
    <div
      className={`group relative flex flex-col bg-transparent border border-transparent transition-colors rounded hover:border-neutral-800 ${
        marginMap[element.type]
      }`}
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
          {/* This is here so that this element doesn't become contentEditable when collaborators is empty */}
          {!collaborators?.length && <div />}

          {collaborators?.map((col) =>
            col.data?.emoji ? (
              <Avatar key={col.clientId} emoji={col.data.emoji} />
            ) : (
              <div key={col.clientId} />
            ),
          )}
        </div>

        <div
          className='opacity-0 group-hover:opacity-100 absolute bottom-1/2 left-0 pr-1 -translate-x-full translate-y-1/2'
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
