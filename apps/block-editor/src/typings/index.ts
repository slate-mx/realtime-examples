import { TablerIconsProps } from '@tabler/icons-react'
import { BaseEditor, BaseOperation } from 'slate'
import { ReactEditor } from 'slate-react'

export type TablerIcon = (props: TablerIconsProps) => JSX.Element

export enum NodeType {
  Endpoint = 'endpoint',
  Business = 'business',
  Return = 'return',
}

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: CustomElement
    Text: CustomText
    Operation: BaseOperation & { isRemote?: boolean }
  }
}

export enum BlockType {
  H1 = 'h1',
  H2 = 'h2',
  H3 = 'h3',
  Paragraph = 'paragraph',
  BulletedList = 'bulleted-list',
}

export type TextBlock =
  | BlockType.H1
  | BlockType.H2
  | BlockType.H3
  | BlockType.Paragraph
  | BlockType.BulletedList

export type BlockElement = {
  id: string
  children: CustomText[]
}

export type ParagraphElement = BlockElement & {
  type: BlockType.Paragraph
}

export type HeadingElement = BlockElement & {
  type: BlockType.H1 | BlockType.H2 | BlockType.H3
}

export type ListElement = BlockElement & {
  type: BlockType.BulletedList
}

export type CustomElement = HeadingElement | ParagraphElement | ListElement

export type CustomText = {
  text: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
  strikeThrough?: boolean
} & LeafDecoration

type LeafDecoration = {
  placeholder?: string
}

export type Format = 'bold' | 'underline' | 'strikeThrough' | 'italic'

export type Theme = 'light' | 'dark'
