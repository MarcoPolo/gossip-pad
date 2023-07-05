"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sum_1 = __importDefault(require("./sum"));
test('adds 1 + 2 to equal 3', () => {
    expect((0, sum_1.default)(1, 2)).toBe(3);
});
