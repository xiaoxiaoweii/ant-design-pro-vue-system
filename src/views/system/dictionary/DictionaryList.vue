<template>
  <a-card :bordered="false">
    <a-row :gutter="8">
      <a-col :span="6">
        <s-tree
          :dataSource="dicTree"
          :openKeys.sync="openKeys"
          :defaultSelectedKeys="['key-01']"
          :search="true"
          @click="handleClick"
          @add="handleAdd"
          @titleClick="handleTitleClick"></s-tree>
      </a-col>
      <a-col :span="18">
        <s-table
          ref="table"
          size="default"
          rowKey="dic_enum_id"
          bordered
          :columns="columns"
          :data="loadData"
          :alert="false"
          :pagination="{showSizeChanger: true, pageSizeOptions: ['13', '26', '39'], showQuickJumper: true, showTotal: total => `共 ${total} 条`}"
        >
          <span
            slot="serial"
            slot-scope="text, record, index"
          >{{ index + 1 }}</span>
          <span
            slot="is_valid"
            slot-scope="text"
          >{{ text | valid }}</span>
          <span slot="action" slot-scope="text, record">
            <template>
              <a @click="handleEdit(record)">编辑</a>
            </template>
          </span>
        </s-table>
      </a-col>
    </a-row>

    <enum-modal ref="modal" @ok="handleSaveOk" @close="handleSaveClose" />
  </a-card>
</template>

<script>
import STree from '@/components/Tree/Tree'
import { STable } from '@/components'
import EnumModal from './modules/EnumModal'
import { getDictionaryTree, getDictionaryEnum, queryDictionaries } from '@/api/dictionary'

export default {
  name: 'TreeList',
  components: {
    STable,
    STree,
    EnumModal
  },
  data () {
    return {
      openKeys: ['key-01'],

      // 查询参数
      queryParam: {},
      columns: [
        {
          title: '序号',
          width: '70px',
          align: 'center',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: '字典编码',
          dataIndex: 'dic_enum_id'
        },
        {
          title: '字典枚举值',
          dataIndex: 'dic_enum_name'
        },
        {
          title: '是否启用',
          dataIndex: 'is_valid',
          scopedSlots: { customRender: 'is_valid' }
        },
        {
          title: '备注',
          dataIndex: 'remark'
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '150px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        if (!this.queryParam.dic_type_id) {
          this.queryParam = {
            dic_type_id: '0'
          }
        }
        return queryDictionaries(Object.assign(parameter, this.queryParam))
          .then(res => {
            // 索引
            // this.current = res.responsePageInfo.pageNum
            // this.currentSize = res.responsePageInfo.pageSize

            return res.result || { pageSize: 1000, pageNo: 1, totalPage: 1, totalCount: res.responseList.length, data: res.responseList }
          })
      },
      // 索引
      // current: Number,
      // currentSize: Number,
      dicTree: [],
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  created () {
    const tree = {
      key: 'key-01',
      title: '字典类型',
      icon: 'folder',
      children: []
    }
    getDictionaryTree().then(res => {
      tree.children = res.responseList.map(d => {
        d.key = d.dic_type_id
        d.title = d.dic_type_name
        d.icon = null
        return d
      })
      this.openKeys = [tree.children[0].key]
      this.queryParam = {
        dic_type_id: tree.children[0].key
      }
      this.dicTree = [tree]
    })
  },
  filters: {
    valid (value) {
      return value === 0 ? '否' : '是'
    }
  },
  methods: {
    handleClick (e) {
      console.log('handleClick', e)
      this.queryParam = {
        dic_type_id: e.key
      }
      this.$refs.table.refresh(true)
    },
    handleAdd (item) {
      // console.log('add button, item', item)
      // this.$message.info(`提示：你点了 ${item.key} - ${item.title} `)
      this.$refs.modal.add(item)
    },
    handleTitleClick (item) {
      console.log('handleTitleClick', item)
    },
    titleClick (e) {
      console.log('titleClick', e)
    },
    handleSaveOk () {
      this.$refs.table.refresh(true)
    },
    handleSaveClose () {

    },
    handleEdit (record) {
      this.$refs.modal.add(record)
    }
  }
}
</script>

<style lang="less">
  .custom-tree {

    /deep/ .ant-menu-item-group-title {
      position: relative;
      &:hover {
        .btn {
          display: block;
        }
      }
    }

    /deep/ .ant-menu-item {
      &:hover {
        .btn {
          display: block;
        }
      }
    }

    /deep/ .btn {
      display: none;
      position: absolute;
      top: 0;
      right: 10px;
      width: 20px;
      height: 40px;
      line-height: 40px;
      z-index: 1050;

      &:hover {
        transform: scale(1.2);
        transition: 0.5s all;
      }
    }
  }
</style>
