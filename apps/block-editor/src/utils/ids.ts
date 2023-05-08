import { customAlphabet, urlAlphabet } from 'nanoid'
const alphabetWithoutDashes = urlAlphabet.replace(/-/g, '')
const customNanoId = customAlphabet(alphabetWithoutDashes, 16)

export const newSlateId = () => {
  return customNanoId()
}
