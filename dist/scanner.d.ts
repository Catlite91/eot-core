export interface IOption {
    /**
     * 项目根目录
     * 路径基于当前配置文件
     */
    baseDir: string;
    /**
     * 自动扫描的文件(夹)
     */
    autoScan: string | Array<string>;
    /**
     * 忽略的文件(夹)
     */
    ignore: string | Array<string>;
    /**
     * 配置文件的真实路径
     * 用于计算项目根目录
     */
    __dirname: string;
}
export default class Scanner {
    private options;
    /**
     * 自动扫描执行目录下的文件
     * @constructor
     * @param {Option} options - options
     */
    constructor(options: IOption);
    run(): Promise<any>;
}
