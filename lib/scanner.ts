import * as fs from 'fs'
import * as path from 'path'
import * as globby from 'globby'

export interface IOption {
  /**
   * 项目根目录
   * 路径基于当前配置文件
   */
  baseDir: string,
  /**
   * 自动扫描的文件(夹)
   */
  autoScan: string | Array<string>,
  /**
   * 忽略的文件(夹)
   */
  ignore: string | Array<string>,
  /**
   * 配置文件的真实路径
   * 用于计算项目根目录
   */
  __dirname: string,
}

export default class Scanner {
  private options: any

  /**
   * 自动扫描执行目录下的文件
   * @constructor
   * @param {Option} options - options
   */
  constructor(options: IOption) {
    this.options = options
  }

  async run(): Promise<any> {
    const autoScanPath: Array<string> = Array.isArray(this.options.autoScan) ? this.options.autoScan : [this.options.autoScan]
    const ignorePath: Array<string> = Array.isArray(this.options.ignore) ? this.options.ignore : [this.options.ignore]
    const baseDir: string = path.resolve(this.options.__dirname, this.options.baseDir)
    const ignore = ignorePath.filter(f => !!f).map(f => `!${f}`)
    const autoScan = autoScanPath.concat(ignore)
    const filePaths: Array<string> = await globby(autoScan, { cwd: baseDir })
    for (const filePath of filePaths) {
      const fullPath: string = path.resolve(baseDir, filePath)
      // tslint:disable-next-line:no-console
      console.log(fullPath)
      // tslint:disable-next-line:no-unused-expression
      fullPath && require(fullPath)
    }
  }
}
