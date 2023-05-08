import { DefaultElement, RenderElementProps } from 'slate-react'

import { BlockType } from '@/typings'

export const Block = ({ element, children, attributes }: RenderElementProps) => {
  if (element.type === BlockType.Paragraph) {
    return (
      <p {...attributes} className='p-1 text-base tracking-normal leading-[1.5rem]'>
        {children}
      </p>
    )
  }

  if (element.type === BlockType.H1) {
    return (
      <h1 {...attributes} className='p-1 text-3xl font-semibold tracking-tight leading-[2.5rem]'>
        {children}
      </h1>
    )
  }

  if (element.type === BlockType.H2) {
    return (
      <h2 {...attributes} className='p-1 text-2xl font-semibold tracking-tight leading-[2rem]'>
        {children}
      </h2>
    )
  }

  if (element.type === BlockType.H3) {
    return (
      <h3 {...attributes} className='p-1 text-lg font-semibold tracking-tight leading-[1.75rem]'>
        {children}
      </h3>
    )
  }

  if (element.type === BlockType.BulletedList) {
    return (
      <div {...attributes}>
        <ul className='p-1'>
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
