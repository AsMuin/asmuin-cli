import chalk from 'chalk';
import figlet from 'figlet';
import path from 'path';
import axios from 'axios';
import fs from 'fs';
import unzipper from 'unzipper';
import choose from './choose';

async function downloadAndExtractRepo(repoUrl, branch, dest) {
    const zipUrl = `${repoUrl}/archive/refs/heads/${branch}.zip`;

    console.log(`正在下载模板文件：${zipUrl}`);

    try {
        // 创建目标文件夹
        fs.mkdirSync(dest, {recursive: true});

        // 下载 ZIP 文件
        const response = await axios({
            url: zipUrl,
            method: 'GET',
            responseType: 'stream'
        });

        // 保存 ZIP 文件
        const zipPath = path.join(dest, `${branch}.zip`);
        const writer = fs.createWriteStream(zipPath);
        response.data.pipe(writer);

        // 等待下载完成
        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });

        // 解压 ZIP 文件到临时目录
        console.log('正在解压模板文件...');
        const tempDir = path.join(dest, '__temp__'); // 临时文件夹
        await fs
            .createReadStream(zipPath)
            .pipe(unzipper.Extract({path: tempDir}))
            .promise();

        // 获取临时目录中的根文件夹名
        const [rootDir] = fs.readdirSync(tempDir);
        const rootPath = path.join(tempDir, rootDir);

        // 移动根文件夹中的内容到目标目录
        const files = fs.readdirSync(rootPath);
        for (const file of files) {
            const srcPath = path.join(rootPath, file);
            const destPath = path.join(dest, file);
            fs.renameSync(srcPath, destPath);
        }

        // 删除临时目录和 ZIP 文件
        fs.rmSync(tempDir, {recursive: true});
        fs.unlinkSync(zipPath);
    } catch (error) {
        console.error('❌ 模板下载或解压失败：', error.message);
        process.exit(1);
    }
}

async function main() {
    // 打印标题
    console.log(
        chalk.green(
            figlet.textSync('AsMuin Template', {
                horizontalLayout: 'default',
                verticalLayout: 'default'
            })
        )
    );

    // 提供描述
    console.log(chalk.blueBright('欢迎！🎉🎉'));
    console.log(chalk.yellow('请选择一个模版开始你的项目：\n'));

    // // 交互选项
    const {name , template} = await choose();

    // GitHub 仓库地址和分支映射
    const repoUrl = 'https://github.com/AsMuin/project-template';
    const branchMap = {
        react: 'react',
        'express-mongodb': 'express-mongodb',
        'express-postgresql':'express-postgresql',
        'next-postgresql':'next-postgresql'
    };

    // 获取用户选择的分支
    const branch = branchMap[template] || template;
    const dest = path.join(process.cwd(), name);

    console.log(chalk.green(`正在下载 ${branch} 分支的模板...`));
    const repo = `${repoUrl}#${branch}`;
    console.log(chalk.gray(`模板地址: ${repo}`));
    try {
        // 下载并解压仓库
        await downloadAndExtractRepo(repoUrl, branch, dest);
        console.log(chalk.greenBright('\n🎉 项目已成功创建！'));
        console.log(chalk.yellow(`\n打开编辑器进入项目目录: code ${name}`));
    } catch (error) {
        console.error(chalk.red('❌ 发生错误：'), error.message);
    }
}

main().catch(error => {
    console.error(chalk.red('❌ 未捕获的错误：'), error);
});
