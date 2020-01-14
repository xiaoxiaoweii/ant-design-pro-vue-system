import Vue from 'vue'
import { getRouterByUser } from '@/api/user'
import { ACCESS_TOKEN } from '@/store/mutation-types'
// eslint-disable-next-line
import { UserLayout, BasicLayout, RouteView, BlankLayout, PageView } from '@/layouts'
import { purchase } from '@/core/icons'

// 前端路由表
const constantRouterComponents = {
  // 基础页面 layout 必须引入
  BasicLayout: BasicLayout,
  BlankLayout: BlankLayout,
  RouteView: RouteView,
  PageView: PageView,

  // 你需要动态引入的页面组件
  analysis: () => import('@/views/dashboard/Analysis'),
  // workplace: () => import('@/views/dashboard/Workplace'),
  workplace: () => import('@/views/dashboard/plain'),

  monitor: () => import('@/views/dashboard/Monitor'),

  // forms
  basicForm: () => import('@/views/form/BasicForm'),
  stepForm: () => import('@/views/form/stepForm/StepForm'),
  advancedForm: () => import('@/views/form/advancedForm/AdvancedForm'),

  // list
  tableList: () => import('@/views/list/TableList'),
  standardList: () => import('@/views/list/StandardList'),
  cardList: () => import('@/views/list/CardList'),
  article: () => import('@/views/list/search/Article'),
  projects: () => import('@/views/list/search/Projects'),
  applications: () => import('@/views/list/search/Applications'),

  // profile
  profileBasic: () => import('@/views/profile/basic/Index'),
  profileAdvanced: () => import('@/views/profile/advanced/Advanced'),

  // result
  resultSuccess: () => import('@/views/result/Success'),
  resultFail: () => import('@/views/result/Error'),

  // Exception
  403: () => import('@/views/exception/403'),
  404: () => import('@/views/exception/404'),
  500: () => import('@/views/exception/500'),

  // account
  center: () => import('@/views/account/center/Index'),
  settings: () => import('@/views/account/settings/Index'),
  baseSetting: () => import('@/views/account/settings/BaseSetting'),
  security: () => import('@/views/account/settings/Security'),
  custom: () => import('@/views/account/settings/Custom'),
  binding: () => import('@/views/account/settings/Binding'),
  notification: () => import('@/views/account/settings/Notification'),

  // other
  iconSelectorView: () => import('@/views/other/IconSelectorView'),
  treeList: () => import('@/views/other/TreeList'),
  tableInnereditList: () => import('@/views/other/TableInnerEditList'),
  userList: () => import('@/views/other/UserList'),
  roleList: () => import('@/views/other/RoleList'),
  // permissionList: () => import('@/views/other/PermissionList'),

  // purchase 购置管理
  requisition: () => import('@/views/purchase/PurchaseList'),

  // database 资料库
  databaseList: () => import('@/views/database/DatabaseList'),

  // Roadvehicle 路用车
  roadvehicleList: () => import('@/views/planManagement/Roadvehicle/RoadvehicleList'),
  roadvehicleNew: () => import('@/views/planManagement/Roadvehicle/table/New'),
  roadvehicleEdit: () => import('@/views/planManagement/Roadvehicle/table/Edit'),

  // Temporary 临时设施需求
  temporaryList: () => import('@/views/planManagement/Temporary/TemporaryList'),
  temporaryNew: () => import('@/views/planManagement/Temporary/table/New1'),
  temporaryEdit: () => import('@/views/planManagement/Temporary/table/Edit'),

  // configuration 材料配置
  configurationList: () => import('@/views/planManagement/Configuration/ConfigurationList'),
  configurationNew: () => import('@/views/planManagement/Configuration/table/New'),
  configurationEdit: () => import('@/views/planManagement/Configuration/table/Edit'),
  //设备成本责任预算
  111:()=>import('@/views/planManagement/equipmentCost/equipmentCostList'),
  quarterCost:()=>import('@/views/planManagement/quarterCost/quarterCostList'),
  quarterCostNew:()=>import('@/views/planManagement/quarterCost/table/New'),
  quarterCostEdit:()=>import('@/views/planManagement/quarterCost/table/Edit'),

  // EquipmentLease 设备租赁申请表
  equipmentLeaseList: () => import('@/views/planManagement/EquipmentLease/EquipmentLeaseList'),
  equipmentLeaseNew: () => import('@/views/planManagement/EquipmentLease/table/New'),
  equipmentLeaseEdit: () => import('@/views/planManagement/EquipmentLease/table/Edit'),


  // Rental 设备出租申请
  rentalList: () => import('@/views/planManagement/Rental/RentalList'),
  rentalNew:() => import('@/views/planManagement/Rental/table/New'),
  rentalEdit:() => import('@/views/planManagement/Rental/table/Edit'),
  // planManagement
  requireList: () => import('@/views/planManagement/require/RequireList'),
  requireNew: () => import('@/views/planManagement/require/table/New'),
  requireEdit: () => import('@/views/planManagement/require/table/Edit'),

  // 设备材料配件
  materialList: () => import('@/views/planManagement/materialProcurement/materialList'),
  materialNew: () => import('@/views/planManagement/materialProcurement/table/New'),
  materialEdit: () => import('@/views/planManagement/materialProcurement/table/Edit'),

  // 设备维修
  maintenanceList: () => import('@/views/planManagement/maintenance/maintenanceList'),
  maintenanceNew: () => import('@/views/planManagement/maintenance/table/New'),
  maintenanceEdit: () => import('@/views/planManagement/maintenance/table/Edit'),

  // 设备安拆
  DemolitionList: () => import('@/views/planManagement/Demolition/DemolitionList'),
  DemolitionNew:()=>import('@/views/planManagement/Demolition/table/New'),
  DemolitionEdit:()=>import('@/views/planManagement/Demolition/table/Edit'),

  // 临时设施
  facilitiesList: () => import('@/views/planManagement/facilities/facilitiesList'),
  facilitiesNew: () => import('@/views/planManagement/facilities/table/New'),
  facilitiesEdit: () => import('@/views/planManagement/facilities/table/Edit'),

  // 设备运输
  // transformsList: () => import('@/views/planManagement/transform1/transfrom1List'),
  facitransformsList: () => import('@/views/planManagement/transform/transformList'),
  facitransformsNew: () => import('@/views/planManagement/transform/table/New'),
  facitransformsEdit: () => import('@/views/planManagement/transform/table/Edit'),

  // 设备采购价格库
  procurementList: () => import('@/views/pricepool/Procurement/ProcurementList'),

  // 设备租赁价格库
  leasepriceList: () => import('@/views/pricepool/Leaseprice/LeasepriceList'),
  //设备材料减少
  disposalsList: () => import('@/views/planManagement/disposal/disposalList'),
  disposalsNew: () => import('@/views/planManagement/disposal/table/New'),
  disposalsEdit: () => import('@/views/planManagement/disposal/table/Edit'),

  // 设备进场管理
  equipMaterialLedger: () => import('@/views/equipmentMobilization/equipMaterialLedger/equipMaterialLedger'),

  vehicleLedger: () => import('@/views/equipmentMobilization/vehicleLedger/vehicleLedger'),
  
  siteAcceptList: () => import('@/views/equipmentMobilization/siteAccept/siteAcceptList'),
  siteAcceptNew: () => import('@/views/equipmentMobilization/siteAccept/table/New'),
  siteAcceptEdit: () => import('@/views/equipmentMobilization/siteAccept/table/Edit'),

  materialCheckList: () => import('@/views/equipmentMobilization/materialCheck/materialCheckList'),
  materialCheckNew: () => import('@/views/equipmentMobilization/materialCheck/table/New'),
  materialCheckEdit: () => import('@/views/equipmentMobilization/materialCheck/table/Edit'),

  facilityAcceptanceList: () => import('@/views/equipmentMobilization/facilityAcceptance/facilityAcceptanceList'),
  facilityAcceptanceNew: () => import('@/views/equipmentMobilization/facilityAcceptance/table/New'),
  facilityAcceptanceEdit: () => import('@/views/equipmentMobilization/facilityAcceptance/table/Edit'),

  InstallationAcceptanceList: () => import('@/views/equipmentMobilization/InstallationAcceptance/InstallationAcceptanceList'),
  InstallationAcceptanceNew: () => import('@/views/equipmentMobilization/InstallationAcceptance/table/New'),
  InstallationAcceptanceEdit: () => import('@/views/equipmentMobilization/InstallationAcceptance/table/Edit'),

  roadTransportList: () => import('@/views/equipmentMobilization/roadTransport/roadTransportList'),
  roadTransportNew: () => import('@/views/equipmentMobilization/roadTransport/table/New'),
  roadTransportEdit: () => import('@/views/equipmentMobilization/roadTransport/table/Edit'),

  // 安全管理
  preWorkList: () => import('@/views/safety/preWork/preWorkList'),
  personList: () => import('@/views/safety/person/personList'),
  planList: () => import('@/views/safety/plan/planList'),
  addRecordList: () => import('@/views/safety/addRecord/addRecordList'),
  everyDayList: () => import('@/views/safety/everyDay/everyDayList'),
  checkResultList: () => import('@/views/safety/checkResult/checkResultList'),
  questionList: () => import('@/views/safety/question/questionList'),
  // 核算管理
  equipFeeList: () => import('@/views/computation/equipFee/equipFeeList'),
  equipFeeNew: () => import('@/views/computation/equipFee/table/New'),
  equipFeeEdit: () => import('@/views/computation/equipFee/table/Edit'),

  waterList: () => import('@/views/computation/water/waterList'),
  waterFeeNew: () => import('@/views/computation/water/table/New'),
  waterFeeEdit: () => import('@/views/computation/water/table/Edit'),

  actualCostList: () => import('@/views/computation/actualCost/actualCostList'),
  equipCostList: () => import('@/views/computation/equipCost/equipCostList'),
  accountList: () => import('@/views/computation/account/accountList'),
  // 退场管理
  planExitList: () => import('@/views/equipExit/plan/index.vue'),
  equipExitPlanNew: () => import('@/views/equipExit/plan/table/New'),
  equipExitPlanEdit: () => import('@/views/equipExit/plan/table/Edit'),
  leaseOutList: () => import('@/views/equipExit/leaseOut/index'),
  leaseOutNew: () => import('@/views/equipExit/leaseOut/table/New'),
  leaseOutEdit: () => import('@/views/equipExit/leaseOut/table/Edit'),
  haveExitList: () => import('@/views/equipExit/ownManage/index'),
  haveExitNew: () => import('@/views/equipExit/ownManage/table/New'),
  haveExitEdit: () => import('@/views/equipExit/ownManage/table/Edit'),
  materialsExitList: () => import('@/views/equipExit/inventory/index'),
  materialsExitNew: () => import('@/views/equipExit/inventory/table/New'),
  materialsExitEdit: () => import('@/views/equipExit/inventory/table/Edit'),
  subcontractorExitList: () => import('@/views/equipExit/subcontractor/index'),
  subcontractorNew:() => import('@/views/equipExit/subcontractor/table/New'),
  subcontractorEdit:() => import('@/views/equipExit/subcontractor/table/Edit'),
  equipExitInventoryNew:() => import('@/views/equipExit/inventory/table/New'),
  equipExitInventoryEdit:() => import('@/views/equipExit/inventory/table/Edit'),
  // resource
  resourceList: () => import('@/views/repository/resource/resourceList'),

  materialResourceList: () => import('@/views/repository/material/materialList'),

  //-----------------设备现场管理开始---------
  // 设备运转记录表  Operation
  operationList: () => import('@/views/onsite/Operation/OperationList'),   
  operationNew: () => import('@/views/onsite/Operation/table/New'),
  operationEdit: () => import('@/views/onsite/Operation/table/Edit'),
  
  //现场设备台账
  equipLedger: () => import('@/views/onsite/EquipLedger/EquipLedgerList'),   
  //临电台账
  facilityElectricityLedger: () => import('@/views/onsite/FacilityLedger/FacilityLedgerList'),   
  
   //临电台账
   facilityWaterLedger: () => import('@/views/onsite/FacilityWaterLedger/FacilityWaterLedgerList'),   
  
  // 水电抄表记录单  
  hydroelectricList: () => import('@/views/onsite/Hydroelectric/HydroelectricList'),
  hydroelectricNew: () => import('@/views/onsite/Hydroelectric/table/New'),
  hydroelectricEdit: () => import('@/views/onsite/Hydroelectric/table/Edit'),

  // 自有设备报停  newspaperStopList
  newspaperStopList: () => import('@/views/onsite/NewspaperStop/NewspaperStopList'),   
  newspaperStopNew: () => import('@/views/onsite/NewspaperStop/table/New'),
  newspaperStopEdit: () => import('@/views/onsite/NewspaperStop/table/Edit'),

  // 自有设备报停启动  newspaperStopList
  newspaperStopstartUpList: () => import('@/views/onsite/NewspaperStopstartUp/NewspaperStopstartUpList'),   
  newspaperStopstartUpNew: () => import('@/views/onsite/NewspaperStopstartUp/table/New'),
  newspaperStopstartUpEdit: () => import('@/views/onsite/NewspaperStopstartUp/table/Edit'),

  // 设备维修保养记录  maintenanceRecordList
  maintenanceRecordList: () => import('@/views/onsite/MaintenanceRecord/MaintenanceRecordList'),
  maintenanceRecordNew: () => import('@/views/onsite/MaintenanceRecord/table/New'),
  maintenanceRecordEdit: () => import('@/views/onsite/MaintenanceRecord/table/Edit'),
  
  // 设备维修保养计划  
  maintenancePlanList: () => import('@/views/onsite/MaintenancePlan/MaintenancePlanList'),
  maintenancePlanNew: () => import('@/views/onsite/MaintenancePlan/table/New'),
  maintenancePlanEdit: () => import('@/views/onsite/MaintenancePlan/table/Edit'),

  //设备运转记录汇总表
  operationSummary: () => import('@/views/onsite/OperationSummary/OperationSummaryList'),

  // 设备材料发料单  invoiceSheetList
  invoiceSheetList: () => import('@/views/onsite/InvoiceSheet/InvoiceSheetList'),
  invoiceSheetNew: () => import('@/views/onsite/InvoiceSheet/table/New'),
  invoiceSheetEdit: () => import('@/views/onsite/InvoiceSheet/table/Edit'),

   // 项目设备材料列销管理  invoiceSheetList
   distributionList: () => import('@/views/onsite/Distribution/DistributionList'),
   distributionNew: () => import('@/views/onsite/Distribution/table/New'),
   distributionEdit: () => import('@/views/onsite/Distribution/table/Edit'),

     // 设备盘点单  inventoryList
   inventoryList: () => import('@/views/onsite/Inventory/InventoryList'),
   inventoryEdit: () => import('@/views/onsite/Inventory/table/Edit'),

   //设备材料价格库
   materialPriceList: () => import('@/views/onsite/MaterialPrice/MaterialPriceList'),
  //-----------------设备现场管理结束---------

  
  // 公司固资设备折旧管理	DepreciationFixed
  depreciationFixedList: () => import('@/views/settlement/DepreciationFixed/DepreciationFixedList'),
  depreciationFixedEdit: () => import('@/views/settlement/DepreciationFixed/table/Edit'),
  depreciationFixedNew: () => import('@/views/settlement/DepreciationFixed/table/New'),

  // 设备周转材料摊销管理	ApitalMaterialList
  apitalMaterialList: () => import('@/views/settlement/ApitalMaterial/ApitalMaterialList'),
  apitalMaterialNew: () => import('@/views/settlement/ApitalMaterial/table/New'),
  apitalMaterialEdit: () => import('@/views/settlement/ApitalMaterial/table/Edit'),

  // 水电费结算管理	hydroPower
  hydroPowerList: () => import('@/views/settlement/hydroPower/hydroPowerList'),
  hydroPowerNew: () => import('@/views/settlement/hydroPower/table/New'),
  hydroPowerEdit: () => import('@/views/settlement/hydroPower/table/Edit'),

  // 租赁设备结算管理	settlementLeasedList
  settlementLeasedList: () => import('@/views/settlement/SettlementLeased/SettlementLeasedList'),
  settlementLeasedEdit: () => import('@/views/settlement/SettlementLeased/table/Edit'),
  settlementLeasedNew: () => import('@/views/settlement/SettlementLeased/table/New'),

  // 设备维修结算管理	equipRepairList
  equipRepairList: () => import('@/views/settlement/EquipRepair/EquipRepairList'),
  equipRepairNew: () => import('@/views/settlement/EquipRepair/table/New'),
  equipRepairEdit: () => import('@/views/settlement/EquipRepair/table/Edit'),

  // 设备临电安拆结算管理
  demolitionStatement: () => import('@/views/settlement/DemolitionStatement/DemolitionStatementList'),
  demolitionStatementNew: () => import('@/views/settlement/DemolitionStatement/table/New'),
  demolitionStatementEdit: () => import('@/views/settlement/DemolitionStatement/table/Edit'),

  // 路用车使用费结算管理
  vehicleCost: () => import('@/views/settlement/VehicleCost/VehicleCostList'),
  vehicleCostNew: () => import('@/views/settlement/VehicleCost/table/New'),
  vehicleCostEdit: () => import('@/views/settlement/VehicleCost/table/Edit'),
  
  // 设备材料费用结算
  materialCost: () => import('@/views/settlement/MaterialCost/MaterialCostList'),
  materialCostNew: () => import('@/views/settlement/MaterialCost/table/New'),
  materialCostEdit: () => import('@/views/settlement/MaterialCost/table/Edit'),

  // 设备结算费用统计
  equipClearingFeeList: () => import('@/views/settlement/EquipClearingFee/EquipClearingFeeList'),
  equipClearingFeeNew: () => import('@/views/settlement/EquipClearingFee/table/New'),
  equipClearingFeeEdit: () => import('@/views/settlement/EquipClearingFee/table/Edit'),

  // 对外付款申请
  externalPayment: () => import('@/views/settlement/ExternalPayment/ExternalPaymentList'),
  // 月度资金计划
  monthlyCapital: () => import('@/views/settlement/MonthlyCapital/MonthlyCapitalList'),
  // system
  logList: () => import('@/views/system/log/LogList'),
  dictionaryList: () => import('@/views/system/dictionary/DictionaryList'),
  permissionList: () => import('@/views/system/permission/PermissionList'),
  utilityList: () => import('@/views/system/utility/UtilityList'),
  mechanismList: () => import('@/views/system/mechanism/MechanismList')
}

