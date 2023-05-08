import { useCallback, useEffect, useRef, useState } from 'react'
import { useClickOutside, useKeyboardEvent } from '@react-hookz/web'
import { AnimatePresence, motion } from 'framer-motion'
import groupBy from 'lodash/groupBy'
import { matchSorter } from 'match-sorter'
import { nanoid } from 'nanoid'
import { Editor, Transforms } from 'slate'
import { ReactEditor, useSlate } from 'slate-react'

import { CustomElement } from '@/typings'
import { BlockCategory, blockMenuItems } from '@/utils'

interface SlashMenuProps {
  isOpen: boolean
  onClose(): void
}

export const SlashMenu = ({ isOpen, onClose }: SlashMenuProps) => {
  const editor = useSlate()

  const ref = useRef<HTMLDivElement>(null)
  const [activeName, setActiveName] = useState('')

  const [query, setQuery] = useState('')
  const [pos, setPos] = useState({ x: 0, y: 0, slash: 0 })

  const filteredItems = matchSorter(blockMenuItems, query.replace('/', ''), {
    keys: ['label'],
    baseSort: () => 0, // Disabling the default alphabetical sorting
  })

  const itemGroups = groupBy(filteredItems, 'category')

  const selectItem = useCallback(() => {
    if (!filteredItems) {
      return
    }

    const item = filteredItems.find((item: any) => item.name === activeName)

    if (!item) {
      return
    }

    // Preventing delete on backspace for non-text blocks
    const isTextBlock = item.category === BlockCategory.Text
    const text = isTextBlock ? '' : 'prevent-backspace-delete'

    const block = { id: nanoid(16), type: item.type, children: [{ text: text }] } as CustomElement

    if (item) {
      onClose()
      if (editor.selection) {
        const range = Editor.unhangRange(editor, editor.selection, {
          voids: true,
        })

        const currentBlock = editor.children[
          (editor.selection as any).anchor.path[0]
        ] as CustomElement
        const firstText = currentBlock?.children?.[0]?.text

        Transforms.delete(editor, {
          at: { path: [range.anchor.path[0], 0], offset: pos.slash - 1 },
          unit: 'word',
        })

        const isEmptyLine = firstText === `/${query}`

        if (isEmptyLine) {
          Transforms.setNodes(
            editor,
            { ...block, type: block.type }, // TODO: Make sure it's alright to change the ID here
            { at: [range.anchor.path[0]] },
          )
        } else {
          // TODO: Delete the command in the focused line above
          Transforms.insertNodes(editor, block, {
            at: [range.anchor.path[0] + 1],
          })
          ReactEditor.focus(editor)
          Transforms.select(editor, {
            anchor: { path: [range.anchor.path[0] + 1, 0], offset: 0 },
            focus: { path: [range.focus.path[0] + 1, 0], offset: 0 },
          })
        }
      }
    }
  }, [onClose, activeName, query])

  useKeyboardEvent(
    'Escape',
    () => {
      if (!isOpen) {
        return
      }

      onClose()
    },
    [onClose, isOpen],
  )

  useKeyboardEvent(
    'Enter',
    (e) => {
      if (!isOpen) {
        return
      }

      e.preventDefault()
      selectItem()
    },
    [onClose, isOpen],
  )

  useKeyboardEvent(
    'ArrowDown',
    (e) => {
      if (!isOpen) {
        return
      }

      e.preventDefault()
      const activeIndex = filteredItems.findIndex((item: any) => item.name === activeName)
      if (activeIndex < filteredItems?.length - 1) {
        const nextActiveName = filteredItems[activeIndex + 1].name

        setActiveName(nextActiveName)

        const activeItem = document.querySelector(`#${nextActiveName}`)
        activeItem?.scrollIntoView({ block: 'nearest' })
      }
    },
    [onClose, isOpen],
  )

  useKeyboardEvent(
    'ArrowUp',
    (e) => {
      if (!isOpen) {
        return
      }

      e.preventDefault()
      const activeIndex = filteredItems.findIndex((item: any) => item.name === activeName)
      if (activeIndex > 0) {
        const nextActiveName = filteredItems[activeIndex - 1].name

        setActiveName(nextActiveName)

        const activeItem = document.querySelector(`#${nextActiveName}`)
        activeItem?.scrollIntoView({ block: 'nearest' })
      }
    },
    [onClose, isOpen],
  )

  useKeyboardEvent(
    isOpen,
    () => {
      setTimeout(() => {
        if (pos.slash === 0) {
          return
        }

        const domSelection = document.getSelection()
        if (domSelection == null || domSelection.rangeCount === 0) {
          return
        }

        const domRange = domSelection.getRangeAt(0)

        const range = domRange.cloneRange()
        range.collapse(true)
        const caretPos = range.startOffset

        const wholeContent = domSelection.anchorNode?.textContent?.trim() as string
        const newQuery = wholeContent.substring(pos.slash, wholeContent?.length)

        if (pos.slash > caretPos || !wholeContent.length) {
          onClose()
          return
        }

        setQuery(newQuery)
      }, 0)
    },
    [isOpen, pos, setQuery],
  )

  useClickOutside(ref, () => {
    onClose()
  })

  useEffect(() => {
    setActiveName(filteredItems?.[0]?.name)
  }, [query])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        const domSelection = window.getSelection()
        if (domSelection == null || domSelection.rangeCount === 0) {
          return
        }

        const domRange = domSelection.getRangeAt(0)
        const rect = domRange.getBoundingClientRect()

        setPos({
          x: rect.x + window.scrollX,
          y: rect.y + window.scrollY + 24,
          slash: domRange.startOffset,
        })
      }, 0)
    } else {
      setQuery('')
      setPos({ x: 0, y: 0, slash: 0 })
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && pos.slash !== 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1, transition: { duration: 0.1 } }}
          exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.1 } }}
          className='absolute'
          style={{ top: pos.y, left: pos.x }}
        >
          <div
            ref={ref}
            className='relative z-50 bg-neutral-800 rounded-md p-1 flex flex-col shadow-md shadow-neutral-950/20 w-56 max-h-[320px] overflow-scroll'
          >
            {!filteredItems.length && (
              <div className='p-1 text-sm text-neutral-500'>No matching blocks</div>
            )}

            {Object.keys(itemGroups)?.map((group, xIndex) => {
              const items = itemGroups[group]

              return (
                <div key={group} className=''>
                  <div className='text-sm text-neutral-500 px-1 mt-1.5 mb-0.5'>{group}</div>

                  {items.map(({ name, label, icon: Icon }, yIndex) => (
                    <button
                      key={`${xIndex}${yIndex}`}
                      id={name}
                      tabIndex={-1}
                      onMouseEnter={() => setActiveName(name)}
                      className={`w-full flex items-center gap-1.5 px-1.5 py-2 rounded-md text-left text-sm font-semibold transition-colors ${
                        name === activeName ? 'bg-neutral-500/20' : 'bg-transparent'
                      }`}
                      onClick={selectItem}
                    >
                      <Icon size={18} className='text-neutral-400 dark:text-neutral-500' />
                      {label}
                    </button>
                  ))}
                </div>
              )
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
