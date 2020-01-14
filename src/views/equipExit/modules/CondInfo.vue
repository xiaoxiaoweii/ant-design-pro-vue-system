<template>
  <a-modal
    title="请选择分包商"
    v-model="visible"
    :width="1300"
    @ok="handleSubmit(selectedRowKeys)"
    @cancel="handleCancel"
  >
    <s-table
      size="small"
      ref="table"
      rowKey="socialId"
      bordered
      :columns="column"
      :data="loadData"
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
  </a-modal>
</template>

<script>
import { STable } from '@/components'
import { getCondInfo } from '@/api/common'

export default {
  components: {
    STable
  },
  data () {
    return {
      visible: false,
      searchText: '',
      queryParam:{},
      column: [
        {
          title: '序号',
          width: 70,
          align: 'center',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: '统一社会信用代码',
          dataIndex: 'socialId',
          width: '120px',
          scopedSlots: {
            customRender: 'socialId'
          }
        },
        {
          title: '分包商名称',
          dataIndex: 'supName',
          width: '150px',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'supName'
          }
        },
        {
          title: '分包商状态',
          dataIndex: 'state',
          width: '100px',
          scopedSlots: {
            customRender: 'state'
          }
        },
        {
          title: '法人姓名',
          dataIndex: 'legalPersonName',
          width: '100px',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'legalPersonName'
          }
        },
        {
          title: '法人身份证号',
          dataIndex: 'legalPersonCode',
          width: '100px',
          scopedSlots: {
            customRender: 'legalPersonCode'
          }
        }
      ],
      loadData: parameter => {

        this.queryParam = {            
            condition:{
                  legalPersonName:"", 
                  supName:"",  
                  organCode:"0000100002"  
              }
        }
        parameter.current=parameter.pageNum
        parameter.size=parameter.pageSize

        if (parameter.supName !== undefined) {
          this.queryParam.condition.supName = parameter.supName[0]
        }

        if (parameter.legalPersonName !== undefined) {
          this.queryParam.condition.legalPersonName = parameter.legalPersonName[0]
        }

        // TODO: 机构编码固定值？
        return getCondInfo(Object.assign(parameter, this.queryParam)).then(res => {
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
      this.$nextTick(() => {
        this.$refs.table.refresh(true)
      })
    },
    handleSearch (selectedKeys, confirm) {
      confirm();
      this.searchText = selectedKeys[0];
    },
    handleReset (clearFilters) {
      clearFilters();
      this.searchText = '';
    },
    handleSubmit () {
      this.$emit('ok', this.selectedRows[0] || null)
      this.$refs.table.clearSelected()
      this.selectedRowKeys = []
      this.selectedRows = []
      this.visible = false
    },
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