// 前端自定义路由项[新增]
const constantRouters = {
  equipmentMobilization: [
    {
      key: 'siteAcceptNew',
      title: '新建进场验收单',
      hidden: true
    },
    {
      key: 'siteAcceptEdit',
      title: '编辑进场验收单',
      hidden: true
    },
    {
      key: 'materialCheckNew',
      title: '新建材料点验单',
      hidden: true
    },
    {
      key: 'materialCheckEdit',
      title: '编辑材料点验单',
      hidden: true
    },
    {
      key: 'facilityAcceptanceNew',
      title: '新建临时设施验收单',
      hidden: true
    },
    {
      key: 'facilityAcceptanceEdit',
      title: '编辑临时设施验收单',
      hidden: true
    },
    {
      key: 'InstallationAcceptanceNew',
      title: '新建设备安装验收单',
      hidden: true
    },
    {
      key: 'InstallationAcceptanceEdit',
      title: '编辑设备安装验收单',
      hidden: true
    },
    {
      key: 'roadTransportNew',
      title: '新建路用车进场验收单',
      hidden: true
    },
    {
      key: 'roadTransportEdit',
      title: '编辑路用车进场验收单',
      hidden: true
    }
    
  ],
  accounts: [
    {
      key: 'assetChangeNew',
      title: '新建资产变更单',
      hidden: true
    },
    {
      key: 'assetChangeEdit',
      title: '编辑资产变更单',
      hidden: true
    },
    {
      key: 'disposalNew',
      title: '新建资产处置单',
      hidden: true
    },
  ],
  planManagement: [
    {
      key: 'requireNew',
      title: '新建设备需求',
      hidden: true
    },
    {
      key: 'requireEdit',
      title: '编辑设备需求',
      hidden: true
    },
    {
      key: 'temporaryNew',
      title: '新建临时设施需求',
      hidden: true
    },
    {
      key: 'temporaryEdit',
      title: '编辑临时设施需求',
      hidden: true
    },
    {
      key: 'configurationNew',
      title: '新建材料配置计划',
      hidden: true
    },
    {
      key: 'configurationEdit',
      title: '编辑材料配置计划',
      hidden: true
    },
    {
      key: 'roadvehicleNew',
      title: '新建路用车需求计划',
      hidden: true
    },
    {
      key: 'roadvehicleEdit',
      title: '编辑路用车需求计划',
      hidden: true
    },
    {
      key: 'equipmentLeaseNew',
      title: '新建设备租赁申请单',
      hidden: true
    },
    {
      key: 'equipmentLeaseEdit',
      title: '编辑设备租赁申请单',
      hidden: true
    },
    {
      key: 'rentalNew',
      title: '新建设备出租申请单',
      hidden: true
    },
    {
      key: 'rentalEdit',
      title: '编辑设备出租申请单',
      hidden: true
    },
    {
      key: 'materialNew',
      title: '新建设备材料配件采购申请单',
      hidden: true
    },
    {
      key: 'materialEdit',
      title: '编辑设备材料配件采购申请单',
      hidden: true
    },
    {
      key: 'maintenanceNew',
      title: '新建设备维修(改造)申请单',
      hidden: true
    },
    {
      key: 'maintenanceEdit',
      title: '编辑设备维修(改造)申请单',
      hidden: true
    },
    {
      key: 'DemolitionNew',
      title: '新建设备安拆申请单',
      hidden: true
    },
    {
      key: 'DemolitionEdit',
      title: '编辑设备安拆申请单',
      hidden: true
    },
    {
      key: 'facilitiesNew',
      title: '新建临时设施安拆申请单',
      hidden: true
    },
    {
      key: 'facilitiesEdit',
      title: '编辑临时设施安拆申请单',
      hidden: true
    },
    {
      key: 'facitransformsNew',
      title: '新建设备运输申请单',
      hidden: true
    },
    {
      key: 'facitransformsEdit',
      title: '编辑设备运输申请单',
      hidden: true
    },
    {
      key: 'disposalsNew',
      title: '新建设备材料减少申请单',
      hidden: true
    },
    {
      key: 'disposalsEdit',
      title: '编辑设备材料减少申请单',
      hidden: true
    },
    {
      key: 'quarterCostNew',
      title: '新建季度成本资金计划单',
      hidden: true
    },
    {
      key: 'quarterCostEdit',
      title: '编辑季度成本资金计划单',
      hidden: true
    }
  ],
  onsite:[ 
    {
      key:'operationNew',
      title:'新增设备运转记录表',
      hidden:true
    },    
    {
      key:'operationEdit',
      title:'编辑设备运转记录表',
      hidden:true
    },
    {
      key:'maintenanceRecordNew',
      title:'新增设备保养记录',
      hidden:true
    },
    {
      key:'maintenanceRecordEdit',
      title:'编辑设备保养记录',
      hidden:true
    },
    {
      key:'maintenancePlanNew',
      title:'新增设备保养计划',
      hidden:true
    },
    {
      key:'maintenancePlanEdit',
      title:'编辑设备保养计划',
      hidden:true
    },
    {
      key:'hydroelectricNew',
      title:'新增水电抄表',
      hidden:true
    },
    {
      key:'hydroelectricEdit',
      title:'编辑水电抄表',
      hidden:true
    },
    {
      key:'invoiceSheetNew',
      title:'新增发料单',
      hidden:true
    },
    {
      key:'invoiceSheetEdit',
      title:'编辑发料单',
      hidden:true
    },
    {
      key:'distributionNew',
      title:'新增材料列销管理',
      hidden:true
    },
    {
      key:'distributionEdit',
      title:'编辑材料列销管理',
      hidden:true
    },
    {
      key:'inventoryEdit',
      title:'编辑设备盘点单',
      hidden:true
    },
    {
      key:'newspaperStopNew',
      title:'新增自有设备报停',
      hidden:true
    },
    {
      key:'newspaperStopEdit',
      title:'编辑自有设备报停',
      hidden:true
    },
    {
      key:'newspaperStopstartUpNew',
      title:'新增自有设备报停',
      hidden:true
    },
    {
      key:'newspaperStopstartUpEdit',
      title:'编辑自有设备报停',
      hidden:true
    },
  ],
  settlement: [
    {
      key: 'depreciationFixedNew',
      title: '新建公司固资设备折旧单',
      hidden: true
    },
    {
      key: 'depreciationFixedEdit',
      title: '编辑公司固资设备折旧单',
      hidden: true
    },
    {
      key: 'apitalMaterialNew',
      title: '新建周转材料摊销单',
      hidden: true
    },
    {
      key: 'apitalMaterialEdit',
      title: '编辑周转材料摊销单',
      hidden: true
    },
    {
      key: 'demolitionStatementNew',
      title: '新建安拆运输结算单',
      hidden: true
    },
    {
      key: 'demolitionStatementEdit',
      title: '编辑安拆运输结算单',
      hidden: true
    },
    {
      key: 'hydroPowerNew',
      title: '新建水电费结算单',
      hidden: true
    },
    {
      key: 'hydroPowerEdit',
      title: '编辑水电费结算单',
      hidden: true
    },
    {
      key: 'settlementLeasedNew',
      title: '新建租赁设备结算单',
      hidden: true
    },
    {
      key: 'settlementLeasedEdit',
      title: '编辑租赁设备结算单',
      hidden: true
    },
    {
      key: 'equipRepairNew',
      title: '新建设备维修结算单',
      hidden: true
    },
    {
      key: 'equipRepairEdit',
      title: '编辑设备维修结算单',
      hidden: true
    },
    {
      key: 'materialCostNew',
      title: '新建设备材料结算单',
      hidden: true
    },
    {
      key: 'materialCostEdit',
      title: '编辑设备材料结算单',
      hidden: true
    },
    {
      key: 'equipClearingFeeNew',
      title: '新建设备费用统计单',
      hidden: true
    },
    {
      key: 'equipClearingFeeEdit',
      title: '编辑设备费用统计单',
      hidden: true
    },
    {
      key: 'vehicleCostNew',
      title: '新建路用车使用费结算单',
      hidden: true
    },
    {
      key: 'vehicleCostEdit',
      title: '编辑路用车使用费结算单',
      hidden: true
    }
  ],
  equipExit: [
    {
      key: 'equipExitPlanNew',
      title: '新建设备退场计划单',
      hidden: true
    },
    {
      key: 'equipExitPlanEdit',
      title: '编辑设备退场计划单',
      hidden: true
    },
    {
      key: 'subcontractorNew',
      title: '新建分包商设备退场登记',
      hidden: true
    },
    {
      key: 'subcontractorEdit',
      title: '编辑分包商设备退场登记',
      hidden: true
    },
    {
      key: 'equipExitInventoryNew',
      title: '新建设备材料盘点单',
      hidden: true
    },
    {
      key: 'equipExitInventoryEdit',
      title: '编辑设备材料盘点单',
      hidden: true
    },
    {
      key: 'leaseOutNew',
      title: '新建租赁设备退场计划单',
      hidden: true,
      keepAlive: true
    },
    {
      key: 'leaseOutEdit',
      title: '编辑租赁设备退场计划单',
      hidden: true
    },
    {
      key: 'haveExitNew',
      title: '新建自有设备鉴定单',
      hidden: true,
      keepAlive: true
    },
    {
      key: 'haveExitEdit',
      title: '编辑自有设备鉴定单',
      hidden: true
    },
    {
      key: 'materialsExitNew',
      title: '新建退场设备材料盘点单',
      hidden: true,
      keepAlive: true
    },
    {
      key: 'materialsExitEdit',
      title: '编辑退场设备材料盘点单',
      hidden: true
    }
  ],

  //设备核算
  computation: [
    {
      key: 'equipFeeNew',
      title: '新建设备费用扣款单',
      hidden: true
    },
    {
      key: 'equipFeeEdit',
      title: '编辑设备费用扣款单',
      hidden: true
    },
    {
      key: 'waterFeeNew',
      title: '新建水电费用扣款单',
      hidden: true
    },
    {
      key: 'waterFeeEdit',
      title: '编辑水电费用扣款单',
      hidden: true
    }
  ],
}

