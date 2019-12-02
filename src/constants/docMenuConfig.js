const baseUrl = '/doc'
const baseFilePath = '/docs'

let config = [
  {
    label: '快速入门',
    filePath: `${baseFilePath}/快速入门/Serverless Framework快速入门`,
  },
  {
    label: '操作指南',
    content: [
      {
        label: 'Framework CLI',
        content: [
          {
            label: '快速安装',
            filePath: `${baseFilePath}/操作指南/Framework CLI/快速安装`,
          },
          {
            label: '配置账号',
            filePath: `${baseFilePath}/操作指南/Framework CLI/配置账号`,
          },
          {
            label: '创建服务',
            filePath: `${baseFilePath}/操作指南/Framework CLI/创建服务`,
          },
          {
            label: '打包服务',
            filePath: `${baseFilePath}/操作指南/Framework CLI/打包服务`,
          },
          {
            label: '部署服务',
            filePath: `${baseFilePath}/操作指南/Framework CLI/部署服务`,
          },
          {
            label: '部署函数',
            filePath: `${baseFilePath}/操作指南/Framework CLI/部署函数`,
          },

          {
            label: '云端调用',
            filePath: `${baseFilePath}/操作指南/Framework CLI/云端调用`,
          },
          {
            label: '日志查看',
            filePath: `${baseFilePath}/操作指南/Framework CLI/日志查看`,
          },
          {
            label: '回滚服务',
            filePath: `${baseFilePath}/操作指南/Framework CLI/回滚服务`,
          },
          {
            label: '删除服务',
            filePath: `${baseFilePath}/操作指南/Framework CLI/删除服务`,
          },
          {
            label: '部署列表',
            filePath: `${baseFilePath}/操作指南/Framework CLI/部署列表`,
          },
          {
            label: '获取详情',
            filePath: `${baseFilePath}/操作指南/Framework CLI/获取详情`,
          },
          {
            label: '运行数据统计',
            filePath: `${baseFilePath}/操作指南/Framework CLI/运行数据统计`,
          },
        ],
      },
      {
        label: 'Components',
        content: [
          {
            label: 'Components 概述',
            filePath: `${baseFilePath}/操作指南/Components/Components 概述`,
          },
          {
            label: '云函数SCF组件',
            filePath: `${baseFilePath}/操作指南/Components/云函数SCF组件`,
          },
          {
            label: '对象存储 COS 组件',
            filePath: `${baseFilePath}/操作指南/Components/对象存储 COS 组件`,
          },
          {
            label: 'API 网关组件',
            filePath: `${baseFilePath}/操作指南/Components/API 网关组件`,
          },
          {
            label: '访问管理 CAM-策略组件',
            filePath: `${baseFilePath}/操作指南/Components/访问管理 CAM-策略组件`,
          },
          {
            label: '访问管理 CAM-角色组件',
            filePath: `${baseFilePath}/操作指南/Components/访问管理 CAM-角色组件`,
          },
        ],
      },
    ],
  },
  {
    label: '最佳实践',
    content: [
      {
        label: '快速部署 Express 框架',
        filePath: `${baseFilePath}/最佳实践/快速部署 Express 框架`,
      },
      {
        label: '快速部署静态网站',
        filePath: `${baseFilePath}/最佳实践/快速部署静态网站`,
      },
      {
        label: '快速部署 Serverless Hexo博客',
        filePath: `${baseFilePath}/最佳实践/快速部署 Serverless Hexo博客`,
      },
      {
        label: '快速部署一个全栈应用(vue.js+express.js)',
        filePath: `${baseFilePath}/最佳实践/快速部署一个全栈应用(vue.js+express.js)`,
      },
      {
        label: '快速构建 REST API',
        filePath: `${baseFilePath}/最佳实践/快速构建 REST API`,
      },
    ],
  }
]

function generateDocLinkPath(menu, prefix) {
  if (!menu.length) {
    throw new Error('the first args must be not empty array')
  }

  menu.forEach((o, index) => {
    const curPrefix = prefix ? `${prefix}-${index + 1}` : index + 1
    if (o.content) {
      o.content = generateDocLinkPath(o.content, curPrefix)
    } else {
      o.to = `${baseUrl}/${curPrefix}`
    }
  })

  return menu
}

function generateDocConfigMap(config) {
  const q = [...config]
  const map = {}

  while (q.length) {
    const cur = q.shift()
    if (cur.content) {
      q.push(...cur.content)
    } else {
      map[cur.filePath] = cur
    }
  }

  return map
}

config = generateDocLinkPath(config, '')
module.exports = {
  baseUrl,
  config,
  configMap: generateDocConfigMap(config),
}
