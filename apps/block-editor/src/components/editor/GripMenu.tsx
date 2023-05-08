import { useRef } from 'react'
import { Menu } from '@headlessui/react'
import { Float } from '@headlessui-float/react'
import { IconGripVertical, IconTrash } from '@tabler/icons-react'
import { DragControls } from 'framer-motion'

interface GripMenuProps {
  controls: DragControls
  onDelete?(): void
}

export const GripMenu = ({ controls, onDelete }: GripMenuProps) => {
  const cursorMove = useRef(0)

  return (
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
          className='reorder-handle group cursor-grab py-1 px-0.5 rounded bg-transparent hover:bg-neutral-500/20 transition-colors touch-none'
          onPointerDown={(e: any) => {
            cursorMove.current = e.pageY
            controls.start(e)
          }}
          onClick={(e: any) => {
            if (Math.abs(e.pageY - cursorMove.current) > 5) {
              e.preventDefault()
            }
          }}
        >
          <IconGripVertical
            size={18}
            className='text-neutral-500 group-hover:text-neutral-50 transition-colors touch-none'
          />
        </Menu.Button>

        <Menu.Items
          static
          className='flex flex-col min-w-[160px] bg-neutral-800 border border-neutral-700 p-1.5 rounded shadow-md shadow-neutral-950/80 focus:outline-none overflow-hidden'
        >
          {!!onDelete && (
            <Menu.Item
              as='button'
              className='flex items-center rounded gap-2 px-2 py-1.5 text-left text-sm font-semibold bg-transparent ui-active:bg-neutral-400/10'
              onClick={onDelete}
            >
              <IconTrash size={16} className='text-neutral-500' />
              Delete
            </Menu.Item>
          )}
        </Menu.Items>
      </Float>
    </Menu>
  )
}
