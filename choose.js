import inquirer from 'inquirer';
import chalk from 'chalk';
import templateJSON from './template';


async function chooseTemplate() {
    // 读取并解析 JSON 文件
    const data = templateJSON;
    const { name } = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: chalk.bold('请输入项目名称：'),
            validate(input) {
                if (!input || input.trim() === '') {
                    return '项目名称不能为空！';
                }
                return true;
            }
        }
    ]);
    const { projectType } = await inquirer.prompt([
        {
            type: 'list',
            name: 'projectType',
            message: chalk.bold('请选择项目类型：'),
            choices: Object.keys(data).map((key) => ({
                name: chalk.green(data[key].name),
                value: data[key].value
            }))
        }
    ]);

    const template = await traverseChoices(data[projectType]);
    return { name, template };
}

async function traverseChoices(node, parentName = '') {
    // 如果当前节点没有下一层，直接返回当前节点的值
    if (!node.choices) {
        return node.value;
    }

    const { choice } = await inquirer.prompt([
        {
            type: 'list',
            name: 'choice',
            message: chalk.bold(node.description || '请选择：'),
            choices: node.choices.map((item) => ({
                name: chalk?.[item.color]? chalk?.[item.color](item.name) : chalk.green(item.name),
                value: item
            }))
        }
    ]);

    // 如果选择项有下一层，递归处理
    if (choice.next) {
        const nextKey = Object.keys(choice.next)[0];
        const nextName = parentName ? `${parentName}-${nextKey}` : choice.value;
        return traverseChoices(choice.next[nextKey], nextName);
    }

    // 如果选择项没有下一层，直接返回当前节点的值
    const returnValue = parentName ? `${parentName}-${choice.value}` : choice.value;
    return returnValue;
}

export default chooseTemplate;