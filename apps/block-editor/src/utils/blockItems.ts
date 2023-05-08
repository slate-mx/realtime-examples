import {
  IconAlphabetLatin,
  IconH1,
  IconH2,
  IconH3,
  IconList,
  TablerIconsProps,
} from '@tabler/icons-react'

import { BlockType } from '@/typings'

export enum BlockCategory {
  Text = 'Text blocks',
  Operation = 'Operation blocks',
  Slate = 'Slates',
}

export type BlockItem = {
  name: string
  label: string
  type: BlockType
  icon: (props: TablerIconsProps) => JSX.Element
  category: BlockCategory
}

export const blockMenuItems: BlockItem[] = [
  {
    name: 'paragraph',
    label: 'Text',
    type: BlockType.Paragraph,
    icon: IconAlphabetLatin,
    category: BlockCategory.Text,
  },
  {
    name: 'heading_1',
    label: 'Heading 1',
    type: BlockType.H1,
    icon: IconH1,
    category: BlockCategory.Text,
  },
  {
    name: 'heading_2',
    label: 'Heading 2',
    type: BlockType.H2,
    icon: IconH2,
    category: BlockCategory.Text,
  },
  {
    name: 'heading_3',
    label: 'Heading 3',
    type: BlockType.H3,
    icon: IconH3,
    category: BlockCategory.Text,
  },
  {
    name: 'bullet_list',
    label: 'Bulleted list',
    type: BlockType.BulletedList,
    icon: IconList,
    category: BlockCategory.Text,
  },
]
