import { Menu } from '@headlessui/react'
import { Float } from '@headlessui-float/react'
import { IconPlus } from '@tabler/icons-react'
import { nanoid } from 'nanoid'

import { CustomElement } from '@/typings'
import { blockMenuItems } from '@/utils'

interface BlockMenuProps {
  onSelect: (block: CustomElement) => void
}

export const BlockMenu = ({ onSelect }: BlockMenuProps) => {
  return (
    <Menu>
      <Float
        portal
        enter='transition duration-200 ease-out'
        enterFrom='scale-95 opacity-0'
        enterTo='scale-100 opacity-100'
        leave='transition duration-150 ease-in'
        leaveFrom='scale-100 opacity-100'
        leaveTo='scale-95 opacity-0'
        tailwindcssOriginClass
        offset={4}
      >
        <Menu.Button className='icon-btn icon-btn-sm w-6'>
          <IconPlus size={18} />
        </Menu.Button>

        <Menu.Items className='flex flex-col gap-0.5 w-56 p-1.5 bg-neutral-800 rounded-md shadow-md shadow-neutral-950/80 focus:outline-none max-h-[240px] overflow-scroll'>
          {blockMenuItems.map(({ label, type, icon: Icon }) => (
            <Menu.Item
              as='button'
              key={label}
              className='flex items-center gap-1.5 px-1.5 py-2 rounded-md text-left text-sm font-semibold bg-transparent ui-active:bg-neutral-500/20'
              onClick={() =>
                onSelect({
                  id: nanoid(16),
                  type,
                  children: [{ text: '' }],
                } as CustomElement)
              }
            >
              <Icon size={18} className='text-neutral-500' />
              {label}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Float>
    </Menu>
  )
}