// 前端未找到页面路由（固定不用改）
const notFoundRouter = {
  path: '*',
  redirect: '/404',
  hidden: true
}

// 自定义icon图标

const icons = {
  'purchase': purchase
}

/**
 * 获取路由菜单信息
 *
 * 1. 调用 getRouterByUser() 访问后端接口获得路由结构数组
 *    @see https://github.com/sendya/ant-design-pro-vue/blob/feature/dynamic-menu/public/dynamic-menu.json
 * 2. 调用
 * @returns {Promise<any>}
 */
export const generatorDynamicRouter = (data) => {
  return new Promise((resolve, reject) => {
    // ajax
    // getRouterByUser({ flag: data.flag, scope_code: data.scope_code })
    //   .then(res => {
    //     console.log(data)
    //     console.log(res)
    //     const result = addCustomRouter(res.responseList)
    //     const routers = generator(result)
    //     routers.push(notFoundRouter)
    //     resolve(routers)
    //   })
    //   .catch(err => {
    //     reject(err)
    //   })
    if (Vue.ls.get(ACCESS_TOKEN)) {
      if (!data.menuTree) {
        getRouterByUser({ flag: data.flag, scope_code: data.scope_code })
          .then(res => {
            const result = addCustomRouter([res.responseObject])
            const routers = generator(result)
            routers.push(notFoundRouter)
            resolve(routers)
          })
          .catch(err => {
            reject(err)
          })
      } else {
        const result = addCustomRouter([data.menuTree])
        const routers = generator(result)
        routers.push(notFoundRouter)
        resolve(routers)
      }
    }
  })
}

