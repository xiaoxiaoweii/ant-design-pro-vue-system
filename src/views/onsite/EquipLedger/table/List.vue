<template>
  <div>
    <div
      class="table-operator"
      :style="{ 'margin-bottom': advanced ? '24px' : 0 }"
    >
      <!-- 设备现场台账 -->
      <!-- 菜单按钮列表 -->
      <span
        v-for="item in menuBtns"
        :key="item.key"
      >
        <a-dropdown v-if="item.title === '导出' && item.id">
          <a-menu slot="overlay">
            <a-sub-menu title="PDF">
              <a-menu-item key="export-pdf" @click="exportTable">导出已选(详情)</a-menu-item>
              <a-menu-item key="export-pdflist" @click="exportTable1">导出列表</a-menu-item>
              <a-menu-item key="export-pdfall" @click="exportTable">导出全部(详情)</a-menu-item>
            </a-sub-menu>
            <a-sub-menu title="EXCEL">
              <a-menu-item key="export-excel" @click="exportTable">导出已选(详情)</a-menu-item>
              <a-menu-item key="export-excellist" @click="exportTable1">导出列表</a-menu-item>
              <a-menu-item key="export-excelall" @click="exportTable">导出全部(详情)</a-menu-item>
            </a-sub-menu>
          </a-menu>
          <a-button class="menu-button" :type="item.type" :icon="item.icon">
            {{ item.title }}
            <a-icon type="down" />
          </a-button>
        </a-dropdown>
        <a-button
          v-else-if="item.id"
          class="menu-button"
          :type="item.type"
          :icon="item.icon"
          @click="item.func"
        >
          {{ item.title }}
        </a-button>
      </span>
    </div>
    <br />

    <!-- 现场设备台账数据列表 -->
    <s-table
      ref="table"
      size="small"
      rowKey="id"
      bordered
      :alert="options.alert"
      :rowSelection="options.rowSelection"
      :columns="columns"
      :data="loadData"
      :pagination="{showSizeChanger: true, pageSizeOptions: ['13', '26', '39'], showQuickJumper: true, showTotal: total => `共 ${ total } 条`}"
    >
      <template slot="serial_number" slot-scope="text, record, index">
        <a :class="classChange[index]" href="javascript:;">{{ text }}</a>
      </template>
      <div slot="filterDropdown" slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }" class="custom-filter-dropdown">
        <!-- 获取自定义栏位相关作用域属性 -->
        {{ setFilterColumnScope({ setSelectedKeys, selectedKeys, confirm, clearFilters, column }) }}
        <a-range-picker 
            v-if="column.dataIndex === 'production_time'" 
            v-model="productionrange" 
            @change="onChangeProductionDate" 
            style="width: 218px; margin-bottom: 8px; display: block;"
          />
        <a-range-picker 
            v-else-if="column.dataIndex === 'in_date'" 
            v-model="inrange" 
            @change="onChangeInDate" 
            style="width: 218px; margin-bottom: 8px; display: block;"
          />
        <a-range-picker 
            v-else-if="column.dataIndex === 'out_date'" 
            v-model="outrange" 
            @change="onChangeOutDate" 
            style="width: 218px; margin-bottom: 8px; display: block;"
          />
        <a-range-picker v-else-if="column.dataIndex === 'check_at'" v-model="startRange" @change="onChangeStartDate" style="width: 218px; margin-bottom: 8px; display: block;"/>

        <a-input
          v-else
          ref="input"
          v-ant-ref="c => searchInput = c"
          :placeholder="`${column.title}`"
          :value="selectedKeys[0]"
          @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
          @pressEnter="() => handleSearch(selectedKeys, confirm)"
          style="width: 188px; margin-bottom: 8px; display: block;"
        />
        <a-button
          type="primary"
          @click="() => handleSearch(selectedKeys, confirm, column.dataIndex)"
          icon="search"
          size="small"
          :style="`width: 90px; margin-right: 8px; margin-left: ${column.dataIndex === 'accept_date' ? 15 : 0}px`"
        >查询</a-button>
        <a-button
          @click="() => handleReset(clearFilters, column.dataIndex)"
          size="small"
          style="width: 90px"
        >重置</a-button>
      </div>
      <a-icon slot="filterIcon" slot-scope="filtered" type="search" :style="{ color: filtered ? '#108ee9' : undefined }" />
      <span
        slot="serial"
        slot-scope="text, record, index"
      >{{ index + 1 + (current - 1) * currentSize }}</span>
      <ellipsis slot="reason" slot-scope="text" :length="20" tooltip>
        {{ text }}
      </ellipsis>
      <span slot="usage_state" slot-scope="text">
        {{ text | statusFilter }}
      </span>
      <span slot="equip_source" slot-scope="text">
        {{ text}}
      </span>
    </s-table>
  </div>
