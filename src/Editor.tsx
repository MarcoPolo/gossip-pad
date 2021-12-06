import Prism from 'prismjs'
import React, { useState, useCallback, useMemo } from 'react'
import Caret from "./Caret";
import randomColor from 'randomcolor';
import { useHash } from 'react-use'
import { useSearchParam } from 'react-use'
import Provider from 'y-libp2p'
import { Slate, Editable, withReact } from 'slate-react'
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


const CollabEditor = () => {
  const node = useLibp2p({ peerId: null })
  const prevNode = usePrevious(node)
  const [nickName, setNickName] = React.useState("...")

  const [value, setValue] = useState<Descendant[]>(initialValue)
  const renderElement = useCallback(props => <Element {...props} />, [])
  const yDoc = React.useMemo(() => {
    return new Y.Doc();
  }, [])

  const room: string = useSearchParam(roomParam) || "general";
  const targetMultiAddrs: string[] = JSON.parse(useSearchParam(targetMultiAddrsParam) || "[]")

  const initialEditor = useMemo(() => {
    const editor = withReact(createEditor() as any)
    const sharedType = yDoc.getArray<SyncElement>('content');
    const yjsEditor = withYjs(editor, sharedType);
    console.log("shared", sharedType.toJSON())
    toSharedType(sharedType, [
      // @ts-ignore
      { type: "paragraph", children: [{ text: "" }] },
    ]);
    return yjsEditor
  }, [])

  const [editor, setEditor] = useState<Editor | null>(initialEditor)

  const [provider, setProvider] = useState<Provider | null>(null)

  // For the input if the user picks another room
  const [otherRoom, setOtherRoom] = React.useState(room)

  useConnectToMultiAddrs(node, targetMultiAddrs)

  const color = useMemo(
    () =>
      randomColor({
        seed: node?.peerId?.toB58String(),
        luminosity: "dark",
        format: "rgba",
        alpha: 1,
      }),
    [node]
  );

  React.useEffect(() => {
    if (node === prevNode) {
      return
    }
    console.log("libp2p node:", node, node?.isStarted())


    // @ts-ignore
    window.PeerId = PeerId
    if (!!node) {
      if (nickName === "...") {
        setNickName(node.peerId.toB58String())
      }

      const provider = new Provider(yDoc, node, room);

      console.log("setup provider", provider)
      provider.awareness.setLocalState({
        alphaColor: color.slice(0, -2) + "0.2)",
        color,
        name: node.peerId?.toB58String(),
      });
      setProvider(provider)
    }
  }, [node, prevNode, nickName, setNickName])

  const prevProvider = usePrevious(provider)
  const [userCursorReady, setUserCursorReady] = React.useState(false)
  // Wait until we have a provider to setup the user cursors
  React.useEffect(() => {
    if (prevProvider === provider || !provider) {
      return
    }

    if (editor) {
      // @ts-ignore
      setEditor(withCursor(editor, provider.awareness))
      setUserCursorReady(true)
    } else {
      console.warn("no editor yet?? Shouldn't happen")
    }

  }, [prevProvider, provider, editor, setEditor])


  // Update our nickname whenever it changes
  React.useEffect(() => {
    if (provider) {
      provider.awareness.setLocalState({
        alphaColor: color.slice(0, -2) + "0.2)",
        color,
        name: nickName,
      });
    }

  }, [nickName, provider])

  // Hack – we need to wait until we have an awareness object before using this, but we can't conditionally call hooks
  // @ts-ignore
  const { decorate, cursors } = useCursors((userCursorReady && editor && editor.awareness) ? editor : { awareness: { on: () => { } } })

  const renderLeaf = useCallback((props: any) => <Leaf {...props} />, [
    decorate,
  ]);
  const decorateWrapper = useCallback((...args: any) =>
    // @ts-ignore
    [
      ...decorateMarkdown(...args),
      ...decorate(...args)
    ]
    , [decorate])

  return (
    <div>
      {node && <div>Your PeerID: {node?.peerId.toB58String()}</div>}
      {node && <div>Room: <a target={'_blank'} href={formLinkToShare(node.peerId, node.multiaddrs.map(ma => ma.toString()) || [], room)}>{room}</a></div>}
      {node && <div>Nickname:
        <input type="text" style={{ border: "solid 1px" }} value={nickName} onChange={e => setNickName(e.target.value)} />
      </div>}
      <br />
      <div>Join/create another room:</div>
      <div>
        <input type="text" style={{ border: "solid 1px", marginRight: "8px" }} value={otherRoom} onChange={e => setOtherRoom(e.target.value)} />
        <button onClick={async () => {
          window.open(linkToNewRoom(otherRoom))
        }}>Join (new window)</button>
      </div>
      <br />
      {cursors.length > 0 && <div>Peers connected:</div>}
      <span>{cursors.map(({ data }: any) => <pre key={data.name} style={{ color: data.color }}>{data.name}</pre>)}</span>
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

  // console.log("Here", node.text)
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

function useConnectToMultiAddrs(node: null | Libp2p, targetMultiAddrs: string[]) {
  React.useEffect(() => {
    let earlyCancel = false;

    (async () => {
      const retry = 3
      for (let i = 0; i < retry; i++) {
        for (const multiAddr of targetMultiAddrs) {
          if (earlyCancel) {
            return
          }
          try {
            await node?.dial(multiAddr)
          } catch (e) {
            console.log("Failed to dial target", e)
            await new Promise(resolve => setTimeout(resolve, 500))
            continue
          }

          return
        }
      }
    })();

    return () => {
      earlyCancel = true
    }
  }, [targetMultiAddrs])
}

function formLinkToShare(peerId: PeerId, multiaddrs: string[], room: string) {
  return `/?${targetMultiAddrsParam}=${JSON.stringify(multiaddrs.map(ma => `${ma}/p2p/${peerId.toB58String()}`))}&${roomParam}=${room}`
}

function linkToNewRoom(room: string) {
  return `/?${roomParam}=${room}`
}



export default CollabEditor
