import { RenderLeafProps } from 'slate-react'

export const Leaf = ({ leaf, children, attributes }: RenderLeafProps) => {
  if (leaf.placeholder) {
    return (
      <>
        <span
          className='absolute text-neutral-400 dark:text-neutral-500 pointer-events-none select-none -z-[1]'
          contentEditable={false}
        >
          {leaf.placeholder}
        </span>
        <span {...attributes}>{children}</span>
      </>
    )
  }

  if (leaf.bold) {
    children = <strong>{children}</strong>
  }

  if (leaf.italic) {
    children = <em>{children}</em>
  }

  if (leaf.underline) {
    children = <u>{children}</u>
  }

  if (leaf.strikeThrough) {
    children = <del>{children}</del>
  }

  return <span {...attributes}>{children}</span>
}
