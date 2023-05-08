import { JSXElementConstructor, ReactElement } from 'react'
import { Menu } from '@headlessui/react'
import { Float } from '@headlessui-float/react'
import { IconDots } from '@tabler/icons-react'

import { TablerIcon } from '@/typings'

interface DotsMenuProps {
  customButton?: ReactElement<any, string | JSXElementConstructor<any>>
  items: {
    icon: TablerIcon
    label: string
    onClick(): void
  }[]
}

export const DotsMenu = ({ customButton, items }: DotsMenuProps) => {
  return (
    <Menu>
      <Float
        portal
        shift
        autoPlacement={{
          alignment: 'end',
          allowedPlacements: ['bottom-end', 'bottom-start'],
        }}
        enter='transition duration-200 ease-out'
        enterFrom='scale-95 opacity-0'
        enterTo='scale-100 opacity-100'
        leave='transition duration-150 ease-in'
        leaveFrom='scale-100 opacity-100'
        leaveTo='scale-95 opacity-0'
        tailwindcssOriginClass
        offset={4}
      >
        {customButton ?? (
          <Menu.Button className='icon-btn icon-btn-sm shrink-0'>
            <IconDots size={16} />
          </Menu.Button>
        )}

        <Menu.Items className='flex flex-col w-40 bg-neutral-800 border border-neutral-700 p-1.5 rounded shadow-md shadow-neutral-950/80 focus:outline-none overflow-hidden'>
          {items.map(({ icon: Icon, label, onClick }) => (
            <Menu.Item
              key={label}
              as='button'
              className='flex items-center rounded gap-2 px-2 py-1.5 text-left text-sm font-semibold bg-transparent ui-active:bg-neutral-400/10'
              onClick={(e: any) => {
                e.stopPropagation()
                onClick()
              }}
            >
              <Icon size={16} className='text-neutral-500' />
              {label}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Float>
    </Menu>
  )
}
