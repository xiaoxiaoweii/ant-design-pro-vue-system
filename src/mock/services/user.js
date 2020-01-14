import Mock from 'mockjs2'
import { builder } from '../util'

const info = options => {
  console.log('options', options)
  const userInfo = {
    id: '4291d7da9005377ec9aec4a71ea837f',
    name: '中铁建',
    username: 'admin',
    password: '',
    avatar: '/avatar2.jpg',
    status: 1,
    telephone: '',
    lastLoginIp: '192.168.192.56',
    lastLoginTime: 1534837621348,
    creatorId: 'admin',
    createTime: 1497160610259,
    merchantCode: 'TLif2btpzg079h15bk',
    deleted: 0,
    roleId: 'admin',
    role: {}
  }
  // role
  const roleObj = {
    id: 'admin',
    name: '管理员',
    describe: '拥有所有权限',
    status: 1,
    creatorId: 'system',
    createTime: 1497160610259,
    deleted: 0,
    permissions: [
      {
        roleId: 'admin',
        permissionId: 'dashboard',
        permissionName: '仪表盘',
        actions:
          '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"query","defaultCheck":false,"describe":"查询"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
        actionEntitySet: [
          {
            action: 'add',
            describe: '新增',
            defaultCheck: false
          },
          {
            action: 'query',
            describe: '查询',
            defaultCheck: false
          },
          {
            action: 'get',
            describe: '详情',
            defaultCheck: false
          },
          {
            action: 'update',
            describe: '修改',
            defaultCheck: false
          },
          {
            action: 'delete',
            describe: '删除',
            defaultCheck: false
          }
        ],
        actionList: null,
        dataAccess: null
      },
      {
        roleId: 'admin',
        permissionId: 'exception',
        permissionName: '异常页面权限',
        actions:
          '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"query","defaultCheck":false,"describe":"查询"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
        actionEntitySet: [
          {
            action: 'add',
            describe: '新增',
            defaultCheck: false
          },
          {
            action: 'query',
            describe: '查询',
            defaultCheck: false
          },
          {
            action: 'get',
            describe: '详情',
            defaultCheck: false
          },
          {
            action: 'update',
            describe: '修改',
            defaultCheck: false
          },
          {
            action: 'delete',
            describe: '删除',
            defaultCheck: false
          }
        ],
        actionList: null,
        dataAccess: null
      },
      {
        roleId: 'admin',
        permissionId: 'result',
        permissionName: '结果权限',
        actions:
          '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"query","defaultCheck":false,"describe":"查询"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
        actionEntitySet: [
          {
            action: 'add',
            describe: '新增',
            defaultCheck: false
          },
          {
            action: 'query',
            describe: '查询',
            defaultCheck: false
          },
          {
            action: 'get',
            describe: '详情',
            defaultCheck: false
          },
          {
            action: 'update',
            describe: '修改',
            defaultCheck: false
          },
          {
            action: 'delete',
            describe: '删除',
            defaultCheck: false
          }
        ],
        actionList: null,
        dataAccess: null
      },
      {
        roleId: 'admin',
        permissionId: 'profile',
        permissionName: '详细页权限',
        actions:
          '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"query","defaultCheck":false,"describe":"查询"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
        actionEntitySet: [
          {
            action: 'add',
            describe: '新增',
            defaultCheck: false
          },
          {
            action: 'query',
            describe: '查询',
            defaultCheck: false
          },
          {
            action: 'get',
            describe: '详情',
            defaultCheck: false
          },
          {
            action: 'update',
            describe: '修改',
            defaultCheck: false
          },
          {
            action: 'delete',
            describe: '删除',
            defaultCheck: false
          }
        ],
        actionList: null,
        dataAccess: null
      },
      {
        roleId: 'admin',
        permissionId: 'table',
        permissionName: '表格权限',
        actions:
          '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"import","defaultCheck":false,"describe":"导入"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"}]',
        actionEntitySet: [
          {
            action: 'add',
            describe: '新增',
            defaultCheck: false
          },
          {
            action: 'import',
            describe: '导入',
            defaultCheck: false
          },
          {
            action: 'get',
            describe: '详情',
            defaultCheck: false
          },
          {
            action: 'update',
            describe: '修改',
            defaultCheck: false
          }
        ],
        actionList: null,
        dataAccess: null
      },
      {
        roleId: 'admin',
        permissionId: 'form',
        permissionName: '表单权限',
        actions:
          '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"query","defaultCheck":false,"describe":"查询"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
        actionEntitySet: [
          {
            action: 'add',
            describe: '新增',
            defaultCheck: false
          },
          {
            action: 'get',
            describe: '详情',
            defaultCheck: false
          },
          {
            action: 'query',
            describe: '查询',
            defaultCheck: false
          },
          {
            action: 'update',
            describe: '修改',
            defaultCheck: false
          },
          {
            action: 'delete',
            describe: '删除',
            defaultCheck: false
          }
        ],
        actionList: null,
        dataAccess: null
      },
      {
        roleId: 'admin',
        permissionId: 'order',
        permissionName: '订单管理',
        actions:
          '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"query","defaultCheck":false,"describe":"查询"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
        actionEntitySet: [
          {
            action: 'add',
            describe: '新增',
            defaultCheck: false
          },
          {
            action: 'query',
            describe: '查询',
            defaultCheck: false
          },
          {
            action: 'get',
            describe: '详情',
            defaultCheck: false
          },
          {
            action: 'update',
            describe: '修改',
            defaultCheck: false
          },
          {
            action: 'delete',
            describe: '删除',
            defaultCheck: false
          }
        ],
        actionList: null,
        dataAccess: null
      },
      {
        roleId: 'admin',
        permissionId: 'permission',
        permissionName: '权限管理',
        actions:
          '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
        actionEntitySet: [
          {
            action: 'add',
            describe: '新增',
            defaultCheck: false
          },
          {
            action: 'get',
            describe: '详情',
            defaultCheck: false
          },
          {
            action: 'update',
            describe: '修改',
            defaultCheck: false
          },
          {
            action: 'delete',
            describe: '删除',
            defaultCheck: false
          }
        ],
        actionList: null,
        dataAccess: null
      },
      {
        roleId: 'admin',
        permissionId: 'role',
        permissionName: '角色管理',
        actions:
          '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
        actionEntitySet: [
          {
            action: 'add',
            describe: '新增',
            defaultCheck: false
          },
          {
            action: 'get',
            describe: '详情',
            defaultCheck: false
          },
          {
            action: 'update',
            describe: '修改',
            defaultCheck: false
          },
          {
            action: 'delete',
            describe: '删除',
            defaultCheck: false
          }
        ],
        actionList: null,
        dataAccess: null
      },
      {
        roleId: 'admin',
        permissionId: 'table',
        permissionName: '桌子管理',
        actions:
          '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"query","defaultCheck":false,"describe":"查询"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
        actionEntitySet: [
          {
            action: 'add',
            describe: '新增',
            defaultCheck: false
          },
          {
            action: 'get',
            describe: '详情',
            defaultCheck: false
          },
          {
            action: 'query',
            describe: '查询',
            defaultCheck: false
          },
          {
            action: 'update',
            describe: '修改',
            defaultCheck: false
          },
          {
            action: 'delete',
            describe: '删除',
            defaultCheck: false
          }
        ],
        actionList: null,
        dataAccess: null
      },
      {
        roleId: 'admin',
        permissionId: 'user',
        permissionName: '用户管理',
        actions:
          '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"import","defaultCheck":false,"describe":"导入"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"},{"action":"export","defaultCheck":false,"describe":"导出"}]',
        actionEntitySet: [
          {
            action: 'add',
            describe: '新增',
            defaultCheck: false
          },
          {
            action: 'import',
            describe: '导入',
            defaultCheck: false
          },
          {
            action: 'get',
            describe: '详情',
            defaultCheck: false
          },
          {
            action: 'update',
            describe: '修改',
            defaultCheck: false
          },
          {
            action: 'delete',
            describe: '删除',
            defaultCheck: false
          },
          {
            action: 'export',
            describe: '导出',
            defaultCheck: false
          }
        ],
        actionList: null,
        dataAccess: null
      }
    ]
  }

  roleObj.permissions.push({
    roleId: 'admin',
    permissionId: 'support',
    permissionName: '超级模块',
    actions:
      '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"import","defaultCheck":false,"describe":"导入"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"},{"action":"export","defaultCheck":false,"describe":"导出"}]',
    actionEntitySet: [
      {
        action: 'add',
        describe: '新增',
        defaultCheck: false
      },
      {
        action: 'import',
        describe: '导入',
        defaultCheck: false
      },
      {
        action: 'get',
        describe: '详情',
        defaultCheck: false
      },
      {
        action: 'update',
        describe: '修改',
        defaultCheck: false
      },
      {
        action: 'delete',
        describe: '删除',
        defaultCheck: false
      },
      {
        action: 'export',
        describe: '导出',
        defaultCheck: false
      }
    ],
    actionList: null,
    dataAccess: null
  })

  userInfo.role = roleObj
  return builder(userInfo)
}

