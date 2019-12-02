const baseUrl = '/doc'

let config = [
  {
    label: '快速入门',
    to: `${baseUrl}/quick/serverless-framework`,
  },
  // {
  //   label: '操作指南',
  //   content: [
  //     {
  //       label: 'Framework CLI',
  //       content: [
  //         {
  //           label: '快速安装',
  //           to: `${baseUrl}/操作指南/Framework CLI/快速安装`,
  //         },
  //         {
  //           label: '配置账号',
  //           to: `${baseUrl}/操作指南/Framework CLI/配置账号`,
  //         },
  //         {
  //           label: '创建服务',
  //           to: `${baseUrl}/操作指南/Framework CLI/创建服务`,
  //         },
  //         {
  //           label: '打包服务',
  //           to: `${baseUrl}/操作指南/Framework CLI/打包服务`,
  //         },
  //         {
  //           label: '部署服务',
  //           to: `${baseUrl}/操作指南/Framework CLI/部署服务`,
  //         },
  //         {
  //           label: '部署函数',
  //           to: `${baseUrl}/操作指南/Framework CLI/部署函数`,
  //         },

  //         {
  //           label: '云端调用',
  //           to: `${baseUrl}/操作指南/Framework CLI/云端调用`,
  //         },
  //         {
  //           label: '日志查看',
  //           to: `${baseUrl}/操作指南/Framework CLI/日志查看`,
  //         },
  //         {
  //           label: '回滚服务',
  //           to: `${baseUrl}/操作指南/Framework CLI/回滚服务`,
  //         },
  //         {
  //           label: '删除服务',
  //           to: `${baseUrl}/操作指南/Framework CLI/删除服务`,
  //         },
  //         {
  //           label: '部署列表',
  //           to: `${baseUrl}/操作指南/Framework CLI/部署列表`,
  //         },
  //         {
  //           label: '获取详情',
  //           to: `${baseUrl}/操作指南/Framework CLI/获取详情`,
  //         },
  //         {
  //           label: '运行数据统计',
  //           to: `${baseUrl}/操作指南/Framework CLI/运行数据统计`,
  //         },
  //       ],
  //     },
  //     {
  //       label: 'Components',
  //       content: [
  //         {
  //           label: 'Components 概述',
  //           to: `${baseUrl}/操作指南/Components/Components 概述`,
  //         },
  //         {
  //           label: '云函数SCF组件',
  //           to: `${baseUrl}/操作指南/Components/云函数SCF组件`,
  //         },
  //         {
  //           label: '对象存储 COS 组件',
  //           to: `${baseUrl}/操作指南/Components/对象存储 COS 组件`,
  //         },
  //         {
  //           label: 'API 网关组件',
  //           to: `${baseUrl}/操作指南/Components/API 网关组件`,
  //         },
  //         {
  //           label: '访问管理 CAM-策略组件',
  //           to: `${baseUrl}/操作指南/Components/访问管理 CAM-策略组件`,
  //         },
  //         {
  //           label: '访问管理 CAM-角色组件',
  //           to: `${baseUrl}/操作指南/Components/访问管理 CAM-角色组件`,
  //         },
  //       ],
  //     },
  //   ],
  // },
  {
    label: '最佳实践',
    content: [
      {
        label: '快速部署 Express 框架',
        to: `${baseUrl}/best-practice/express`,
      },
      {
        label: '快速部署静态网站',
        to: `${baseUrl}/best-practice/website`,
      },
      {
        label: '快速部署 Serverless Hexo博客',
        to: `${baseUrl}/best-practice/hexo`,
      },
      {
        label: '快速部署一个全栈应用(vue.js+express.js)',
        to: `${baseUrl}/best-practice/full-stack`,
      },
      {
        label: '快速构建 REST API',
        to: `${baseUrl}/best-practice/rest`,
      },
    ],
  },
]

module.exports = {
  baseUrl,
  config,
}
