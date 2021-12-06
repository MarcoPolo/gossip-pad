import Prism from 'prismjs'
import React, { useState, useCallback, useMemo } from 'react'
import Caret from "./Caret";
import randomColor from 'randomcolor';
import { useHash } from 'react-use'
import { useSearchParam } from 'react-use'
import Provider from 'y-libp2p'
import { Slate, Editable, withReact, ReactEditor } from 'slate-react'
import * as Y from 'yjs'
import { withYjs, SyncElement, toSharedType, withCursor, useCursors } from 'slate-yjs';
import Libp2p from 'libp2p'
import PeerId from 'peer-id'
import libp2p from './libp2p'
import {
  Editor,
  Text,
  createEditor,
  Element as SlateElement,
  Descendant,
} from 'slate'
import { css } from '@emotion/css'

const targetMultiAddrsParam = 'targetMultiAddrs';
const roomParam = 'room';

(function () {
  Prism.languages.markdown = Prism.languages.extend("markup", {}), Prism.languages.insertBefore("markdown", "prolog",
    {
      blockquote: { pattern: /^>(?:[\t ]*>)*/m, alias: "punctuation" },
      code: [
        { pattern: /^(?: {4}|\t).+/m, alias: "keyword" },
        { pattern: /`[^`\n]+`/, alias: "keyword" }
      ],
      title: [{ pattern: /\w+.*(?:\r?\n|\r)(?:==+|--+)/, alias: "important", inside: { punctuation: /==+$|--+$/ } }, { pattern: /(^\s*)#+.+/m, lookbehind: !0, alias: "important", inside: { punctuation: /^#+|#+$/ } }],
      hr: { pattern: /(^\s*)([*-])([\t ]*\2){2,}(?=\s*$)/m, lookbehind: !0, alias: "punctuation" },
      list: { pattern: /(^\s*)(?:[*+-]|\d+\.)(?=[\t ].)/m, lookbehind: !0, alias: "punctuation" },
      "url-reference": { pattern: /!?\[[^\]]+\]:[\t ]+(?:\S+|<(?:\\.|[^>\\])+>)(?:[\t ]+(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\)))?/, inside: { variable: { pattern: /^(!?\[)[^\]]+/, lookbehind: !0 }, string: /(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\))$/, punctuation: /^[\[\]!:]|[<>]/ }, alias: "url" },
      bold: { pattern: /(^|[^\\])(\*|__)(?:(?:\r?\n|\r)(?!\r?\n|\r)|.)+?\2/, lookbehind: !0, inside: { punctuation: /^\*|^__|\*$|__$/ } },
      italic: { pattern: /(^|[^\\])([_])(?:(?:\r?\n|\r)(?!\r?\n|\r)|.)+?\2/, lookbehind: !0, inside: { punctuation: /^[_]|[_]$/ } },
      url: {
        pattern: /!?\[[^\]]+\](?:\([^\s)]+(?:[\t ]+"(?:\\.|[^"\\])*")?\)| ?\[[^\]\n]*\])/, inside: { variable: { pattern: /(!?\[)[^\]]+(?=\]$)/, lookbehind: !0 }, string: { pattern: /"(?:\\.|[^"\\])*"(?=\)$)/ } }
      }
    }), Prism.languages.markdown.bold.inside.url = Prism.util.clone(Prism.languages.markdown.url), Prism.languages.markdown.italic.inside.url = Prism.util.clone(Prism.languages.markdown.url), Prism.languages.markdown.bold.inside.italic = Prism.util.clone(Prism.languages.markdown.italic), Prism.languages.markdown.italic.inside.bold = Prism.util.clone(Prism.languages.markdown.bold);
})();

const MarkdownEditor = (props: {
  editor: Editor,
  decorate: any,
}) => {
  const { editor, decorate } = props
  const [value, setValue] = useState<Descendant[]>(initialValue)
  const decorateWrapper = useCallback((...args: any) =>
    [
      // @ts-ignore
      ...decorateMarkdown(...args),
      // @ts-ignore
      ...decorate(...args)
    ]
    , [decorate])
  const renderElement = useCallback(props => <Element {...props} />, [])
  const renderLeaf = useCallback((props: any) => <Leaf {...props} />, [
    decorate,
  ]);
  return (
    // @ts-ignore
    < Slate editor={editor} value={value} onChange={value => setValue(value)}>
      <div style={{ border: "solid 1px", marginTop: 8, padding: 8 }}>
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder="Write some markdown..."
          spellCheck
          autoFocus
          decorate={decorateWrapper}
        />
      </div>
    </Slate >
  )
}

const Element = ({ attributes, children, element, ...rest }: any) => {
  switch (element.type) {
    case 'block-quote':
      return <blockquote {...attributes}>{children}</blockquote>
    case 'bulleted-list':
      return <ul {...attributes}>{children}</ul>
    case 'heading-one':
      return <h1 {...attributes}>{children}</h1>
    case 'heading-two':
      return <h2 {...attributes}>{children}</h2>
    case 'heading-three':
      return <h3 {...attributes}>{children}</h3>
    case 'heading-four':
      return <h4 {...attributes}>{children}</h4>
    case 'heading-five':
      return <h5 {...attributes}>{children}</h5>
    case 'heading-six':
      return <h6 {...attributes}>{children}</h6>
    case 'list-item':
      return <li {...attributes}>{children}</li>
    default:
      return <p {...attributes}>{children}</p>
  }
}

const initialValue: Descendant[] = [{ type: "paragraph", children: [{ text: "" }] },]

const Leaf: React.FC<RenderLeafProps> = ({ attributes, children, leaf }) => {
  if (leaf.placeholder) {
    return <span {...attributes}>{children}</span>
  }

  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <code>{children}</code>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  const data = leaf.data as any;

  return (
    <span
      {...attributes}
      style={
        {
          position: "relative",
          backgroundColor: data?.alphaColor,
        } as any
      }
      className={css`
        font-weight: ${leaf.bold && 'bold'};
        font-style: ${leaf.italic && 'italic'};
        text-decoration: ${leaf.underlined && 'underline'};
        ${leaf.title &&
        css`
            display: inline-block;
            font-weight: bold;
            font-size: 20px;
            margin: 20px 0 10px 0;
          `}
        ${leaf.list &&
        css`
            padding-left: 10px;
            font-size: 20px;
            line-height: 10px;
          `}
        ${leaf.hr &&
        css`
            display: block;
            text-align: center;
            border-bottom: 2px solid #ddd;
          `}
        ${leaf.blockquote &&
        css`
            display: inline-block;
            border-left: 2px solid #ddd;
            padding-left: 10px;
            color: #aaa;
            font-style: italic;
          `}
        ${leaf.code &&
        css`
            font-family: monospace;
            background-color: #eee;
            padding: 3px;
          `}
      `}
    >
      {leaf.isCaret ? <Caret {...(leaf as any)} /> : null}
      {children}
    </span>
  );
};

function decorateMarkdown([node, path]: any): any {
  const ranges = []

  if (!Text.isText(node)) {
    return ranges
  }

  const getLength = token => {
    if (typeof token === 'string') {
      return token.length
    } else if (typeof token.content === 'string') {
      return token.content.length
    } else {
      return token.content.reduce((l, t) => l + getLength(t), 0)
    }
  }

  const tokens = Prism.tokenize(node.text, Prism.languages.markdown)
  let start = 0

  for (const token of tokens) {
    const length = getLength(token)
    const end = start + length

    if (typeof token !== 'string') {
      ranges.push({
        [token.type]: true,
        anchor: { path, offset: start },
        focus: { path, offset: end },
      })
    }

    start = end
  }

  return ranges
}

export default MarkdownEditor
