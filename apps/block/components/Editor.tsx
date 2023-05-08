import isHotkey from 'is-hotkey'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { createEditor, Editor as SlateEditor, Node, Range, Transforms } from 'slate'
import { Editable, ReactEditor, RenderElementProps, Slate, withReact } from 'slate-react'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

import { restrictToVerticalAxis } from '@dnd-kit/modifiers'

import { BlockType, CustomElement, Format } from '../types'
import { removeGlobalCursor, setGlobalCursor, toggleMark, withLayout, withNodeId } from './utils'
import { Leaf } from './Leaf'
import { Block, CreateNewBlockFromBlock } from './Block'
import { nanoid } from 'nanoid'
import { useMe, usePatch, usePatchMe, useStore, useSubscribe } from '@/realtime.config'
import { getListOperations, withShortcuts } from '@/utils'
import { DragOverlayContent } from './DragOverlayContent'
import { SortableElement } from './SortableElement'
import { Toolbar } from './Toolbar'
import { Star } from './Star'

export const PROSE_CONTAINER_ID = 'prose_container'

export const HOTKEYS: Record<string, Format> = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+s': 'strikeThrough',
}

export const Editor = () => {
  const editor = useMemo(() => withShortcuts(withNodeId(withLayout(withReact(createEditor())))), [])

  const blocks = useStore((root) => root.blocks)
  const patch = usePatch()
  const patchMe = usePatchMe()
  const mySelectedBlockId = useMe((me) => me.data?.selectedBlockId)
  const subscribe = useSubscribe()

  const [activeId, setActiveId] = useState<string | null>(null)
  const activeElement = editor.children.find((x) => 'id' in x && x.id === activeId) as
    | CustomElement
    | undefined

  const items = useMemo(() => editor.children.map((element: any) => element.id), [editor.children])

  // Using sensor in order to be able to trigger menu onclick instead of activating draggable right away
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 4,
    },
  })
  const sensors = useSensors(mouseSensor)

  useEffect(() => {
    const { insertBreak } = editor
    // Override editor to insert paragraph or element after inserting new line
    editor.insertBreak = () => {
      if (editor.selection) {
        const previousBlock = editor.children[editor.selection.anchor.path[0]] as CustomElement

        let newBlock

        // Default paragraph new line
        const paragraphBlock: CustomElement = {
          type: BlockType.Paragraph,
          children: [{ text: '' }],
          id: nanoid(),
        }

        // If caret at position 0, convert previous block to empty paragraph
        if (editor.selection.anchor.offset === 0) {
          Transforms.setNodes(editor, paragraphBlock, {
            at: editor.selection,
          })

          // Pass state of old block to new block
          newBlock = previousBlock
        }

        // Create different current element on new line if set in Block.tsx
        if (
          !newBlock &&
          previousBlock?.type &&
          Object.keys(CreateNewBlockFromBlock).includes(previousBlock?.type)
        ) {
          newBlock = CreateNewBlockFromBlock[previousBlock.type]()
        }

        if (!newBlock) {
          newBlock = paragraphBlock
        }

        insertBreak()
        Transforms.setNodes(editor, newBlock as any, {
          at: editor.selection,
        })
      } else {
        insertBreak()
      }
    }
  }, [editor])

  useEffect(() => {
    if (blocks == null) {
      return
    }

    return subscribe(
      (root) => root.blocks,
      (updated, prev) => {
        // We want to apply every operations without intermediate normalization to avoid in
        SlateEditor.withoutNormalizing(editor, () => {
          const ops = getListOperations(prev, updated)

          for (const op of ops) {
            if (op.op === 'insert') {
              if (updated?.[op.index] === editor.children[op.index]) {
                break
              }

              editor.apply({
                type: 'insert_node',
                path: [op.index ?? 0],
                node: op.value as CustomElement,
                isRemote: true,
              })
            } else if (op.op === 'delete') {
              if (updated?.[op.index] === editor.children[op.index]) {
                break
              }

              editor.apply({
                type: 'remove_node',
                path: [op.index ?? 0],
                node: editor.children[op.index ?? 0],
                isRemote: true,
              })
            } else if (op.op === 'move') {
              if (
                editor.children[op.oldIndex] === updated?.[op.oldIndex] &&
                editor.children[op.newIndex] === updated?.[op.newIndex]
              ) {
                break
              }

              editor.apply({
                type: 'move_node',
                path: [op.oldIndex ?? 0],
                newPath: [op.newIndex ?? 0],
                isRemote: true,
              })
            }
          }
        })
      },
    )
  }, [blocks, subscribe])

  const handleDragStart = (event: DragStartEvent) => {
    if (event.active) {
      clearSelection()
      setActiveId(event.active.id as string)
    }

    setGlobalCursor('grabbing')
  }

  const handleDragEnd = (event: DragEndEvent) => {
    removeGlobalCursor('grabbing')

    const overId = event.over?.id
    if (overId == null) {
      setActiveId(null)
    }

    const overIndex = editor.children.findIndex((x: any) => x.id === overId)
    if (overId !== activeId && overIndex !== -1) {
      Transforms.moveNodes(editor, {
        at: [],
        match: (node: Node) => SlateEditor.isBlock(editor, node) && node.id === activeId,
        to: [overIndex],
      })
    }

    setActiveId(null)
  }

  const handleDragCancel = () => {
    setActiveId(null)
  }

  const clearSelection = () => {
    ReactEditor.blur(editor)
    Transforms.deselect(editor)
    window.getSelection()?.empty()
  }

  const renderElement = useCallback((props: RenderElementProps) => {
    return (
      <SortableElement
        {...props}
        renderElement={Block}
        onDelete={() =>
          Transforms.removeNodes(editor, {
            at: ReactEditor.findPath(editor, props.element),
          })
        }
        onInsertBelow={(block: CustomElement) => {
          const path = [ReactEditor.findPath(editor, props.element)[0] + 1]

          Transforms.insertNodes(editor, block, {
            at: path,
          })

          // Defer selection to be able to focus the element we just inserted
          setTimeout(() => {
            ReactEditor.focus(editor)
            Transforms.select(editor, {
              anchor: { path: [path[0], 0], offset: 0 },
              focus: { path: [path[0], 0], offset: 0 },
            })
          }, 0)
        }}
      />
    )
  }, [])

  const onChange = useCallback(() => {
    if (blocks == null) {
      return
    }

    if (editor.selection) {
      const blockId = (editor.children[editor.selection.anchor.path[0]] as CustomElement).id
      if (mySelectedBlockId !== blockId) {
        patchMe({
          selectedBlockId: blockId,
        })
      }
    } else {
      patchMe({
        selectedBlockId: undefined,
      })
    }

    patch((root) => {
      if (
        editor.operations.length === 1 &&
        editor.operations[0].type === 'move_node' &&
        editor.operations[0].isRemote === false
      ) {
        const moveOperation = editor.operations[0]
        const fromIndex = moveOperation.path[0]
        const toIndex = moveOperation.newPath[0]

        var element = root.blocks[fromIndex]
        root.blocks.splice(fromIndex, 1)
        root.blocks.splice(toIndex, 0, element)
        return
      }

      if (editor.operations.every((op) => op.isRemote || op.type === 'set_selection')) {
        return
      }

      // Naive algorithm to patch list. Performance could be vastly improved
      const children = editor.children as CustomElement[]

      // Insert missing blocks
      for (let i = 0; i < editor.children.length; i++) {
        const child = editor.children[i] as CustomElement
        const childIndex = root.blocks.findIndex((block) => block.id === child.id)

        if (childIndex === -1) {
          root.blocks.splice(i, 0, child as any)
        }
      }

      // Delete blocks that are not in Slate children
      for (let i = 0; i < root.blocks.length; i++) {
        const block = root.blocks[i]

        if (block) {
          if (children.some((child) => child.id === block.id) === false) {
            root.blocks.splice(i, 1)
            i--
          }
        }
      }

      // At this point child that are not equals by reference needs to be replaced
      for (let i = 0; i < children.length; i++) {
        const child = children[i]
        const block = root.blocks[i]

        if (!!block && child !== block) {
          root.blocks[i] = child as any
        }
      }
    })
  }, [blocks, mySelectedBlockId, patch, patchMe])

  if (blocks == null) {
    return (
      <div className='w-full py-8 flex justify-center'>
        <div className='animate-spin'>
          <Star />
        </div>
      </div>
    )
  }

  return (
    <div className='relative h-full pb-24 overflow-hidden'>
      <div
        className='prose pt-8 pb-16'
        id={PROSE_CONTAINER_ID}
        onClick={(e) => e.stopPropagation()}
      >
        <div className='w-full max-w-3xl mx-auto px-12 sm:px-16'>
          <Slate editor={editor} value={blocks ?? []} onChange={onChange}>
            <Toolbar />

            <DndContext
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragCancel={handleDragCancel}
              modifiers={[restrictToVerticalAxis]}
              sensors={sensors}
            >
              <SortableContext items={items} strategy={verticalListSortingStrategy}>
                <Editable
                  renderElement={renderElement}
                  renderLeaf={Leaf}
                  /**
                   * Inspired by this great article from https://twitter.com/_jkrsp
                   * https://jkrsp.com/slate-js-placeholder-per-line/
                   **/
                  decorate={([node, path]) => {
                    if (editor.selection != null) {
                      if (
                        !SlateEditor.isEditor(node) &&
                        SlateEditor.string(editor, [path[0]]) === '' &&
                        Range.includes(editor.selection, path) &&
                        Range.isCollapsed(editor.selection)
                      ) {
                        return [
                          {
                            ...editor.selection,
                            placeholder: 'Type...',
                          },
                        ]
                      }
                    }

                    return []
                  }}
                  onKeyDown={(event) => {
                    for (const hotkey in HOTKEYS) {
                      if (isHotkey(hotkey, event as any) && editor.selection) {
                        event.preventDefault()
                        const mark = HOTKEYS[hotkey]
                        toggleMark(editor, mark)
                      }
                    }
                  }}
                />
              </SortableContext>

              {createPortal(
                <DragOverlay adjustScale={false}>
                  {activeElement && (
                    <DragOverlayContent element={activeElement} renderElement={renderElement} />
                  )}
                </DragOverlay>,
                document.getElementById(PROSE_CONTAINER_ID) || document.body,
              )}
            </DndContext>
          </Slate>
        </div>
      </div>
    </div>
  )
}
