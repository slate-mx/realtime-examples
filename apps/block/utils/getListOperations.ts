export type Operation =
  | { op: 'insert'; index: number; value: any }
  | { op: 'move'; oldIndex: number; newIndex: number }
  | { op: 'delete'; index: number }

export const getListOperations = (oldList: any[], newList: any[]): Operation[] => {
  oldList = [...oldList]
  const operations: Operation[] = []
  let i = 0
  let j = 0
  while (i < oldList?.length && j < newList?.length) {
    if (oldList?.[i] === newList?.[j]) {
      i++
      j++
    } else if (newList?.indexOf(oldList[i]) === -1) {
      operations.push({ op: 'delete', index: i })
      oldList.splice(i, 1)
    } else if (oldList.indexOf(newList?.[j]) === -1) {
      operations.push({ op: 'insert', index: i, value: newList?.[j] })
      oldList.splice(i, 0, newList?.[j])
      i++
      j++
    } else {
      const k = oldList?.indexOf(newList?.[j], i)
      operations.push({ op: 'move', oldIndex: k, newIndex: i })
      const temp = oldList?.[k]
      for (let l = k; l > i; l--) {
        oldList[l] = oldList?.[l - 1]
      }
      oldList[i] = temp
    }
  }
  while (i < oldList.length) {
    operations.push({ op: 'delete', index: i })
    oldList?.splice(i, 1)
  }
  while (j < newList?.length) {
    operations.push({ op: 'insert', index: i++, value: newList?.[j++] })
  }
  return operations
}