/**
 * 格式化 后端 结构信息并递归生成层级路由表
 *
 * @param routerMap
 * @param parent
 * @returns {*}
 */
// export const generator = (routerMap, parent) => {
//   return routerMap.map(item => {
//     const currentRouter = {
//       // 路由地址 动态拼接生成如 /dashboard/workplace
//       path: `${(parent && parent.menuPath) || ''}/${item.routerKey}`,
//       // 路由名称，建议唯一
//       name: item.name || item.routerName || item.routerKey || '',
//       // 该路由对应页面的 组件
//       component: constantRouterComponents[item.component || item.routerKey],
//       // meta: 页面标题, 菜单图标, 页面权限(供指令权限用，可去掉)
//       meta: { title: item.menuName, icon: icons[item.icon] || item.icon || undefined, permission: (item.routerKey && [item.routerKey]) || null },
//       hidden: item.hidden || false
//     }
//     // 为了防止出现后端返回结果不规范，处理有可能出现拼接出两个 反斜杠
//     currentRouter.path = currentRouter.path.replace('//', '/')
//     // 重定向
//     item.menuPath && (currentRouter.menuPath = item.menuPath)
//     // 是否有子菜单，并递归处理
//     if (item.child && item.child.length > 0) {
//       // Recursion
//       currentRouter.children = generator(item.child, currentRouter)
//     }
//     return currentRouter
//   })
// }

