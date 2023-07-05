"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prismjs_1 = __importDefault(require("prismjs"));
const react_1 = __importStar(require("react"));
const Caret_1 = __importDefault(require("./Caret"));
const randomcolor_1 = __importDefault(require("randomcolor"));
const react_use_1 = require("react-use");
const y_libp2p_1 = __importDefault(require("y-libp2p"));
const slate_react_1 = require("slate-react");
const Y = __importStar(require("yjs"));
const slate_yjs_1 = require("slate-yjs");
const peer_id_1 = __importDefault(require("peer-id"));
const libp2p_1 = __importDefault(require("./libp2p"));
const slate_1 = require("slate");
const css_1 = require("@emotion/css");
const targetMultiAddrsParam = 'targetMultiAddrs';
const roomParam = 'room';
// import { withHistory } from 'slate-history'
// import { BulletedListElement } from './custom-types'
(function () {
    prismjs_1.default.languages.markdown = prismjs_1.default.languages.extend("markup", {}), prismjs_1.default.languages.insertBefore("markdown", "prolog", { blockquote: { pattern: /^>(?:[\t ]*>)*/m, alias: "punctuation" }, code: [{ pattern: /^(?: {4}|\t).+/m, alias: "keyword" }, { pattern: /``.+?``|`[^`\n]+`/, alias: "keyword" }], title: [{ pattern: /\w+.*(?:\r?\n|\r)(?:==+|--+)/, alias: "important", inside: { punctuation: /==+$|--+$/ } }, { pattern: /(^\s*)#+.+/m, lookbehind: !0, alias: "important", inside: { punctuation: /^#+|#+$/ } }], hr: { pattern: /(^\s*)([*-])([\t ]*\2){2,}(?=\s*$)/m, lookbehind: !0, alias: "punctuation" }, list: { pattern: /(^\s*)(?:[*+-]|\d+\.)(?=[\t ].)/m, lookbehind: !0, alias: "punctuation" }, "url-reference": { pattern: /!?\[[^\]]+\]:[\t ]+(?:\S+|<(?:\\.|[^>\\])+>)(?:[\t ]+(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\)))?/, inside: { variable: { pattern: /^(!?\[)[^\]]+/, lookbehind: !0 }, string: /(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\))$/, punctuation: /^[\[\]!:]|[<>]/ }, alias: "url" }, bold: { pattern: /(^|[^\\])(\*|__)(?:(?:\r?\n|\r)(?!\r?\n|\r)|.)+?\2/, lookbehind: !0, inside: { punctuation: /^\*|^__|\*$|__$/ } }, italic: { pattern: /(^|[^\\])([_])(?:(?:\r?\n|\r)(?!\r?\n|\r)|.)+?\2/, lookbehind: !0, inside: { punctuation: /^[_]|[_]$/ } }, url: { pattern: /!?\[[^\]]+\](?:\([^\s)]+(?:[\t ]+"(?:\\.|[^"\\])*")?\)| ?\[[^\]\n]*\])/, inside: { variable: { pattern: /(!?\[)[^\]]+(?=\]$)/, lookbehind: !0 }, string: { pattern: /"(?:\\.|[^"\\])*"(?=\)$)/ } } } }), prismjs_1.default.languages.markdown.bold.inside.url = prismjs_1.default.util.clone(prismjs_1.default.languages.markdown.url), prismjs_1.default.languages.markdown.italic.inside.url = prismjs_1.default.util.clone(prismjs_1.default.languages.markdown.url), prismjs_1.default.languages.markdown.bold.inside.italic = prismjs_1.default.util.clone(prismjs_1.default.languages.markdown.italic), prismjs_1.default.languages.markdown.italic.inside.bold = prismjs_1.default.util.clone(prismjs_1.default.languages.markdown.bold);
})();
function usePrevious(value) {
    // The ref object is a generic container whose current property is mutable ...
    // ... and can hold any value, similar to an instance property on a class
    const ref = react_1.default.useRef(null);
    // Store current value in ref
    react_1.default.useEffect(() => {
        ref.current = value;
    }, [value]); // Only re-run if value changes
    // Return previous value (happens before update in useEffect above)
    return ref.current;
}
function useLibp2p({ peerId }) {
    const prevPeerId = usePrevious(peerId);
    const [node, setNode] = react_1.default.useState(null);
    const firstPass = react_1.default.useRef(true);
    react_1.default.useEffect(() => {
        if (peerId === prevPeerId && !firstPass.current) {
            return;
        }
        node === null || node === void 0 ? void 0 : node.stop();
        firstPass.current = false;
        console.log("peers are different", peerId, prevPeerId);
        let hoistedNode = null;
        (0, libp2p_1.default)({ peerId }).then((p2pNode) => __awaiter(this, void 0, void 0, function* () {
            yield p2pNode.start();
            hoistedNode = p2pNode;
            setNode(p2pNode);
        })).catch(e => {
            console.error("Failed to start libp2p", e);
        });
    }, [peerId, prevPeerId, node, setNode]);
    return node;
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
};
const MarkdownShortcutsExample = () => {
    const node = useLibp2p({ peerId: null });
    const prevNode = usePrevious(node);
    const [nickName, setNickName] = react_1.default.useState("...");
    const [value, setValue] = (0, react_1.useState)(initialValue);
    const renderElement = (0, react_1.useCallback)(props => <Element {...props}/>, []);
    const yDoc = react_1.default.useMemo(() => {
        return new Y.Doc();
    }, []);
    const [editor, setEditor] = (0, react_1.useState)(null);
    const [provider, setProvider] = (0, react_1.useState)(null);
    const room = (0, react_use_1.useSearchParam)(roomParam) || "general";
    const targetMultiAddrs = JSON.parse((0, react_use_1.useSearchParam)(targetMultiAddrsParam) || "[]");
    useConnectToMultiAddrs(node, targetMultiAddrs);
    const color = (0, react_1.useMemo)(() => {
        var _a;
        return (0, randomcolor_1.default)({
            seed: (_a = node === null || node === void 0 ? void 0 : node.peerId) === null || _a === void 0 ? void 0 : _a.toB58String(),
            luminosity: "dark",
            format: "rgba",
            alpha: 1,
        });
    }, [node]);
    react_1.default.useEffect(() => {
        var _a;
        console.log("node", node, node === null || node === void 0 ? void 0 : node.isStarted());
        if (node === prevNode) {
            return;
        }
        // @ts-ignore
        window.PeerId = peer_id_1.default;
        if (!!node) {
            if (nickName === "...") {
                setNickName(node.peerId.toB58String());
            }
            const provider = new y_libp2p_1.default(yDoc, node, room);
            console.log("setup provider", provider);
            const editor = withShortcuts((0, slate_react_1.withReact)((0, slate_1.createEditor)()));
            const sharedType = yDoc.getArray('content');
            const yjsEditor = (0, slate_yjs_1.withYjs)(editor, sharedType);
            (0, slate_yjs_1.toSharedType)(sharedType, [
                { type: "paragraph", children: [{ text: "" }] },
            ]);
            const cursorEditor = (0, slate_yjs_1.withCursor)(yjsEditor, provider.awareness);
            // provider.awareness.on('update', () => {
            //   console.log("awareness update")
            // })
            provider.awareness.setLocalState({
                alphaColor: color.slice(0, -2) + "0.2)",
                color,
                name: (_a = node.peerId) === null || _a === void 0 ? void 0 : _a.toB58String(),
            });
            setProvider(provider);
            setEditor(cursorEditor);
            // return editor
        }
        (() => __awaiter(void 0, void 0, void 0, function* () {
            console.log("Started libp2p", node === null || node === void 0 ? void 0 : node.multiaddrs);
        }))().catch(e => {
            console.error("Failed to start libp2p", e);
        });
    }, [node, prevNode, nickName]);
    react_1.default.useEffect(() => {
        if (provider) {
            provider.awareness.setLocalState({
                alphaColor: color.slice(0, -2) + "0.2)",
                color,
                name: nickName,
            });
        }
    }, [nickName, provider]);
    // @ts-ignore
    const { decorate, cursors } = (0, slate_yjs_1.useCursors)(editor || { awareness: { on: () => { } } });
    const renderLeaf = (0, react_1.useCallback)((props) => <Leaf {...props}/>, [
        decorate,
    ]);
    const [otherRoom, setOtherRoom] = react_1.default.useState(room);
    const decorateWrapper = (0, react_1.useCallback)((...args) => 
    // @ts-ignore
    [
        ...decorateMarkdown(...args),
        ...decorate(...args)
    ], [decorate]);
    return (<div>
      {node && <div>Your PeerID: {node === null || node === void 0 ? void 0 : node.peerId.toB58String()}</div>}
      {node && <div>Room: <a target={'_blank'} href={formLinkToShare(node.peerId, node.multiaddrs.map(ma => ma.toString()) || [], room)}>{room}</a></div>}
      {node && <div>Nickname:
        <input type="text" style={{ border: "solid 1px" }} value={nickName} onChange={e => setNickName(e.target.value)}/>
      </div>}
      <br />
      <div>Join/create another room:</div>
      <div>
        <input type="text" style={{ border: "solid 1px" }} value={otherRoom} onChange={e => setOtherRoom(e.target.value)}/>
        <button onClick={() => __awaiter(void 0, void 0, void 0, function* () {
            window.open(linkToNewRoom(otherRoom));
        })}>Join (new window)</button>
      </div>
      <br />
      {cursors.length > 0 && <div>Peers connected:</div>}
      <span>{cursors.map(({ data }) => <pre key={data.name} style={{ color: data.color }}>{data.name}</pre>)}</span>


      {/* <Slate editor={editor} value={value} onChange={value => setValue(value)}> */}
      {!editor && <div>Loading editor...</div>}
      {!!editor && <slate_react_1.Slate editor={editor} value={value} onChange={value => setValue(value)}>
        <div style={{ border: "solid 1px", marginTop: 8, padding: 8 }}>
          <slate_react_1.Editable renderElement={renderElement} renderLeaf={renderLeaf} placeholder={"Write some markdown..."} spellCheck autoFocus decorate={decorateWrapper}/>
        </div>
      </slate_react_1.Slate>}
    </div>);
};
const withShortcuts = (editor) => {
    const { deleteBackward, insertText } = editor;
    editor.insertText = (text) => {
        const { selection } = editor;
        if (text === ' ' && selection && slate_1.Range.isCollapsed(selection)) {
            const { anchor } = selection;
            const block = slate_1.Editor.above(editor, {
                match: n => slate_1.Editor.isBlock(editor, n),
            });
            const path = block ? block[1] : [];
            const start = slate_1.Editor.start(editor, path);
            const range = { anchor, focus: start };
            const beforeText = slate_1.Editor.string(editor, range);
            // @ts-ignore
            const type = SHORTCUTS[beforeText];
            if (type) {
                slate_1.Transforms.select(editor, range);
                slate_1.Transforms.delete(editor);
                const newProperties = {
                    // @ts-ignore
                    type,
                };
                slate_1.Transforms.setNodes(editor, newProperties, {
                    match: n => slate_1.Editor.isBlock(editor, n),
                });
                if (type === 'list-item') {
                    // const list: BulletedListElement = {
                    const list = {
                        type: 'bulleted-list',
                        children: [],
                    };
                    slate_1.Transforms.wrapNodes(editor, list, {
                        match: n => !slate_1.Editor.isEditor(n) &&
                            slate_1.Element.isElement(n) &&
                            n.type === 'list-item',
                    });
                }
                return;
            }
        }
        insertText(text);
    };
    editor.deleteBackward = (...args) => {
        const { selection } = editor;
        if (selection && slate_1.Range.isCollapsed(selection)) {
            const match = slate_1.Editor.above(editor, {
                match: n => slate_1.Editor.isBlock(editor, n),
            });
            if (match) {
                const [block, path] = match;
                const start = slate_1.Editor.start(editor, path);
                if (!slate_1.Editor.isEditor(block) &&
                    slate_1.Element.isElement(block) &&
                    block.type !== 'paragraph' &&
                    slate_1.Point.equals(selection.anchor, start)) {
                    const newProperties = {
                        type: 'paragraph',
                    };
                    slate_1.Transforms.setNodes(editor, newProperties);
                    if (block.type === 'list-item') {
                        slate_1.Transforms.unwrapNodes(editor, {
                            match: n => !slate_1.Editor.isEditor(n) &&
                                slate_1.Element.isElement(n) &&
                                n.type === 'bulleted-list',
                            split: true,
                        });
                    }
                    return;
                }
            }
            deleteBackward(...args);
        }
    };
    return editor;
};
const Element = (_a) => {
    var { attributes, children, element } = _a, rest = __rest(_a, ["attributes", "children", "element"]);
    switch (element.type) {
        case 'block-quote':
            return <blockquote {...attributes}>{children}</blockquote>;
        case 'bulleted-list':
            return <ul {...attributes}>{children}</ul>;
        case 'heading-one':
            return <h1 {...attributes}>{children}</h1>;
        case 'heading-two':
            return <h2 {...attributes}>{children}</h2>;
        case 'heading-three':
            return <h3 {...attributes}>{children}</h3>;
        case 'heading-four':
            return <h4 {...attributes}>{children}</h4>;
        case 'heading-five':
            return <h5 {...attributes}>{children}</h5>;
        case 'heading-six':
            return <h6 {...attributes}>{children}</h6>;
        case 'list-item':
            return <li {...attributes}>{children}</li>;
        default:
            return <p {...attributes}>{children}</p>;
    }
};
const initialValue = [{ type: "paragraph", children: [{ text: "" }] },];
const Leaf = ({ attributes, children, leaf }) => {
    if (leaf.placeholder) {
        return <span {...attributes}>{children}</span>;
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
    const data = leaf.data;
    return (<span {...attributes} style={{
            position: "relative",
            backgroundColor: data === null || data === void 0 ? void 0 : data.alphaColor,
        }} className={(0, css_1.css) `
        font-weight: ${leaf.bold && 'bold'};
        font-style: ${leaf.italic && 'italic'};
        text-decoration: ${leaf.underlined && 'underline'};
        ${leaf.title &&
            (0, css_1.css) `
            display: inline-block;
            font-weight: bold;
            font-size: 20px;
            margin: 20px 0 10px 0;
          `}
        ${leaf.list &&
            (0, css_1.css) `
            padding-left: 10px;
            font-size: 20px;
            line-height: 10px;
          `}
        ${leaf.hr &&
            (0, css_1.css) `
            display: block;
            text-align: center;
            border-bottom: 2px solid #ddd;
          `}
        ${leaf.blockquote &&
            (0, css_1.css) `
            display: inline-block;
            border-left: 2px solid #ddd;
            padding-left: 10px;
            color: #aaa;
            font-style: italic;
          `}
        ${leaf.code &&
            (0, css_1.css) `
            font-family: monospace;
            background-color: #eee;
            padding: 3px;
          `}
      `}>
      {leaf.isCaret ? <Caret_1.default {...leaf}/> : null}
      {children}
    </span>);
};
const Leaf2 = ({ attributes, children, leaf }) => {
    return (<span {...attributes} className={(0, css_1.css) `
        font-weight: ${leaf.bold && 'bold'};
        font-style: ${leaf.italic && 'italic'};
        text-decoration: ${leaf.underlined && 'underline'};
        ${leaf.title &&
            (0, css_1.css) `
            display: inline-block;
            font-weight: bold;
            font-size: 20px;
            margin: 20px 0 10px 0;
          `}
        ${leaf.list &&
            (0, css_1.css) `
            padding-left: 10px;
            font-size: 20px;
            line-height: 10px;
          `}
        ${leaf.hr &&
            (0, css_1.css) `
            display: block;
            text-align: center;
            border-bottom: 2px solid #ddd;
          `}
        ${leaf.blockquote &&
            (0, css_1.css) `
            display: inline-block;
            border-left: 2px solid #ddd;
            padding-left: 10px;
            color: #aaa;
            font-style: italic;
          `}
        ${leaf.code &&
            (0, css_1.css) `
            font-family: monospace;
            background-color: #eee;
            padding: 3px;
          `}
      `}>
      {children}
    </span>);
};
function decorateMarkdown([node, path]) {
    const ranges = [];
    if (!slate_1.Text.isText(node)) {
        return ranges;
    }
    const getLength = token => {
        if (typeof token === 'string') {
            return token.length;
        }
        else if (typeof token.content === 'string') {
            return token.content.length;
        }
        else {
            return token.content.reduce((l, t) => l + getLength(t), 0);
        }
    };
    const tokens = prismjs_1.default.tokenize(node.text, prismjs_1.default.languages.markdown);
    let start = 0;
    for (const token of tokens) {
        const length = getLength(token);
        const end = start + length;
        if (typeof token !== 'string') {
            ranges.push({
                [token.type]: true,
                anchor: { path, offset: start },
                focus: { path, offset: end },
            });
        }
        start = end;
    }
    return ranges;
}
function useConnectToMultiAddrs(node, targetMultiAddrs) {
    react_1.default.useEffect(() => {
        let earlyCancel = false;
        (() => __awaiter(this, void 0, void 0, function* () {
            const retry = 3;
            for (let i = 0; i < retry; i++) {
                for (const multiAddr of targetMultiAddrs) {
                    if (earlyCancel) {
                        return;
                    }
                    try {
                        yield (node === null || node === void 0 ? void 0 : node.dial(multiAddr));
                    }
                    catch (e) {
                        console.log("Failed to dial target", e);
                        yield new Promise(resolve => setTimeout(resolve, 500));
                        continue;
                    }
                    return;
                }
            }
        }))();
        return () => {
            earlyCancel = true;
        };
    }, [targetMultiAddrs]);
}
function formLinkToShare(peerId, multiaddrs, room) {
    return `/?${targetMultiAddrsParam}=${JSON.stringify(multiaddrs.map(ma => `${ma}/p2p/${peerId.toB58String()}`))}&${roomParam}=${room}`;
}
function linkToNewRoom(room) {
    return `/?${roomParam}=${room}`;
}
exports.default = MarkdownShortcutsExample;
