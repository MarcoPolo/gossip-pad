"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Caret = ({ data, isForward }) => {
    const cursorStyles = Object.assign(Object.assign({}, cursorStyleBase), { background: data.color, left: isForward ? "100%" : "0%" });
    const caretStyles = Object.assign(Object.assign({}, caretStyleBase), { background: data.color, left: isForward ? "100%" : "0%" });
    caretStyles[isForward ? "bottom" : "top"] = 0;
    return (<>
      <span contentEditable={false} style={caretStyles}>
        <span style={{ position: "relative" }}>
          <span contentEditable={false} style={cursorStyles}>
            {data.name}
          </span>
        </span>
      </span>
    </>);
};
exports.default = Caret;
const cursorStyleBase = {
    position: "absolute",
    top: -2,
    pointerEvents: "none",
    userSelect: "none",
    transform: "translateY(-100%)",
    fontSize: 10,
    color: "white",
    background: "palevioletred",
    whiteSpace: "nowrap",
};
const caretStyleBase = {
    position: "absolute",
    pointerEvents: "none",
    userSelect: "none",
    height: "1.2em",
    width: 2,
    background: "palevioletred",
};
