import { useDraggable } from '@dnd-kit/core'
import { Menu } from '@headlessui/react'
import { Float } from '@headlessui-float/react'
import { IconGripVertical, IconTrash } from '@tabler/icons-react'
import { Transforms } from 'slate'
import { ReactEditor, useSlate } from 'slate-react'

import { BlockType, CustomElement } from '@/typings'

import { BlockMenu } from './BlockMenu'
import { BlockTransformMenu } from './BlockTransformMenu'

type Props = {
  blockId: string
  element: CustomElement
  onDelete: () => void
  onInsertBelow: (block: CustomElement) => void
}

export const BlockActions = ({ blockId, element, onDelete, onInsertBelow }: Props) => {
  const { listeners, setActivatorNodeRef } = useDraggable({
    id: blockId,
  })

  const editor = useSlate()

  const changeType = (type: BlockType) => {
    const path = [ReactEditor.findPath(editor, element)[0]]

    Transforms.setNodes(editor, { type }, { at: path })
  }

  const isTextType = [
    BlockType.H1,
    BlockType.H2,
    BlockType.H3,
    BlockType.BulletedList,
    BlockType.Paragraph,
  ].includes(element.type)

  return (
    <div className='flex items-center justify-between'>
      <BlockMenu onSelect={onInsertBelow} />

      <Menu>
        <Float
          portal
          placement='right-start'
          enter='transition duration-200 ease-out'
          enterFrom='scale-95 opacity-0'
          enterTo='scale-100 opacity-100'
          leave='transition duration-150 ease-in'
          leaveFrom='scale-100 opacity-100'
          leaveTo='scale-95 opacity-0'
          tailwindcssOriginClass
          offset={4}
        >
          <Menu.Button
            ref={setActivatorNodeRef}
            {...listeners}
            className='icon-btn icon-btn-sm cursor-grab w-6'
          >
            <IconGripVertical size={18} />
          </Menu.Button>

          <Menu.Items
            static
            className='flex flex-col min-w-[160px] bg-neutral-800 border border-neutral-700 p-1.5 rounded shadow-md shadow-neutral-950/80 focus:outline-none overflow-hidden'
          >
            {isTextType && (
              <Menu.Item
                as='div'
                className='rounded-md bg-transparent ui-active:bg-neutral-500/5 dark:ui-active:bg-neutral-500/25'
              >
                <BlockTransformMenu type={element.type} onSelect={changeType} />
              </Menu.Item>
            )}

            <Menu.Item
              as='button'
              className='flex items-center rounded gap-2 px-2 py-1.5 text-left text-sm font-semibold bg-transparent ui-active:bg-neutral-400/10'
              onClick={onDelete}
            >
              <IconTrash size={16} className='text-neutral-500' />
              Delete
            </Menu.Item>
          </Menu.Items>
        </Float>
      </Menu>
    </div>
  )
}
