<template>
  <!-- 设备字典弹框 -->
  <a-modal
    title="请选择设备"
    v-model="visible"
    width="100%"
    @ok="handleSubmit(selectedRowKeys)"
    @cancel="handleCancel"
  >
    <a-row :gutter="8">
      <a-col :span="6">
        <a-input-search v-model="searchVal" placeholder="请输入要查询的名称" @search="valueChange" />
        <ZTree
          ref="ztree"
          class="z-tree"
          :setting="setting"
          :nodes="dicTree"
          @onClick="onClick"
          @onCheck="onCheck"
          @onCreated="handleCreated"
        />
      </a-col>
      <a-col :span="18">
        <s-table
          size="small"
          ref="table"
          rowKey="socialId"
          bordered
          :columns="column"
          :data="loadData"
          :customRow="dbClick"
          :alert="false"
          :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onChange, type: 'radio' }"
          :pagination="{showSizeChanger: true, pageSizeOptions: ['13', '26', '39'], showQuickJumper: true, showTotal: total => `共 ${total} 条`}"
        >
          <div
            slot="filterDropdown"
            slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
            class="custom-filter-dropdown"
          >
            <a-input
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
              @click="() => handleSearch(selectedKeys, confirm)"
              icon="search"
              size="small"
              :style="`width: 90px; margin-right: 8px; margin-left: ${column.dataIndex === 'contract_sign_date'  ? 15 : 0}px`"
            >查询</a-button>
            <a-button @click="() => handleReset(clearFilters)" size="small" style="width: 90px">重置</a-button>
          </div>
          <a-icon
            slot="filterIcon"
            slot-scope="filtered"
            type="search"
            :style="{ color: filtered ? '#108ee9' : undefined }"
          />
          <span slot="serial" slot-scope="text, record, index">{{ index + 1 }}</span>
        </s-table>
      </a-col>
    </a-row>
  </a-modal>
</template>

<script>
import { STable, ZTree } from '@/components'
import { queryEquipInfo, queryEquipType } from '@/api/common'

export default {
  components: {
    STable,
    ZTree
  },
  data () {
    return {
      searchVal: '',
      dicTree: [],
      dicTree2: [],
      setting: {
        check: {
          enable: false
        },
        data: {
          key: {
            name: 'categoryName'
          },
          simpleData: {
            enable: true,
            pIdKey: 'parentCode',
            idKey: 'categoryCode'
          }
        }
      },
      visible: false,
      searchText: '',
      queryParam: {
        condition: {
          organCode: '0000100002',
          equipmentCategoryCode: '660001',
        }
      },
      column: [
        {
          title: '序号',
          width: 70,
          align: 'center',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: '设备类别名称',
          dataIndex: 'equipmentCategoryName',
          width: '120px',
          scopedSlots: {
            customRender: 'equipmentCategoryName'
          }
        },
        {
          title: '设备类别编码',
          dataIndex: 'equipmentCategoryCode',
          width: '150px',
          scopedSlots: {
            customRender: 'equipmentCategoryCode'
          }
        },
        {
          title: '机械设备编码',
          dataIndex: 'equipmentCode',
          width: '100px',
          scopedSlots: {
            customRender: 'equipmentCode'
          }
        },
        {
          title: '机械设备名称',
          dataIndex: 'equipmentName',
          width: '100px',
          scopedSlots: {
            customRender: 'equipmentName'
          }
        },
        {
          title: '计量单位',
          dataIndex: 'calculateUnit',
          width: '100px',
          scopedSlots: {
            customRender: 'calculateUnit'
          }
        },
        {
          title: '规格型号',
          dataIndex: 'specificationModel',
          width: '100px',
          scopedSlots: {
            customRender: 'specificationModel'
          }
        },
        {
          title: '机构编码',
          dataIndex: 'organCode',
          width: '100px',
          scopedSlots: {
            customRender: 'organCode'
          }
        }
      ],
      loadData: parameter => {
        parameter.current = parameter.pageNum
        parameter.size = parameter.pageSize
        delete parameter.pageNum
        delete parameter.pageSize

        if (parameter.supName !== undefined) {
          this.queryParam.condition.supName = parameter.supName[0]
        }

        if (parameter.legalPersonName !== undefined) {
          this.queryParam.condition.legalPersonName = parameter.legalPersonName[0]
        }

        // TODO: 机构编码固定值？
        return queryEquipInfo(Object.assign(parameter, this.queryParam)).then(res => {
          return {
            pageSize: res.responseObject.data.size,
            pageNo: res.responseObject.data.current,
            totalPage: res.responseObject.data.pages,
            totalCount: res.responseObject.data.total,
            data: res.responseObject.data.records
          }
        })
      },
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  methods: {
    add () {
      this.visible = true
      this.searchVal = ''
      this.getEquipType()
      this.$nextTick(() => {
        this.queryParam = {
          condition: {
            organCode: '0000100002',
            equipmentCategoryCode: '660001',
          }
        }
        this.$refs.table.refresh(true)
      })
    },
    // 获取类型
    getEquipType () {
      queryEquipType({
        "condition": {
          "organCode": "0000100002"
        }
      }).then(res => {
        this.dicTree = res.responseObject.data
        this.dicTree2 = this.dicTree
      })
    },
    // 搜索
    valueChange (value) {
      this.dicTree = this.dicTree2
      this.searchVal = value
      if (this.searchVal == '') this.dicTree = this.dicTree2
      let arr = []
      for (let i = 0; i < this.dicTree.length; i++) {
        if (this.dicTree[i].categoryName.indexOf(this.searchVal) != -1) {
          arr.push(this.dicTree[i])
        }
      }
      this.dicTree = arr
    },

    // 双击确定
    dbClick (record) {
      return {
        on: {
          dblclick: (e) => {
            this.selectedRows[0] = record
            this.handleSubmit()
          }
        }
      }
    },
    onCheck: function (evt, treeId, treeNode) {
      // 选中事件
    },
    handleCreated: function (ztreeObj) {
      // onCreated 中操作ztreeObj对象展开第一个节点
      ztreeObj.expandNode(ztreeObj.getNodes()[0], true)
    },
    onClick: function (evt, treeId, treeNode) {
      // 点击事件获取表格数据
      this.queryParam['condition']['equipmentCategoryCode'] = treeNode.categoryCode
      this.$refs.table.refresh(true)
    },
    handleSearch (selectedKeys, confirm) {
      confirm();
      this.searchText = selectedKeys[0];
    },
    handleReset (clearFilters) {
      clearFilters();
      this.searchText = '';
    },
    // 确定
    handleSubmit () {
      this.$emit('ok', this.selectedRows[0] || null)
      this.$refs.table.clearSelected()
      this.selectedRowKeys = []
      this.selectedRows = []
      this.visible = false
    },
    // 取消
    handleCancel () {
      this.visible = false
    },
    onChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    }
  }
}
</script>

<style>
</style>
