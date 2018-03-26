"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const globby = require("globby");
class Scanner {
    /**
     * 自动扫描执行目录下的文件
     * @constructor
     * @param {Option} options - options
     */
    constructor(options) {
        this.options = options;
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const autoScanPath = Array.isArray(this.options.autoScan) ? this.options.autoScan : [this.options.autoScan];
            const ignorePath = Array.isArray(this.options.ignore) ? this.options.ignore : [this.options.ignore];
            const baseDir = path.resolve(this.options.__dirname, this.options.baseDir);
            const ignore = ignorePath.filter(f => !!f).map(f => `!${f}`);
            const autoScan = autoScanPath.concat(ignore);
            const filePaths = yield globby(autoScan, { cwd: baseDir });
            for (const filePath of filePaths) {
                const fullPath = path.resolve(baseDir, filePath);
                // tslint:disable-next-line:no-console
                console.log(fullPath);
                // tslint:disable-next-line:no-unused-expression
                fullPath && require(fullPath);
            }
        });
    }
}
exports.default = Scanner;