const menu = () => {
  return {
    msg: '查询成功',
    responseObject: {
      catagory: 101301,
      gender: 2,
      positionStatus: 101401,
      org: {
        isClick: 0,
        project_manager_unit: null,
        parent_id: '0',
        is_flag: '0',
        order_number: 1,
        is_project: '0',
        level_number: 1,
        id: 127,
        scope_code: '0000100002',
        project_manager_unit_code: null,
        scope_name: '中国铁建十一局集团',
        child: [
          {
            isClick: 0,
            project_manager_unit: null,
            parent_id: '0000100002',
            is_flag: '0',
            order_number: 8,
            is_project: '0',
            level_number: 2,
            id: 134,
            scope_code: '000010000200006',
            project_manager_unit_code: null,
            scope_name: '中铁十一局局指项目',
            child: [
              {
                isClick: 0,
                project_manager_unit: '机关工程师总部',
                parent_id: '000010000200006',
                is_flag: '0',
                order_number: 10,
                is_project: '1',
                level_number: 3,
                id: 136,
                scope_code: 'CRCC1100TL0120190004',
                project_manager_unit_code: 'hr11:236808',
                scope_name: '渝黔铁路',
                child: [
                  {
                    isClick: 1,
                    project_manager_unit: '中铁十一局集团第一工程有限公司工程师总部',
                    parent_id: 'CRCC1100TL0120190004',
                    is_flag: '0',
                    order_number: 11,
                    is_project: '1',
                    level_number: 4,
                    id: 137,
                    scope_code: 'CRCC1100SZ0420190006',
                    project_manager_unit_code: 'hr11:236951',
                    scope_name: '昆仑枢纽项目',
                    child: []
                  }
                ]
              }
            ]
          },
          {
            isClick: 0,
            project_manager_unit: null,
            parent_id: '0000100002',
            is_flag: '0',
            order_number: 16,
            is_project: '0',
            level_number: 2,
            id: 142,
            scope_code: '000010000200001',
            project_manager_unit_code: null,
            scope_name: '中铁十一局第一工程有限公司',
            child: []
          }
        ]
      },
      name: '汪婧',
      setScopeCode: ['000010000200003', 'CRCC1100SZ0420190006'],
      id: 142718,
      position: [
        { code: '0000100011010007702099001', name: '部员', id: 142686, type: 3, mainPosition: true, order: 1 }
      ],
      currentScopeCode: 'CRCC1100SZ0420190006',
      menuTree: {
        redirect: '/dashboard/workplace',
        orderNumber: 1,
        isValid: '1',
        icon: '',
        title: '首页',
        parentId: 0,
        component: 'BasicLayout',
        children: [
          {
            redirect: '',
            orderNumber: 2,
            isValid: '1',
            icon: 'home',
            title: '首页',
            parentId: 1,
            component: 'RouteView',
            children: [
              {
                redirect: '',
                orderNumber: 5,
                isValid: '1',
                icon: '',
                title: '我的桌面',
                parentId: 2,
                component: '',
                children: [],
                menuCode: '5',
                levelNumber: 3,
                name: '',
                menuType: '1',
                id: 5,
                key: 'workplace'
              }
            ],
            menuCode: '2',
            levelNumber: 2,
            name: 'RouteView',
            menuType: '1',
            id: 2,
            key: 'dashboard'
          },
          {
            redirect: '/planManagement/requireList',
            orderNumber: 14,
            isValid: '1',
            icon: 'schedule',
            title: '计划管理',
            parentId: 1,
            component: 'RouteView',
            children: [
              {
                redirect: '',
                orderNumber: 15,
                isValid: '1',
                icon: '',
                title: '设备需求计划',
                parentId: 14,
                component: '',
                children: [],
                menuCode: '15',
                levelNumber: 2,
                name: '',
                menuType: '1',
                id: 15,
                key: 'requireList'
              },
              {
                redirect: '',
                orderNumber: 16,
                isValid: '1',
                icon: '',
                title: '临时设施需求计划',
                parentId: 14,
                component: '',
                children: [],
                menuCode: '16',
                levelNumber: 2,
                name: '',
                menuType: '1',
                id: 16,
                key: 'temporaryList'
              },
              {
                redirect: '',
                orderNumber: 17,
                isValid: '1',
                icon: '',
                title: '材料配置计划',
                parentId: 14,
                component: '',
                children: [],
                menuCode: '17',
                levelNumber: 2,
                name: '',
                menuType: '1',
                id: 17,
                key: 'configurationList'
              },
              {
                redirect: '',
                orderNumber: 18,
                isValid: '1',
                icon: '',
                title: '路用车需求计划',
                parentId: 14,
                component: '',
                children: [],
                menuCode: '18',
                levelNumber: 2,
                name: '',
                menuType: '1',
                id: 18,
                key: 'roadvehicleList'
              },
              {
                redirect: '',
                orderNumber: 19,
                isValid: '1',
                icon: '',
                title: '设备成本责任预算',
                parentId: 14,
                component: '',
                children: [],
                menuCode: '19',
                levelNumber: 2,
                name: '',
                menuType: '1',
                id: 19,
                key: '111'
              },
              {
                redirect: '',
                orderNumber: 20,
                isValid: '1',
                icon: '',
                title: '季度成本责任预算',
                parentId: 14,
                component: '',
                children: [],
                menuCode: '20',
                levelNumber: 2,
                name: '',
                menuType: '1',
                id: 20,
                key: '222'
              },
              {
                redirect: '',
                orderNumber: 21,
                isValid: '1',
                icon: '',
                title: '年度成本责任预算',
                parentId: 14,
                component: '',
                children: [],
                menuCode: '21',
                levelNumber: 2,
                name: '',
                menuType: '1',
                id: 21,
                key: '333'
              },
              {
                redirect: '',
                orderNumber: 22,
                isValid: '1',
                icon: '',
                title: '设备租赁申请',
                parentId: 14,
                component: '',
                children: [],
                menuCode: '22',
                levelNumber: 2,
                name: '',
                menuType: '1',
                id: 22,
                key: 'equipmentLeaseList'
              },
              {
                redirect: '',
                orderNumber: 23,
                isValid: '1',
                icon: '',
                title: '设备出租申请',
                parentId: 14,
                component: '',
                children: [],
                menuCode: '23',
                levelNumber: 2,
                name: '',
                menuType: '1',
                id: 23,
                key: 'rentalList'
              },
              {
                redirect: '',
                orderNumber: 26,
                isValid: '1',
                icon: '',
                title: '设备材料配件采购申请',
                parentId: 14,
                component: '',
                children: [],
                menuCode: '26',
                levelNumber: 2,
                name: '',
                menuType: '1',
                id: 26,
                key: 'materialList'
              },
              {
                redirect: '',
                orderNumber: 27,
                isValid: '1',
                icon: '',
                title: '设备维修(改造)申请',
                parentId: 14,
                component: '',
                children: [],
                menuCode: '27',
                levelNumber: 2,
                name: '',
                menuType: '1',
                id: 27,
                key: 'maintenanceList'
              },
              {
                redirect: '',
                orderNumber: 28,
                isValid: '1',
                icon: '',
                title: '设备安拆申请',
                parentId: 14,
                component: '',
                children: [],
                menuCode: '28',
                levelNumber: 2,
                name: '',
                menuType: '1',
                id: 28,
                key: 'DemolitionList'
              },
              {
                redirect: '',
                orderNumber: 29,
                isValid: '1',
                icon: '',
                title: '临时设施安拆申请',
                parentId: 14,
                component: '',
                children: [],
                menuCode: '29',
                levelNumber: 2,
                name: '',
                menuType: '1',
                id: 29,
                key: 'facilitiesList'
              },
              {
                redirect: '',
                orderNumber: 30,
                isValid: '1',
                icon: '',
                title: '设备运输申请',
                parentId: 14,
                component: ' ',
                children: [],
                menuCode: '30',
                levelNumber: 2,
                name: '',
                menuType: '1',
                id: 30,
                key: 'transformList'
              },
              {
                redirect: '',
                orderNumber: 31,
                isValid: '1',
                icon: '',
                title: '设备材料减少申请',
                parentId: 14,
                component: ' ',
                children: [],
                menuCode: '31',
                levelNumber: 2,
                name: '',
                menuType: '1',
                id: 31,
                key: 'disposalList'
              }
            ],
            menuCode: '14',
            levelNumber: 1,
            name: '',
            menuType: '1',
            id: 14,
            key: 'planManagement'
          },
          {
            redirect: '/equipmentMobilization/siteAccept/siteAcceptList',
            orderNumber: 32,
            isValid: '1',
            icon: 'book',
            title: '设备进场管理',
            parentId: 1,
            component: 'RouteView',
            children: [
              {
                redirect: '',
                orderNumber: 33,
                isValid: '1',
                icon: '',
                title: '设备进场验收管理',
                parentId: 32,
                component: '',
                children: [],
                menuCode: '33',
                levelNumber: 2,
                name: '',
                menuType: '1',
                id: 33,
                key: 'siteAcceptList'
              },
              {
                redirect: '',
                orderNumber: 34,
                isValid: '1',
                icon: '',
                title: '设备材料点验单',
                parentId: 32,
                component: '',
                children: [],
                menuCode: '34',
                levelNumber: 2,
                name: '',
                menuType: '1',
                id: 34,
                key: 'materialCheckList'
              },
              {
                redirect: '',
                orderNumber: 35,
                isValid: '1',
                icon: '',
                title: '临时设施验收管理',
                parentId: 32,
                component: '',
                children: [],
                menuCode: '35',
                levelNumber: 2,
                name: '',
                menuType: '1',
                id: 35,
                key: 'facilityAcceptanceList'
              },
              {
                redirect: '',
                orderNumber: 36,
                isValid: '1',
                icon: '',
                title: '设备安装验收管理',
                parentId: 32,
                component: '',
                children: [],
                menuCode: '36',
                levelNumber: 2,
                name: '',
                menuType: '1',
                id: 36,
                key: 'InstallationAcceptanceList'
              },
              {
                redirect: '',
                orderNumber: 37,
                isValid: '1',
                icon: '',
                title: '路用车进场验收管理',
                parentId: 32,
                component: '',
                children: [],
                menuCode: '37',
                levelNumber: 2,
                name: '',
                menuType: '1',
                id: 37,
                key: 'roadTransportList'
              },
              {
                redirect: '',
                orderNumber: 90,
                isValid: '1',
                icon: '',
                title: '设备材料明细台账',
                parentId: 32,
                component: '',
                children: [],
                menuCode: '90',
                levelNumber: 2,
                name: '',
                menuType: '1',
                id: 179,
                key: 'equipMaterialLedger'
              },
              {
                redirect: '',
                orderNumber: 92,
                isValid: '1',
                icon: '',
                title: '路用车验收登记台账',
                parentId: 32,
                component: '',
                children: [],
                menuCode: '92',
                levelNumber: 2,
                name: '',
                menuType: '1',
                id: 181,
                key: 'vehicleLedger'
              }
            ],
            menuCode: '32',
            levelNumber: 2,
            name: '',
            menuType: '1',
            id: 32,
            key: 'equipmentMobilization'
          },
          {
            redirect: '/onsite/operationList',
            orderNumber: 38,
            isValid: '1',
            icon: 'form',
            title: '设备现场管理',
            parentId: 1,
            component: 'RouteView',
            children: [
              {
                redirect: '',
                orderNumber: 39,
                isValid: '1',
                icon: '',
                title: '设备运转记录表',
                parentId: 38,
                component: '',
                children: [],
                menuCode: '39',
                levelNumber: 2,
                name: '',
                menuType: '1',
                id: 39,
                key: 'operationList'
              },
              {
                redirect: '',
                orderNumber: 40,
                isValid: '1',
                icon: '',
                title: '水电抄表记录单',
                parentId: 38,
                component: '',
                children: [],
                menuCode: '40',
                levelNumber: 2,
                name: '',
                menuType: '1',
                id: 40,
                key: 'hydroelectricList'
              },
              {
                redirect: '',
                orderNumber: 41,
                isValid: '1',
                icon: '',
                title: '自有设备报停',
                parentId: 38,
                component: '',
                children: [],
                menuCode: '41',
                levelNumber: 2,
                name: '',
                menuType: '1',
                id: 41,
                key: 'newspaperStopList'
              },
              {
                redirect: '',
                orderNumber: 42,
                isValid: '1',
                icon: '',
                title: '设备维修保养记录',
                parentId: 38,
                component: '',
                children: [],
                menuCode: '42',
                levelNumber: 2,
                name: '',
                menuType: '1',
                id: 42,
                key: 'maintenanceRecordList'
              },
              {
                redirect: '',
                orderNumber: 43,
                isValid: '1',
                icon: '',
                title: '设备材料发料单',
                parentId: 38,
                component: '',
                children: [],
                menuCode: '43',
                levelNumber: 2,
                name: '',
                menuType: '1',
                id: 43,
                key: 'invoiceSheetList'
              },
              {
                redirect: '',
                orderNumber: 44,
                isValid: '1',
                icon: '',
                title: '项目设备材料列销管理',
                parentId: 38,
                component: '',
                children: [],
                menuCode: '44',
                levelNumber: 2,
                name: '',
                menuType: '1',
                id: 44,
                key: 'distributionList'
              },
              {
                redirect: '',
                orderNumber: 45,
                isValid: '1',
                icon: '',
                title: '设备盘点单',
                parentId: 38,
                component: '',
                children: [],
                menuCode: '45',
                levelNumber: 2,
                name: '',
                menuType: '1',
                id: 45,
                key: 'inventoryList'
              },
              {
                redirect: '',
                orderNumber: 46,
                isValid: '1',
                icon: '',
                title: '设备维修保养计划',
                parentId: 38,
                component: '',
                children: [],
                menuCode: '46',
                levelNumber: 2,
                name: '',
                menuType: '1',
                id: 46,
                key: 'maintenancePlanList'
              },
              {
                redirect: '',
                orderNumber: 89,
                isValid: '1',
                icon: '',
                title: '现场设备台账',
                parentId: 38,
                component: '',
                children: [],
                menuCode: '89',
                levelNumber: 2,
                name: '',
                menuType: '1',
                id: 178,
                key: 'equipLedger'
              },
              {
                redirect: '',
                orderNumber: 91,
                isValid: '1',
                icon: '',
                title: '临时设施台账',
                parentId: 38,
                component: '',
                children: [],
                menuCode: '91',
                levelNumber: 2,
                name: '',
                menuType: '1',
                id: 180,
                key: 'facilityLedger'
              }
            ],
            menuCode: '38',
            levelNumber: 2,
            name: '',
            menuType: '1',
            id: 38,
            key: 'onsite'
          },
          {
            redirect: '/safety/preWork/preWorkList',
            orderNumber: 47,
            isValid: '1',
            icon: 'thunderbolt',
            title: '安全管理',
            parentId: 1,
            component: 'RouteView',
            children: [
              {
                redirect: '',
                orderNumber: 48,
                isValid: '1',
                icon: '',
                title: '设备人员岗前安全教育',
                parentId: 47,
                component: '',
                children: [],
                menuCode: '48',
                levelNumber: 2,
                name: '',
                menuType: '1',
                id: 48,
                key: 'preWorkList'
              },
              {
                redirect: '',
                orderNumber: 49,
                isValid: '1',
                icon: '',
                title: '设备人员安全教育',
                parentId: 47,
                component: '',
                children: [],
                menuCode: '49',
                levelNumber: 2,
                name: '',
                menuType: '1',
                id: 49,
                key: 'personList'
              },
              {
                redirect: '',
                orderNumber: 50,
                isValid: '1',
                icon: '',
                title: '添乘计划',
                parentId: 47,
                component: '',
                children: [],
                menuCode: '50',
                levelNumber: 2,
                name: '',
                menuType: '1',
                id: 50,
                key: 'planList'
              },
              {
                redirect: '',
                orderNumber: 51,
                isValid: '1',
                icon: '',
                title: '添乘记录',
                parentId: 47,
                component: '',
                children: [],
                menuCode: '51',
                levelNumber: 2,
                name: '',
                menuType: '1',
                id: 51,
                key: 'addRecordList'
              },
              {
                redirect: '',
                orderNumber: 52,
                isValid: '1',
                icon: '',
                title: '设备每日检查记录表',
                parentId: 47,
                component: '',
                children: [],
                menuCode: '52',
                levelNumber: 2,
                name: '',
                menuType: '1',
                id: 52,
                key: 'everyDayList'
              },
              {
                redirect: '',
                orderNumber: 53,
                isValid: '1',
                icon: '',
                title: '设备检查记录表',
                parentId: 47,
                component: '',
                children: [],
                menuCode: '53',
                levelNumber: 2,
                name: '',
                menuType: '1',
                id: 53,
                key: 'checkResultList'
              },
              {
                redirect: '',
                orderNumber: 54,
                isValid: '1',
                icon: '',
                title: '问题整改记录表',
                parentId: 47,
                component: '',
                children: [],
                menuCode: '54',
                levelNumber: 2,
                name: '',
                menuType: '1',
                id: 54,
                key: 'questionList'
              }
            ],
            menuCode: '47',
            levelNumber: 2,
            name: '',
            menuType: '1',
            id: 47,
            key: 'safety'
          },
          {
            redirect: '/settlement/depreciationFixedList',
            orderNumber: 55,
            isValid: '1',
            icon: 'pay-circle',
            title: '结算管理',
            parentId: 1,
            component: 'RouteView',
            children: [
              {
                redirect: '',
                orderNumber: 56,
                isValid: '1',
                icon: '',
                title: '公司固资设备折旧管理',
                parentId: 55,
                component: '',
                children: [],
                menuCode: '56',
                levelNumber: 2,
                name: '',
                menuType: '1',
                id: 56,
                key: 'depreciationFixedList'
              },
              {
                redirect: '',
                orderNumber: 57,
                isValid: '1',
                icon: '',
                title: '设备周转材料摊销管理',
                parentId: 55,
                component: '',
                children: [],
                menuCode: '57',
                levelNumber: 2,
                name: ' ',
                menuType: '1',
                id: 57,
                key: 'apitalMaterialList'
              },
              {
                redirect: '',
                orderNumber: 58,
                isValid: '1',
                icon: '',
                title: '租赁设备结算管理',
                parentId: 55,
                component: '',
                children: [],
                menuCode: '58',
                levelNumber: 2,
                name: '',
                menuType: '1',
                id: 58,
                key: 'settlementLeasedList'
              },
              {
                redirect: '',
                orderNumber: 59,
                isValid: '1',
                icon: '',
                title: '设备维修结算管理',
                parentId: 55,
                component: '',
                children: [],
                menuCode: '59',
                levelNumber: 2,
                name: '',
                menuType: '1',
                id: 59,
                key: 'equipRepairList'
              },
              {
                redirect: '',
                orderNumber: 60,
                isValid: '1',
                icon: '',
                title: '设备临电安拆结算管理',
                parentId: 55,
                component: '',
                children: [],
                menuCode: '60',
                levelNumber: 2,
                name: '',
                menuType: '1',
                id: 60,
                key: 'demolitionStatement'
              },
              {
                redirect: '',
                orderNumber: 61,
                isValid: '1',
                icon: '',
                title: '路用车使用费结算管理',
                parentId: 55,
                component: '',
                children: [],
                menuCode: '61',
                levelNumber: 2,
                name: '',
                menuType: '1',
                id: 61,
                key: 'vehicleCost'
              },
              {
                redirect: '',
                orderNumber: 62,
                isValid: '1',
                icon: '',
                title: '设备材料费用结算管理',
                parentId: 55,
                component: '',
                children: [],
                menuCode: '62',
                levelNumber: 2,
                name: '',
                menuType: '1',
                id: 62,
                key: 'materialCost'
              },
              {
                redirect: '',
                orderNumber: 63,
                isValid: '1',
                icon: '',
                title: '对外付款申请',
                parentId: 55,
                component: '',
                children: [],
                menuCode: '63',
                levelNumber: 2,
                name: '',
                menuType: '1',
                id: 63,
                key: 'externalPayment'
              },
              {
                redirect: '',
                orderNumber: 32,
                isValid: '1',
                icon: '',
                title: '月度资金计划',
                parentId: 55,
                component: '',
                children: [],
                menuCode: '64',
                levelNumber: 2,
                name: '',
                menuType: '1',
                id: 64,
                key: 'monthlyCapital'
              }
            ],
            menuCode: '55',
            levelNumber: 2,
            name: '',
            menuType: '1',
            id: 55,
            key: 'settlement'
          },
          {
            redirect: '/computation/equipFee/equipFeeList',
            orderNumber: 65,
            isValid: '1',
            icon: 'red-envelope',
            title: '核算管理',
            parentId: 1,
            component: 'RouteView',
            children: [
              {
                redirect: '',
                orderNumber: 66,
                isValid: '1',
                icon: '',
                title: '设备费用扣款单管理',
                parentId: 65,
                component: '',
                children: [],
                menuCode: '66',
                levelNumber: 2,
                name: '',
                menuType: '1',
                id: 66,
                key: 'equipFeeList'
              },
              {
                redirect: '',
                orderNumber: 67,
                isValid: '1',
                icon: '',
                title: '水电费扣款单管理',
                parentId: 65,
                component: '',
                children: [],
                menuCode: '67',
                levelNumber: 2,
                name: '',
                menuType: '1',
                id: 67,
                key: 'waterList'
              },
              {
                redirect: '',
                orderNumber: 68,
                isValid: '1',
                icon: '',
                title: '实际设备成本关联单位工程',
                parentId: 65,
                component: '',
                children: [],
                menuCode: '68',
                levelNumber: 2,
                name: '',
                menuType: '1',
                id: 68,
                key: 'actualCostList'
              },
              {
                redirect: '',
                orderNumber: 69,
                isValid: '1',
                icon: '',
                title: '设备成本分析',
                parentId: 65,
                component: '',
                children: [],
                menuCode: '69',
                levelNumber: 2,
                name: '',
                menuType: '1',
                id: 69,
                key: 'equipCostList'
              },
              {
                redirect: '',
                orderNumber: 70,
                isValid: '1',
                icon: '',
                title: '单机核算',
                parentId: 65,
                component: '',
                children: [],
                menuCode: '70',
                levelNumber: 2,
                name: '',
                menuType: '1',
                id: 70,
                key: 'accountList'
              }
            ],
            menuCode: '65',
            levelNumber: 2,
            name: '',
            menuType: '1',
            id: 65,
            key: 'computation'
          },
          {
            redirect: '/equipExit/plan/planList',
            orderNumber: 71,
            isValid: '1',
            icon: 'minus-circle',
            title: '退场管理',
            parentId: 1,
            component: 'RouteView',
            children: [
              {
                redirect: '',
                orderNumber: 72,
                isValid: '1',
                icon: '',
                title: '设备退场计划管理',
                parentId: 71,
                component: '',
                children: [],
                menuCode: '72',
                levelNumber: 2,
                name: '',
                menuType: '1',
                id: 72,
                key: 'planExitList'
              },
              {
                redirect: '',
                orderNumber: 73,
                isValid: '1',
                icon: '',
                title: '租赁设备管理',
                parentId: 71,
                component: '',
                children: [],
                menuCode: '73',
                levelNumber: 2,
                name: '',
                menuType: '1',
                id: 73,
                key: 'leaseOutList'
              },
              {
                redirect: '',
                orderNumber: 703,
                isValid: '1',
                icon: '',
                title: '退场设备材料盘点',
                parentId: 71,
                component: '',
                children: [],
                menuCode: '703',
                levelNumber: 2,
                name: '',
                menuType: '1',
                id: 703,
                key: 'equipmentExitInventory'
              },
              {
                redirect: '',
                orderNumber: 704,
                isValid: '1',
                icon: '',
                title: '自有设备检定管理',
                parentId: 71,
                component: '',
                children: [],
                menuCode: '704',
                levelNumber: 2,
                name: '',
                menuType: '1',
                id: 704,
                key: 'ownEquipmentList'
              },
              {
                redirect: '',
                orderNumber: 705,
                isValid: '1',
                icon: '',
                title: '分包商设备退场登记',
                parentId: 71,
                component: '',
                children: [],
                menuCode: '705',
                levelNumber: 2,
                name: '',
                menuType: '1',
                id: 705,
                key: 'equipmentExitSubcontractor'
              },
            ],
            menuCode: '71',
            levelNumber: 2,
            name: '',
            menuType: '1',
            id: 71,
            key: 'equipExit'
          },
          {
            redirect: '/pricepool/procurementList',
            orderNumber: 74,
            isValid: '1',
            icon: 'calculator',
            title: '价格库管理',
            parentId: 1,
            component: 'RouteView',
            children: [
              {
                redirect: '',
                orderNumber: 75,
                isValid: '1',
                icon: '',
                title: '设备采购价格库',
                parentId: 74,
                component: '',
                children: [],
                menuCode: '75',
                levelNumber: 2,
                name: '',
                menuType: '1',
                id: 75,
                key: 'procurementList'
              },
              {
                redirect: '',
                orderNumber: 76,
                isValid: '1',
                icon: '',
                title: '设备租赁价格库',
                parentId: 74,
                component: '',
                children: [],
                menuCode: '76',
                levelNumber: 2,
                name: '',
                menuType: '1',
                id: 76,
                key: 'leasepriceList'
              }
            ],
            menuCode: '74',
            levelNumber: 2,
            name: '',
            menuType: '1',
            id: 74,
            key: 'pricepool'
          },
          {
            redirect: '/database/databaseList',
            orderNumber: 77,
            isValid: '1',
            icon: 'database',
            title: '资料库管理',
            parentId: 1,
            component: 'RouteView',
            children: [
              {
                redirect: '',
                orderNumber: 78,
                isValid: '1',
                icon: '',
                title: '资料库',
                parentId: 77,
                component: '',
                children: [],
                menuCode: '78',
                levelNumber: 2,
                name: '',
                menuType: '1',
                id: 78,
                key: 'databaseList'
              }
            ],
            menuCode: '77',
            levelNumber: 2,
            name: '',
            menuType: '1',
            id: 77,
            key: 'database'
          },
          {
            redirect: '/resource/resourceList',
            orderNumber: 79,
            isValid: '1',
            icon: 'global',
            title: '资源库管理',
            parentId: 1,
            component: 'RouteView',
            children: [
              {
                redirect: '',
                orderNumber: 80,
                isValid: '1',
                icon: '',
                title: '设备资料库',
                parentId: 79,
                component: '',
                children: [],
                menuCode: '80',
                levelNumber: 2,
                name: '',
                menuType: '1',
                id: 80,
                key: 'resourceList'
              },
              {
                redirect: '',
                orderNumber: 81,
                isValid: '1',
                icon: '',
                title: '设备材料资料库',
                parentId: 79,
                component: '',
                children: [],
                menuCode: '81',
                levelNumber: 2,
                name: '',
                menuType: '1',
                id: 81,
                key: 'materialResourceList'
              }
            ],
            menuCode: '79',
            levelNumber: 2,
            name: '',
            menuType: '1',
            id: 79,
            key: 'resource'
          }
        ],
        menuCode: '1',
        levelNumber: 1,
        name: 'index',
        menuType: '1',
        id: 1,
        key: ''
      },
      order: 1
    },
    status: '0'
  }
}

Mock.mock(/\/api\/user\/info/, 'post', info)
Mock.mock(/\/api\/functionMenu\/menuTreeInfo/, 'get', menu)
Mock.mock(/\/business\/refresh/, 'post', menu)