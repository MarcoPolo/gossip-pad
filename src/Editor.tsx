import Prism from 'prismjs'
import React, { useState, useCallback, useMemo } from 'react'
import Caret from "./Caret";
import randomColor from 'randomcolor';
import { useHash } from 'react-use'
import Provider from 'y-libp2p'
import { Slate, Editable, withReact } from 'slate-react'
import * as Y from 'yjs'
import { withYjs, SyncElement, toSharedType, withCursor, useCursors } from 'slate-yjs';
import Libp2p from 'libp2p'
import PeerId from 'peer-id'
import libp2p from './libp2p'
import {
  Editor,
  Transforms,
  Range,
  Point,
  Text,
  createEditor,
  Element as SlateElement,
  Descendant,
} from 'slate'
import { css } from '@emotion/css'

// import { withHistory } from 'slate-history'
// import { BulletedListElement } from './custom-types'

(function () {
  Prism.languages.markdown = Prism.languages.extend("markup", {}), Prism.languages.insertBefore("markdown", "prolog", { blockquote: { pattern: /^>(?:[\t ]*>)*/m, alias: "punctuation" }, code: [{ pattern: /^(?: {4}|\t).+/m, alias: "keyword" }, { pattern: /``.+?``|`[^`\n]+`/, alias: "keyword" }], title: [{ pattern: /\w+.*(?:\r?\n|\r)(?:==+|--+)/, alias: "important", inside: { punctuation: /==+$|--+$/ } }, { pattern: /(^\s*)#+.+/m, lookbehind: !0, alias: "important", inside: { punctuation: /^#+|#+$/ } }], hr: { pattern: /(^\s*)([*-])([\t ]*\2){2,}(?=\s*$)/m, lookbehind: !0, alias: "punctuation" }, list: { pattern: /(^\s*)(?:[*+-]|\d+\.)(?=[\t ].)/m, lookbehind: !0, alias: "punctuation" }, "url-reference": { pattern: /!?\[[^\]]+\]:[\t ]+(?:\S+|<(?:\\.|[^>\\])+>)(?:[\t ]+(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\)))?/, inside: { variable: { pattern: /^(!?\[)[^\]]+/, lookbehind: !0 }, string: /(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\))$/, punctuation: /^[\[\]!:]|[<>]/ }, alias: "url" }, bold: { pattern: /(^|[^\\])(\*|__)(?:(?:\r?\n|\r)(?!\r?\n|\r)|.)+?\2/, lookbehind: !0, inside: { punctuation: /^\*|^__|\*$|__$/ } }, italic: { pattern: /(^|[^\\])([_])(?:(?:\r?\n|\r)(?!\r?\n|\r)|.)+?\2/, lookbehind: !0, inside: { punctuation: /^[_]|[_]$/ } }, url: { pattern: /!?\[[^\]]+\](?:\([^\s)]+(?:[\t ]+"(?:\\.|[^"\\])*")?\)| ?\[[^\]\n]*\])/, inside: { variable: { pattern: /(!?\[)[^\]]+(?=\]$)/, lookbehind: !0 }, string: { pattern: /"(?:\\.|[^"\\])*"(?=\)$)/ } } } }), Prism.languages.markdown.bold.inside.url = Prism.util.clone(Prism.languages.markdown.url), Prism.languages.markdown.italic.inside.url = Prism.util.clone(Prism.languages.markdown.url), Prism.languages.markdown.bold.inside.italic = Prism.util.clone(Prism.languages.markdown.italic), Prism.languages.markdown.italic.inside.bold = Prism.util.clone(Prism.languages.markdown.bold);
})();



function usePrevious<T>(value: T) {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = React.useRef<T | null>(null);

  // Store current value in ref
  React.useEffect(() => {
    ref.current = value;
  }, [value]); // Only re-run if value changes

  // Return previous value (happens before update in useEffect above)
  return ref.current;
}

function useLibp2p({ peerId }: { peerId: PeerId | null }) {
  const prevPeerId = usePrevious(peerId)
  const [node, setNode] = React.useState<null | Libp2p>(null)
  const firstPass = React.useRef(true)
  React.useEffect(() => {
    if (peerId === prevPeerId && !firstPass.current) {
      return
    }
    node?.stop()

    firstPass.current = false
    console.log("peers are different", peerId, prevPeerId)

    let hoistedNode: Libp2p | null = null
    libp2p({ peerId }).then(async (p2pNode) => {
      await p2pNode.start()
      hoistedNode = p2pNode
      setNode(p2pNode)
    }).catch(e => {
      console.error("Failed to start libp2p", e)
    })
  }, [peerId, prevPeerId, node, setNode])

  return node
}

const SHORTCUTS = {
  '*': 'list-item',
  '-': 'list-item',
  '+': 'list-item',
  '>': 'block-quote',
  // '#': 'heading-one',
  // '##': 'heading-two',
  // '###': 'heading-three',
  // '####': 'heading-four',
  // '#####': 'heading-five',
  // '######': 'heading-six',
}

const MarkdownShortcutsExample = () => {
  const node = useLibp2p({ peerId: null })
  const prevNode = usePrevious(node)

  const [value, setValue] = useState<Descendant[]>(initialValue)
  const renderElement = useCallback(props => <Element {...props} />, [])
  const yDoc = React.useMemo(() => {
    return new Y.Doc();
  }, [])
  const [editor, setEditor] = useState<Editor | null>(null)
  // const editor = useMemo(
  //   // () => withShortcuts(withReact(withHistory(createEditor()))),
  //   () => {
  //     const editor = withShortcuts(withReact(createEditor() as any))

  //     const sharedType = yDoc.getArray<SyncElement>('content');
  //     const yjsEditor = withYjs(editor, sharedType);
  //     toSharedType(sharedType, [
  //       { type: "paragraph", children: [{ text: "" }] },
  //     ]);

  //     return yjsEditor
  //     // return editor

  //   },
  //   []
  // )



  const color = useMemo(
    () =>
      randomColor({
        luminosity: "dark",
        format: "rgba",
        alpha: 1,
      }),
    []
  );

  const [topic, setTopicHash] = useHash()

  // const [targetPeerFromHash,] = useHash()
  // const lastTargetPeer = usePrevious(targetPeerFromHash)
  // React.useEffect(() => {
  //   (async () => {
  //     const retryLimit = 10
  //     let success = false
  //     for (let i = 0; i < retryLimit; i++) {
  //       try {
  //         if (!!targetPeerFromHash && targetPeerFromHash.length > 1) {
  //           console.log("targetPeerFromHash", targetPeerFromHash)
  //           const peerId = PeerId.createFromB58String(targetPeerFromHash.substr(1))
  //           await node?.dial(peerId)
  //         }
  //         success = true
  //         console.log("success dialed peer")
  //         break
  //       } catch (e) {
  //         console.warn("Failed to dial peer", e)
  //         await new Promise(resolve => setTimeout(resolve, 1000))
  //       }
  //     }
  //     if (!success) {
  //       console.error("Failed to dial peer")
  //     }
  //   })()
  // }, [targetPeerFromHash, node])

  React.useEffect(() => {
    console.log("node", node, node?.isStarted())
    if (node === prevNode) {
      return
    }

    // @ts-ignore
    window.PeerId = PeerId
    if (!!node) {
      const provider = new Provider(yDoc, node, topic);
      console.log("setup provider", provider)
      const editor = withShortcuts(withReact(createEditor() as any))

      const sharedType = yDoc.getArray<SyncElement>('content');
      const yjsEditor = withYjs(editor, sharedType);
      toSharedType(sharedType, [
        { type: "paragraph", children: [{ text: "" }] },
      ]);

      const cursorEditor = withCursor(yjsEditor, provider.awareness);
      // provider.awareness.on('update', () => {
      //   console.log("awareness update")
      // })

      provider.awareness.setLocalState({
        alphaColor: color.slice(0, -2) + "0.2)",
        color,
        name: node.peerId?.toB58String(),
      });


      setEditor(cursorEditor)
      // return editor
    }

    // node?.on('peer:discovery', (peerId) => {
    //   console.log(`Found peer ${peerId.toB58String()}`)
    // })

    // // Listen for new connections to peers
    // node?.connectionManager.on('peer:connect', (connection) => {
    //   console.log(`Connected to ${connection.remotePeer.toB58String()}`)
    // })

    // // Listen for peers disconnecting
    // node?.connectionManager.on('peer:disconnect', (connection) => {
    //   console.log(`Disconnected from ${connection.remotePeer.toB58String()}`)
    // });

    (async () => {
      console.log("Started libp2p", node?.multiaddrs)
    })().catch(e => {
      console.error("Failed to start libp2p", e)
    })

  }, [node, prevNode])

  // @ts-ignore
  const { decorate, cursors } = useCursors(editor || { awareness: { on: () => { } } })

  const renderLeaf = useCallback((props: any) => <Leaf {...props} />, [
    decorate,
  ]);

  const [targetAddr, setTargetAddr] = React.useState("")

  const decorateWrapper = useCallback((...args: any) =>
    // @ts-ignore
    [
      ...decorateMarkdown(...args),
      ...decorate(...args)
    ]
    , [decorate])

  return (
    <div>
      <div>Your addresses:</div>
      {node?.multiaddrs?.map(ma => <div key={ma.toString()}>{`${ma.toString()}/p2p/${node?.peerId.toB58String()}`}</div>)}
      <div>Connect to multiaddr:</div>
      <div>
        <input type="text" style={{ border: "solid 1px" }} value={targetAddr} onChange={e => setTargetAddr(e.target.value)} />
        <button onClick={async () => {
          await node?.dial(targetAddr)
          console.log("dialed", targetAddr)
        }}>Connect</button>
      </div>
      {cursors.length > 0 && <div>Peers connected:</div>}
      <span>{cursors.map(({ data }: any) => <pre key={data.name} style={{ color: data.color }}>{data.name}</pre>)}</span>


      {/* <Slate editor={editor} value={value} onChange={value => setValue(value)}> */}
      {!editor && <div>Loading editor...</div>}
      {!!editor && <Slate editor={editor} value={value} onChange={value => setValue(value)}>
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
      </Slate>}
    </div>
  )
}

const withShortcuts = (editor: any) => {
  const { deleteBackward, insertText } = editor

  editor.insertText = (text: any) => {
    const { selection } = editor

    if (text === ' ' && selection && Range.isCollapsed(selection)) {
      const { anchor } = selection
      const block = Editor.above(editor, {
        match: n => Editor.isBlock(editor, n),
      })
      const path = block ? block[1] : []
      const start = Editor.start(editor, path)
      const range = { anchor, focus: start }
      const beforeText = Editor.string(editor, range)
      // @ts-ignore
      const type = SHORTCUTS[beforeText]

      if (type) {
        Transforms.select(editor, range)
        Transforms.delete(editor)
        const newProperties: Partial<SlateElement> = {
          // @ts-ignore
          type,
        }
        Transforms.setNodes<SlateElement>(editor, newProperties, {
          match: n => Editor.isBlock(editor, n),
        })

        if (type === 'list-item') {
          // const list: BulletedListElement = {
          const list: any = {
            type: 'bulleted-list',
            children: [],
          }
          Transforms.wrapNodes(editor, list, {
            match: n =>
              !Editor.isEditor(n) &&
              SlateElement.isElement(n) &&
              n.type === 'list-item',
          })
        }

        return
      }
    }

    insertText(text)
  }

  editor.deleteBackward = (...args) => {
    const { selection } = editor

    if (selection && Range.isCollapsed(selection)) {
      const match = Editor.above(editor, {
        match: n => Editor.isBlock(editor, n),
      })

      if (match) {
        const [block, path] = match
        const start = Editor.start(editor, path)

        if (
          !Editor.isEditor(block) &&
          SlateElement.isElement(block) &&
          block.type !== 'paragraph' &&
          Point.equals(selection.anchor, start)
        ) {
          const newProperties: Partial<SlateElement> = {
            type: 'paragraph',
          }
          Transforms.setNodes(editor, newProperties)

          if (block.type === 'list-item') {
            Transforms.unwrapNodes(editor, {
              match: n =>
                !Editor.isEditor(n) &&
                SlateElement.isElement(n) &&
                n.type === 'bulleted-list',
              split: true,
            })
          }

          return
        }
      }

      deleteBackward(...args)
    }
  }

  return editor
}

const Element = ({ attributes, children, element }) => {
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

const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [
      {
        text:
          'The editor gives you full control over the logic you can add. For example, it\'s fairly common to want to add markdown-like shortcuts to editors. So that, when you start a line with "> " you get a blockquote that looks like this:',
      },
    ],
  },
  {
    type: 'block-quote',
    children: [{ text: 'A wise quote.' }],
  },
  {
    type: 'paragraph',
    children: [
      {
        text:
          'Order when you start a line with "## " you get a level-two heading, like this:',
      },
    ],
  },
  {
    type: 'heading-two',
    children: [{ text: 'Try it out!' }],
  },
  {
    type: 'paragraph',
    children: [
      {
        text:
          'Try it out for yourself! Try starting a new line with ">", "-", or "#"s.',
      },
    ],
  },
]

const Leaf: React.FC<RenderLeafProps> = ({ attributes, children, leaf }) => {
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

const Leaf2 = ({ attributes, children, leaf }: any) => {
  return (
    <span
      {...attributes}
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
      {children}
    </span>
  )
}

function decorateMarkdown([node, path]: any) {
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

export default MarkdownShortcutsExample
