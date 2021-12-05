import React, { useState, useMemo } from 'react'
import { createEditor, Descendant } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'

const PlainTextExample = () => {
  // const [value, setValue] = useState<Descendant[]>([{ text: '' }])
  const [value, setValue] = useState<Descendant[]>([{
    type: 'paragraph',
    children: [
      { text: '' },
    ],
  }])
  // @ts-ignore
  const editor = useMemo(() => withReact(createEditor()), [])
  return (
    <Slate editor={editor} value={value} onChange={value => setValue(value)}>
      <Editable placeholder="Enter some plain text..." />
    </Slate>
  )
}

const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [
      { text: 'This is editable plain text, just like a <textarea>!' },
    ],
  },
]

export default PlainTextExample