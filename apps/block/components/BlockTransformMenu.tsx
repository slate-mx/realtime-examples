import { BlockType } from '@/types'
import { Float } from '@headlessui-float/react'
import { Menu } from '@headlessui/react'
import { IconArrowsExchange, IconChevronRight } from '@tabler/icons-react'
import { blockMenuItems } from './BlockMenu'

interface BlockTransformMenuProps {
  type: BlockType
  onSelect: (type: BlockType) => void
}

export const BlockTransformMenu = ({ type, onSelect }: BlockTransformMenuProps) => {
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
        <Menu.Button className='w-full px-2 py-2 flex items-center gap-2 justify-between text-left text-sm rounded-md'>
          <div className='flex items-center gap-2 whitespace-nowrap'>
            <IconArrowsExchange size={18} className='text-neutral-400 dark:text-neutral-500' />
            Change ({type})
          </div>

          <IconChevronRight size={16} className='text-neutral-500 dark:text-neutral-400' />
        </Menu.Button>

        <Menu.Items className='flex flex-col gap-0.5 p-1.5 bg-neutral-50 dark:bg-neutral-800 rounded-md shadow-md shadow-neutral-950/20 dark:shadow-neutral-950/80 focus:outline-none'>
          {blockMenuItems.map(({ type, icon: Icon }) => (
            <Menu.Item
              as='button'
              key={type}
              className='flex items-center justify-center w-8 h-8 rounded-md bg-transparent ui-active:bg-primary/10 dark:ui-active:bg-primary/20'
              onClick={() => onSelect(type)}
            >
              <Icon size={20} className='text-neutral-600 dark:text-neutral-300' />
            </Menu.Item>
          ))}
        </Menu.Items>
      </Float>
    </Menu>
  )
}
