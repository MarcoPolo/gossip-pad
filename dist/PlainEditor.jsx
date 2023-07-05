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
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const slate_1 = require("slate");
const slate_react_1 = require("slate-react");
const PlainTextExample = () => {
    // const [value, setValue] = useState<Descendant[]>([{ text: '' }])
    const [value, setValue] = (0, react_1.useState)([{
            type: 'paragraph',
            children: [
                { text: '' },
            ],
        }]);
    // @ts-ignore
    const editor = (0, react_1.useMemo)(() => (0, slate_react_1.withReact)((0, slate_1.createEditor)()), []);
    return (<slate_react_1.Slate editor={editor} value={value} onChange={value => setValue(value)}>
      <slate_react_1.Editable placeholder="Enter some plain text..."/>
    </slate_react_1.Slate>);
};
const initialValue = [
    {
        type: 'paragraph',
        children: [
            { text: 'This is editable plain text, just like a <textarea>!' },
        ],
    },
];
exports.default = PlainTextExample;
