import { BlockType, CustomElement } from '@/types'
import { Float } from '@headlessui-float/react'
import { Menu, Transition } from '@headlessui/react'
import {
  IconAlphabetLatin,
  IconH1,
  IconH2,
  IconH3,
  IconList,
  IconPlus,
  TablerIconsProps,
} from '@tabler/icons-react'
import { nanoid } from 'nanoid'
import { ReactNode } from 'react'

type BlockItem = {
  label: string
  type: BlockType
  icon: (props: TablerIconsProps) => JSX.Element
}

export const blockMenuItems: BlockItem[] = [
  {
    label: 'Heading 1',
    type: BlockType.H1,
    icon: IconH1,
  },
  {
    label: 'Heading 2',
    type: BlockType.H2,
    icon: IconH2,
  },
  {
    label: 'Heading 3',
    type: BlockType.H3,
    icon: IconH3,
  },
  {
    label: 'Text',
    type: BlockType.Paragraph,
    icon: IconAlphabetLatin,
  },
  {
    label: 'Bulleted list',
    type: BlockType.BulletedList,
    icon: IconList,
  },
]

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
        <Menu.Button className='icon-btn icon-btn-sm'>
          <IconPlus size={18} />
        </Menu.Button>

        <Menu.Items className='flex flex-col gap-0.5 w-40 p-1.5 bg-neutral-50 dark:bg-neutral-800 rounded-md shadow-md shadow-neutral-950/20 dark:shadow-neutral-950/80 focus:outline-none'>
          {blockMenuItems.map(({ label, type, icon: Icon }) => (
            <Menu.Item
              as='button'
              key={type}
              className='flex items-center gap-1.5 px-1.5 py-2 rounded-md text-left text-sm font-semibold bg-transparent ui-active:bg-primary/10 dark:ui-active:bg-primary/20'
              onClick={() =>
                onSelect({
                  id: nanoid(16),
                  type: type,
                  children: [{ text: '' }],
                })
              }
            >
              <Icon size={18} className='text-neutral-400 dark:text-neutral-500' />
              {label}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Float>
    </Menu>
  )
}
