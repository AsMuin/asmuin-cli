import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import babel from '@rollup/plugin-babel';
import json from '@rollup/plugin-json'

export default [{
    input: 'main.js', // 入口文件
    output: {
        file: 'dist/main.js', // 输出文件
        format: 'es',
        banner: '#!/usr/bin/env node' // 添加 shebang
    },
    plugins: [
        resolve({
            extensions: ['.js', '.json'] // 添加你需要的文件扩展名
        }),
        json(), // 支持 JSON 导入
        commonjs(), // 支持 CommonJS 转 ES 模块
        babel({
            babelHelpers: 'bundled',
            exclude: 'node_modules/**', // 排除第三方模块
            presets: [
                [
                    '@babel/preset-env',
                    {
                        targets: {
                            node: '12' // 兼容 Node.js 12
                        }
                    }
                ]
            ]
        }),
        terser() // 压缩代码
    ],
    external: ['inquirer','chalk', 'axios', 'figlet', 'unzipper'] // 标记为外部依赖
},
]