</template>

<script>
import moment from 'moment'
import print from 'print-js'
import { STable } from '@/components'
import Ellipsis from '@/components/Ellipsis'
import { exportPDF, exportPDFList, exportExcel, exportExcelList,querySingle } from '@/api/onsite/upload'
import { handleQueryButton } from '@/api/userMenu'
import { queryEquip,equipStatusArray,equipStatusLabel } from '@/api/onsite/equipLedger'
import { mapGetters } from 'vuex'
const FileSaver = require('file-saver')

export default {
  name: 'TableList',
  components: {
    STable,
    Ellipsis
  },
  computed: {
    columns () {
      let { filteredInfo } = this
      filteredInfo = filteredInfo || {}

      return [
        {
          title: '序号',
          width: '70px',
          align: 'center',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: '管理号码',
          dataIndex: 'manage_code',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'manage_code'
          },
          onFilter: (value, record) => record.manage_code.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                // this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: '设备名称',
          dataIndex: 'equip_name',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'equip_name'
          },
          onFilter: (value, record) => record.equip_name.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                // this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: '规格型号',
          dataIndex: 'specification',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'specification'
          },
          onFilter: (value, record) => record.specification.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                // this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: '功率',
          dataIndex: 'power',
          width: '220px',
          align: 'right',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'power'
          },
          //onFilter: (value, record) => record.power.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                // this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: '生产厂家',
          dataIndex: 'manufacturer',
          width: '220px',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'manufacturer'
          },
          onFilter: (value, record) => record.manufacturer.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                // this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: '出厂日期',
          dataIndex: 'production_time',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'production_time',
          },
          onFilter: (value, record) => record.production_time.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                // this.searchData.focus()
              }, 0)
            }
          },
          sorter: (a, b) => a.production_time.split('-').join('') - b.production_time.split('-').join('')
        },
        {
          title: '进场日期',
          dataIndex: 'in_date',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'in_date',
          },
          onFilter: (value, record) => record.in_date.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                // this.searchData.focus()
              }, 0)
            }
          },
          sorter: (a, b) => a.in_date.split('-').join('') - b.in_date.split('-').join('')
        },
        {
          title: '退场日期',
          dataIndex: 'out_date',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'out_date',
          },
          onFilter: (value, record) => record.out_date.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                // this.searchData.focus()
              }, 0)
            }
          },
          sorter: (a, b) => a.out_date.split('-').join('') - b.out_date.split('-').join('')
        },
        {
          title: '使用部位',
          dataIndex: 'use_site',
          width: '220px',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'use_site'
          },
          onFilter: (value, record) => record.use_site.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                // this.searchInput.focus()
              }, 0)
            }
          }
        },
        // {
        //   title: '技术状况',
        //   dataIndex: 'technical_condition',
        //   width: '220px',
        //   scopedSlots: {
        //     filterDropdown: 'filterDropdown',
        //     filterIcon: 'filterIcon',
        //     customRender: 'technical_condition'
        //   },
        //   onFilter: (value, record) => record.technical_condition.toLowerCase().includes(value.toLowerCase()),
        //   onFilterDropdownVisibleChange: (visible) => {
        //     if (visible) {
        //       setTimeout(() => {
        //         // this.searchInput.focus()
        //       }, 0)
        //     }
        //   }
        // },
        // {
        //   title: '证件编码',
        //   dataIndex: 'technical_condition',
        //   width: '220px',
        //   scopedSlots: {
        //     filterDropdown: 'filterDropdown',
        //     filterIcon: 'filterIcon',
        //     customRender: 'technical_condition'
        //   },
        //   onFilter: (value, record) => record.technical_condition.toLowerCase().includes(value.toLowerCase()),
        //   onFilterDropdownVisibleChange: (visible) => {
        //     if (visible) {
        //       setTimeout(() => {
        //         // this.searchInput.focus()
        //       }, 0)
        //     }
        //   }
        // },
        // {
        //   title: '证件名称',
        //   dataIndex: 'technical_condition',
        //   width: '220px',
        //   scopedSlots: {
        //     filterDropdown: 'filterDropdown',
        //     filterIcon: 'filterIcon',
        //     customRender: 'technical_condition'
        //   },
        //   onFilter: (value, record) => record.technical_condition.toLowerCase().includes(value.toLowerCase()),
        //   onFilterDropdownVisibleChange: (visible) => {
        //     if (visible) {
        //       setTimeout(() => {
        //         // this.searchInput.focus()
        //       }, 0)
        //     }
        //   }
        // },
        {
          title: '车牌号',
          dataIndex: 'car_num',
          width: '220px',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'car_num'
          },
          onFilter: (value, record) => record.car_num.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                // this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: '设备来源',
          dataIndex: 'equip_source',
          width: '220px',
          key: 'equip_source',
          scopedSlots: {
            customRender: 'equip_source'
          },
          filterMultiple: false,
          filters: this.selectData['equip_source'],
          onFilter: (value, record) => record.equip_source === value        
        },
        // {
        //   title: '操作手姓名',
        //   dataIndex: 'equip_source',
        //   width: '220px',
        //   scopedSlots: {
        //     filterDropdown: 'filterDropdown',
        //     filterIcon: 'filterIcon',
        //     customRender: 'equip_source'
        //   },
        //   onFilter: (value, record) => record.equip_source.toLowerCase().includes(value.toLowerCase()),
        //   onFilterDropdownVisibleChange: (visible) => {
        //     if (visible) {
        //       setTimeout(() => {
        //         // this.searchInput.focus()
        //       }, 0)
        //     }
        //   }
        // },
        // {
        //   title: '身份证号',
        //   dataIndex: 'equip_source',
        //   width: '220px',
        //   scopedSlots: {
        //     filterDropdown: 'filterDropdown',
        //     filterIcon: 'filterIcon',
        //     customRender: 'equip_source'
        //   },
        //   onFilter: (value, record) => record.equip_source.toLowerCase().includes(value.toLowerCase()),
        //   onFilterDropdownVisibleChange: (visible) => {
        //     if (visible) {
        //       setTimeout(() => {
        //         // this.searchInput.focus()
        //       }, 0)
        //     }
        //   }
        // },
        // {
        //   title: '操作证名称',
        //   dataIndex: 'equip_source',
        //   width: '220px',
        //   scopedSlots: {
        //     filterDropdown: 'filterDropdown',
        //     filterIcon: 'filterIcon',
        //     customRender: 'equip_source'
        //   },
        //   onFilter: (value, record) => record.equip_source.toLowerCase().includes(value.toLowerCase()),
        //   onFilterDropdownVisibleChange: (visible) => {
        //     if (visible) {
        //       setTimeout(() => {
        //         // this.searchInput.focus()
        //       }, 0)
        //     }
        //   }
        // },
        // {
        //   title: '操作证编码',
        //   dataIndex: 'equip_source',
        //   width: '220px',
        //   scopedSlots: {
        //     filterDropdown: 'filterDropdown',
        //     filterIcon: 'filterIcon',
        //     customRender: 'equip_source'
        //   },
        //   onFilter: (value, record) => record.equip_source.toLowerCase().includes(value.toLowerCase()),
        //   onFilterDropdownVisibleChange: (visible) => {
        //     if (visible) {
        //       setTimeout(() => {
        //         // this.searchInput.focus()
        //       }, 0)
        //     }
        //   }
        // },
        // {
        //   title: '检验到期日期',
        //   dataIndex: 'out_date',
        //   scopedSlots: {
        //     filterDropdown: 'filterDropdown',
        //     filterIcon: 'filterIcon',
        //     customRender: 'out_date',
        //   },
        //   onFilter: (value, record) => record.out_date.toLowerCase().includes(value.toLowerCase()),
        //   onFilterDropdownVisibleChange: (visible) => {
        //     if (visible) {
        //       setTimeout(() => {
        //         // this.searchData.focus()
        //       }, 0)
        //     }
        //   },
        //   sorter: (a, b) => a.use_date.split('-').join('') - b.check_at.split('-').join('')
        // },
        // {
        //   title: '检验周期',
        //   dataIndex: 'equip_source',
        //   width: '220px',
        //   scopedSlots: {
        //     filterDropdown: 'filterDropdown',
        //     filterIcon: 'filterIcon',
        //     customRender: 'equip_source'
        //   },
        //   onFilter: (value, record) => record.equip_source.toLowerCase().includes(value.toLowerCase()),
        //   onFilterDropdownVisibleChange: (visible) => {
        //     if (visible) {
        //       setTimeout(() => {
        //         // this.searchInput.focus()
        //       }, 0)
        //     }
        //   }
        // },
        // {
        //   title: '保险到期日期',
        //   dataIndex: 'out_date',
        //   scopedSlots: {
        //     filterDropdown: 'filterDropdown',
        //     filterIcon: 'filterIcon',
        //     customRender: 'out_date',
        //   },
        //   onFilter: (value, record) => record.out_date.toLowerCase().includes(value.toLowerCase()),
        //   onFilterDropdownVisibleChange: (visible) => {
        //     if (visible) {
        //       setTimeout(() => {
        //         // this.searchData.focus()
        //       }, 0)
        //     }
        //   },
        //   sorter: (a, b) => a.use_date.split('-').join('') - b.check_at.split('-').join('')
        // },
        {
          title: '原值(元)',
          dataIndex: 'original_value',
          width: '220px',
          align: 'right',
          // scopedSlots: {
          //   filterDropdown: 'filterDropdown',
          //   filterIcon: 'filterIcon',
          //   customRender: 'original_value'
          // },
          //onFilter: (value, record) => record.original_value.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                // this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: '净值(元)',
          dataIndex: 'net_value',
          width: '220px',
          align: 'right',
          // scopedSlots: {
          //   filterDropdown: 'filterDropdown',
          //   filterIcon: 'filterIcon',
          //   customRender: 'net_value'
          // },
          //onFilter: (value, record) => record.net_value.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                // this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: '租赁单价(元/月)',
          dataIndex: 'lease_price',
          align: 'right',
          width: '220px',
          // scopedSlots: {
          //   filterDropdown: 'filterDropdown',
          //   filterIcon: 'filterIcon',
          //   customRender: 'lease_price'
          // },
          //onFilter: (value, record) => record.lease_price.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                // this.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: '状态',
          dataIndex: 'usage_state',
          width: '120px',
          key: 'usage_state',
          scopedSlots: {
            customRender: 'usage_state'
          },
          filterMultiple: false,
          filters: equipStatusArray,
          filteredValue: filteredInfo.usage_state || null,
          onFilter: (value, record) => record.usage_state === value
        },
        // {
        //   title: '验收人员',
        //   dataIndex: 'accept_to_person',
        //   width: '220px',
        //   scopedSlots: {
        //     filterDropdown: 'filterDropdown',
        //     filterIcon: 'filterIcon',
        //     customRender: 'accept_to_person'
        //   },
        //   onFilter: (value, record) => record.accept_to_person.toLowerCase().includes(value.toLowerCase()),
        //   onFilterDropdownVisibleChange: (visible) => {
        //     if (visible) {
        //       setTimeout(() => {
        //         // this.searchInput.focus()
        //       }, 0)
        //     }
        //   }
        // },
        // {
        //   title: '被验收单位负责人',
        //   dataIndex: 'acceptance_from_person',
        //   width: '220px',
        //   scopedSlots: {
        //     filterDropdown: 'filterDropdown',
        //     filterIcon: 'filterIcon',
        //     customRender: 'acceptance_from_person'
        //   },
        //   onFilter: (value, record) => record.acceptance_from_person.toLowerCase().includes(value.toLowerCase()),
        //   onFilterDropdownVisibleChange: (visible) => {
        //     if (visible) {
        //       setTimeout(() => {
        //         // this.searchInput.focus()
        //       }, 0)
        //     }
        //   }
        // },
        // {
        //   title: '使用状态',
        //   dataIndex: 'acceptance_from_person',
        //   width: '220px',
        //   scopedSlots: {
        //     filterDropdown: 'filterDropdown',
        //     filterIcon: 'filterIcon',
        //     customRender: 'acceptance_from_person'
        //   },
        //   onFilter: (value, record) => record.acceptance_from_person.toLowerCase().includes(value.toLowerCase()),
        //   onFilterDropdownVisibleChange: (visible) => {
        //     if (visible) {
        //       setTimeout(() => {
        //         // this.searchInput.focus()
        //       }, 0)
        //     }
        //   }
        // },
        {
          title: '备注',
          dataIndex: 'remark',
          width: '220px',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'remark'
          },
          onFilter: (value, record) => record.remark.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                // this.searchInput.focus()
              }, 0)
            }
          }
        },
      ]
    }
  },
  data () {
    return {
      classChange:[],
      filteredInfo: null,
      customFilterColumn: {},
      inrange: [],
      outrange: [],
      productionrange: [],
      equipStatusArray: equipStatusArray,
      selectData: {
        'equip_source':[
          {'text':'自有设备','value':'自有设备'},
          {'text':'租赁设备','value':'租赁设备'},
          {'text':'分包商设备','value':'分包商设备'},
        ]
      },
      title: '盘点单',
      mdl: {},
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      dataSource: [],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        for (const key in parameter) {
          if (parameter.hasOwnProperty(key)) {
            if (parameter[key] instanceof Array) {
              parameter[key] = parameter[key][0]
            }
            !parameter[key] && Reflect.deleteProperty(parameter, key)
          }
        }
        // 查询所有状态的购置单
        if ([0, '0'].includes(parameter.status)) Reflect.deleteProperty(parameter, 'status')
        if ([0, '0'].includes(this.queryParam.status)) Reflect.deleteProperty(this.queryParam, 'status')


        // parameter
        return queryEquip(Object.assign(parameter, this.queryParam,
                  {scope_code:this.$store.state.menu_key||0})).then(res => {
          res.responsePageInfo.list = res.responsePageInfo.list.map((x, index)=> {
            x.total_amount && (x.total_amount = x.total_amount.toFixed(2))
            for (let key in x) {
              const isTrue = x[key] === '' || x[key] === undefined || x[key] === null
              if (isTrue) {
                x[key] = '--'
              }
            }
            if (x.is_approve === 1) {
              if (x.status == 10040003 || x.status == 10040002) {
                x.status = 10040006
              }
            }
            if (x.flag == 0&&x.creator_user_name!=this.nickname()) {
              this.classChange[index] = 'read-after'
            } else {
              this.classChange[index] = ''
            }
            return x
          })
          this.dataSource = res.result ? res.result.data : res.responsePageInfo.list
          this.current = res.responsePageInfo.pageNum
          this.currentSize = res.responsePageInfo.pageSize
          return res.result || { pageSize: res.responsePageInfo.pageSize, pageNo: res.responsePageInfo.pageNum, totalPage: res.responsePageInfo.pages, totalCount: res.responsePageInfo.total, data: res.responsePageInfo.list }
        },(err)=>{
          console.log(err)
        })
      },
      current: Number,
      currentSize: Number,
      selectedRowKeys: [],
      selectedRows: [],
      orgparam: {
        menu_id: 39,
        creator_org_id: this.$store.state.menu_key || 0
      },
      options:{
        alert:{
          show:false,
          clear: () => {
            this.selectedRowKeys = []
          }
        },
        rowSelection: {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange
        }
      },
      menuBtns: [
        {
          key: 'm20006',
          icon: 'export',
          title: '导出',
          type: 'primary',
          func: () => this.exportTable()
        },
        {
          key: 'm20007',
          icon: 'printer',
          title: '打印',
          type: 'primary',
          func: () => this.printTable()
        },
        {
          key: 'm20008',
          icon: 'sync',
          title: '刷新',
          type: 'primary',
          func: () => { this.queryParam = {}; this.range = []; this.startRange = []; this.refresh(true) }
        }
      ],
      loadChange (pagination, filters, sorter) {
        this.filteredInfo = filters
      }
    }
  },
  watch: {
    $route(to, from) {
      if (from.path !== this.$route.fullPath) {
        this.queryDictionary()
        this.refresh(true)
      }
    }
  },
  created () {
    setTimeout(() => {
      this.orgparam = {
        menu_id: 39,
        creator_org_id: this.$store.state.menu_key
      }
      handleQueryButton({
        scope_code: this.$store.state.menu_key,
        menu_code: '39'
      }).then(res => {
        this.menuBtns = this.menuBtns.map(x => {
          const arr = res.responseList.filter(y => y.menu_button_code === x.key)
          arr[0] && (x.id = arr[0].id)
          return x
        })
        this.$refs.table.refresh(true)
      },(err)=>{
        console.log(err)
      })
      this.queryDictionary()
    }, 0)
  },
  filters: {
    statusFilter (type) {
      return equipStatusLabel[type]
    }
  },
  methods: {
    ...mapGetters(['nickname']),
    queryDictionary(){
      let that=this
      let dicObj={
            'equip_source':1010, //设备来源
          }
      Object.getOwnPropertyNames(dicObj).forEach(key=>{
        querySingle({dic_type_id:dicObj[key]}).then(res=>{
          that.selectData[key]=res.responseList.map(item=>{
            item['text']=item['dic_enum_name']
            item['value']=item['dic_enum_name']
            return item
          })
        })
      })
    },
    setFilterColumnScope (data) {
      const { column } = data
      this.customFilterColumn[column.dataIndex] = data
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },

    onChangeInDate (date, inrange) {
      this.queryParam.begin_in_date = inrange[0]
      this.queryParam.end_in_date = inrange[1]
    },
    onChangeOutDate (date, outrange) {
      this.queryParam.begin_out_date = outrange[0]
      this.queryParam.end_out_date = outrange[1]
    },
    onChangeProductionDate (date, productionrange) {
      this.queryParam.begin_production_time = productionrange[0]
      this.queryParam.end_production_time = productionrange[1]
    },
    printTable (e) {
      const key = e.key
      const properties = this.columns.filter(col => col.title !== '序号').map(col => {
        return {
          field: col.dataIndex || '',
          displayName: col.title
        }
      })

      print({
        printable: key === 'print-all' ? this.dataSource : this.selectedRows,
        properties: properties,
        type: 'json',
        header: `<h3 class="custom-h3">${this.title || 'data'}</h3>`,
        documentTitle: '资产管理系统'
      })
    },
    exportTable1 (e) {
      if (e.key === 'export-pdflist') {
        exportPDFList({
          menu_id: 39
        }).then(res => {
            FileSaver.saveAs(new Blob([res], { type: res.type }), `${this.title || 'data'}列表.pdf`)
        })
      } else if (e.key === 'export-excellist') {
        exportExcelList({
          menu_id: 39
        }).then(res => {
          FileSaver.saveAs(new Blob([res], { type: res.type }), `${this.title || 'data'}列表.xls`)
        })
      }
    },

    exportTable (e) {
      
      if (e.key === 'export-pdf') {
        if (this.selectedRows.length === 0) return this.noSelect()
        exportPDF({
          details: this.selectedRowKeys,
          flag:0,
          menu_id: 39
        }).then(res => {
          if (this.selectedRowKeys.length === 1) {
            FileSaver.saveAs(new Blob([res], { type: res.type }), `${this.title || 'data'}列表.pdf`)
          } else if (this.selectedRowKeys.length > 1) {
            FileSaver.saveAs(new Blob([res], { type: res.type }), `${this.title || 'data'}列表.zip`)
          }
        })
      } else if (e.key === 'export-excel') {
        if (this.selectedRows.length === 0) return this.noSelect()
        exportExcel({
          details: this.selectedRowKeys,
          flag:0,
          menu_id: 39
        }).then(res => {
          FileSaver.saveAs(new Blob([res], { type: res.type }), `${this.title || 'data'}列表.xls`)
        })
      }  else if (e.key === 'export-excelall') {
         exportExcel({
          flag:1,
          menu_id: 39
        }).then(res => {
          FileSaver.saveAs(new Blob([res], { type: res.type }), `${this.title || 'data'}列表.xls`)
        }) 
      } else if (e.key === 'export-pdfall') {
        exportPDF({
          flag:1,
          menu_id: 39
        }).then(res => {
            FileSaver.saveAs(new Blob([res], { type: res.type }), `${this.title || 'data'}列表.zip`)
        })
      }
    },
    refresh (bool) {
      this.$refs.table.clearSelected()
      this.$refs.table.refresh(bool)
      this.selectedRowKeys = []
      this.selectedRows = []

      for (const key in this.customFilterColumn) {
        if (this.customFilterColumn.hasOwnProperty(key)) {
          this.customFilterColumn[key].clearFilters()
        }
      }

      // 清空了过滤内容
      this.filteredInfo = null
    },

    // 提示框
    noSelect (title) {
      const secondsToGo = 2 // 两秒后自动关闭
      const modal = this.$info({
        title: '提示',
        content: title || '请选择至少一条记录'
      })

      setTimeout(() => {
        modal.destroy()
      }, secondsToGo * 1000)
    },

    // 表格内过滤函数
    handleSearch (selectedKeys, confirm, col) {
      if (col === 'production_time' || col === 'in_date'|| col === 'out_date') {
        this.refresh(true)
      } else {
        confirm()
      }
    },

    handleReset (clearFilters, col) {
      clearFilters()
      this.range = []
      this.startRange = []
      this.queryParam = {}
      this.refresh(true)
    }
  }
}
</script>

<style lang="less" scoped>
.table-operator {
  .menu-button {
    margin-right: 5px;
  }

  .search {
    float: right;
  }
}
/deep/ td{
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
/deep/ th{
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
