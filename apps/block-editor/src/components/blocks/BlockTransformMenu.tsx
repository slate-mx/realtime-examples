import { Menu } from '@headlessui/react'
import { Float } from '@headlessui-float/react'
import { IconArrowsExchange, IconChevronRight } from '@tabler/icons-react'

import { BlockType } from '@/typings'
import { BlockCategory, blockMenuItems } from '@/utils'

interface BlockTransformMenuProps {
  type: BlockType
  onSelect: (type: BlockType) => void
}

export const BlockTransformMenu = ({ type, onSelect }: BlockTransformMenuProps) => {
  const items = blockMenuItems.filter((item) => item.category === BlockCategory.Text)

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
        <Menu.Button className='flex items-center rounded gap-2 px-2 py-1.5 text-left text-sm font-semibold bg-transparent ui-active:bg-neutral-400/10'>
          <div className='flex items-center gap-2 whitespace-nowrap'>
            <IconArrowsExchange size={16} className='text-neutral-400 dark:text-neutral-500' />
            Change ({type})
          </div>

          <IconChevronRight size={16} className='text-neutral-500 dark:text-neutral-400' />
        </Menu.Button>

        <Menu.Items className='flex flex-col gap-0.5 p-1.5 bg-neutral-800 rounded-md shadow-md shadow-neutral-950/20 dark:shadow-neutral-950/80 focus:outline-none'>
          {items.map(({ type, icon: Icon }, index) => (
            <Menu.Item
              key={index}
              as='button'
              className='flex items-center justify-center w-8 h-8 rounded-md bg-transparent ui-active:bg-neutral-500/20'
              onClick={() => onSelect(type)}
            >
              <Icon size={20} className='text-neutral-300' />
            </Menu.Item>
          ))}
        </Menu.Items>
      </Float>
    </Menu>
  )
}