// /**
//  * 添加本地自定义路由
//  * @param routerMap
//  * @returns {*}
//  */
// function addCustomRouter (routerMap) {
//   return routerMap.map(item => {
//     if (Object.keys(constantRouters).includes(item.routerKey || item.routerName)) {
//       item.child.push(...constantRouters[item.routerKey || item.routerName])
//     }
//     // 是否有子菜单，并递归处理
//     if (item.child && item.child.length > 0) {
//       item.children = addCustomRouter(item.child)
//     }
//     return item
//   })
// }

export const generator = (routerMap, parent) => {
  return routerMap.map(item => {
    const currentRouter = {
      // 路由地址 动态拼接生成如 /dashboard/workplace
      path: `${(parent && parent.path) || ''}/${item.key}`,
      // 路由名称，建议唯一
      name: item.name || item.key || '',
      // 该路由对应页面的 组件
      component: constantRouterComponents[item.component || item.key],
      // meta: 页面标题, 菜单图标, 页面权限(供指令权限用，可去掉)
      meta: { title: item.title, icon: icons[item.icon] || item.icon || undefined, permission: (item.key && [item.key]) || null, keepAlive: item.keepAlive || false, menuCode: item.menuCode },
      hidden: item.hidden || false
    }
    // 为了防止出现后端返回结果不规范，处理有可能出现拼接出两个 反斜杠
    currentRouter.path = currentRouter.path.replace('//', '/')
    // 重定向
    item.redirect && (currentRouter.redirect = item.redirect)
    // 是否有子菜单，并递归处理
    if (item.children && item.children.length > 0) {
      // Recursion
      currentRouter.children = generator(item.children, currentRouter)
    }
    return currentRouter
  })
}

/**
 * 添加本地自定义路由
 * @param routerMap
 * @returns {*}
 */
function addCustomRouter (routerMap) {
  return routerMap.map(item => {
    if (Object.keys(constantRouters).includes(item.key || item.name)) {
      item.children.push(...constantRouters[item.key || item.name])
    }
    // 是否有子菜单，并递归处理
    if (item.children && item.children.length > 0) {
      item.children = addCustomRouter(item.children)
    }
    return item
  })
}
