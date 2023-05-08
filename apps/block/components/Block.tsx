import { DefaultElement, RenderElementProps } from 'slate-react'
import { BlockType, CustomElement } from '../types'
import { nanoid } from 'nanoid'

// If new block created when old block selected, create the following block
// Example: create checkbox block, press enter, new unchecked checkbox is created
export const CreateNewBlockFromBlock: Record<string, () => CustomElement> = {
  [BlockType.BulletedList]: () => ({ type: BlockType.BulletedList, id: nanoid(), children: [] }),
}

// Note: {children} must be rendered in every element otherwise bugs occur
// https://docs.slatejs.org/api/nodes/element#rendering-void-elements
// https://github.com/ianstormtaylor/slate/issues/3930
export const Block = ({ element, children, attributes }: RenderElementProps) => {
  if (element.type === BlockType.Paragraph) {
    return (
      <p {...attributes} className='px-2 text-base my-2 tracking-normal leading-[1.5rem]'>
        {children}
      </p>
    )
  }

  if (element.type === BlockType.H1) {
    return (
      <h1
        {...attributes}
        className='px-2 text-4xl font-semibold mt-8 mb-2 tracking-tight leading-[2.5rem]'
      >
        {children}
      </h1>
    )
  }

  if (element.type === BlockType.H2) {
    return (
      <h2
        {...attributes}
        className='px-2 text-2xl font-semibold mt-5 mb-2 tracking-tight leading-[2rem]'
      >
        {children}
      </h2>
    )
  }

  if (element.type === BlockType.H3) {
    return (
      <h3
        {...attributes}
        className='px-2 text-xl font-semibold mt-3 mb-2 tracking-tight leading-[1.75rem]'
      >
        {children}
      </h3>
    )
  }

  if (element.type === BlockType.BulletedList) {
    return (
      <div {...attributes}>
        <ul className='px-2 my-2'>
          <li className='text-base tracking-normal leading-[1.5rem] flex items-start grow before:content-["•"] before:ml-1 before:mr-3 before:grow-0 before:shrink-0 before:inline-flex before:items-center before:content-center'>
            {children}
          </li>
        </ul>
      </div>
    )
  }

  return (
    <DefaultElement element={element} attributes={attributes}>
      {children}
    </DefaultElement>
  )
}
