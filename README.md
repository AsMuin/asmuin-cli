# AsMuin Project Template

## Why this project creaded?
When creating a project, since each project basically uses TypeScript, prettier, and eslint, along with some compilation and rule format configurations, it takes a considerable amount of time to complete the initialization of each project. To save time and maintain a consistent configuration style, a custom project scaffolding is adopted, using templates to complete the basic configuration and directory structure of the project.

## something you should know

This tool is built on ESModule, so it has certain requirements for your Node environment. If you encounter any errors due to version issues, you can switch to the latest Node LTS version.

### npm package dependencies
`axios` + `chalk` + `child_process` + `figlet` + `inquirer` + `unzipper`

### how it works
The specific idea of creating project templates implemented by this tool is that based on the input content, different templates are selected through different branches in a GIT repository you specify, and then the compressed file is downloaded and decompressed into a folder with the same name as the project name you initially entered.

### how to use
```bash
npm i asmuin-cli -g
asmuin-cli

or

npx asmuin-cli

```

### how to configure
First, you need to specify a GIT repository address. In the project, I have set up my template repository as the default. Meanwhile, different branches correspond to various templates. You need to maintain the correspondence between the two by yourself. After all, this tool is actually only responsible for obtaining the compressed file you specify and unzipping it in the directory you specify.

just like this 
``` js
    // GitHub 仓库地址和分支映射
    const repoUrl = 'https://github.com/AsMuin/project-template';
    const branchMap = {
        react: 'react',
        'express-mongodb': 'express-mongodb'
    };

```

The most important part is how to get the project template you want according to the command line instructions, the project has a template.json file, and the JSON object is used to configure the effect you want to achieve.

demo config
```json
{
    "frontend": {
        "key": "frontend",
        "description": "请选择使用的开发框架：",
        "name": "前端项目",
        "choices": [
            {
                "name": "React + Axios + TailwindCSS",
                "value": "react",
                "color": "blue"
            }
        ]
    },
    "backend": {
        "key": "backend",
        "description": "请选择使用的开发框架：",
        "name": "后端项目",
        "choices": [
            {
                "name": "Express",
                "value": "express",
                "color": "magenta",
                "next": {
                    "database": {
                        "description": "请选择使用的数据库：",
                        "key": "database",
                        "name": "数据库",
                        "choices": [
                            {
                                "name": "MongoDB",
                                "value": "mongodb",
                                "color": "cyan"
                            }
                        ]
                    }
                }
            }
        ]
    }
}
```

- `description` field indicates the indication that the command line displays when you are faced with an input command

- `name` is the text of the content tag

- `value` is the value that the option actually represents, and in the case of multi-level selection, parentValue-childValue will be returned to indicate that this is the result of a multi-level option, which requires you to configure the GIT branch or set up the branch mapping table to make the corresponding configuration.
(❗ the first-level options will not be recorded in it, such as frontend, backend.) Of course, you can also modify the source code to keep the side effects of each level completely uniform)

- `color` is the color of the text displayed in the terminal, which can be set to "rgb(0,0,0)" and other color formats, please refer to chalk for more detailed configuration information, if there is no configuration or the configuration cannot be displayed normally, green text will be displayed.

- `next` represents the configuration item of the next node after the node is configured, and the structure type is the same 
(🌝 you should pay attention to the order of the nested hierarchy, because it affects the branch name you finally specify, just like XXX-XXX-XXX....)
