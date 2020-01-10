<template>
  <div>
    <!-- 菜单按钮 -->
    <div class="table-operator" :style="{ 'margin-bottom': '24px'}">
      <span v-for="item in menuBtns" :key="item.key">
        <a-button
          class="menu-button"
          :type="item.type"
          :icon="item.icon"
          @click="handleEdit()"
        >{{ item.title }}</a-button>
      </span>
    </div>
    <!-- 基本购置单信息 -->
    <a-card class="card" title="需求计划单" :bordered="false">list</a-card>
    <!-- 设备明细 -->
    <a-card class="card" title="设备明细" :bordered="false">设备明细</a-card>
    <!-- fixed footer toolbar -->
    <footer-tool-bar>
      <a-button type="primary">提交</a-button>
    </footer-tool-bar>
  </div>
</template>

<script>
import FooterToolBar from '@/components/FooterToolbar'
export default {
  components: {
    FooterToolBar
  },
  data () {
    return {
      menuBtns: [
        // 导航菜单按钮
        {
          key: 'btn-1',
          icon: 'plus',
          title: '新建',
          type: 'primary',
          func: () => this.handleEdit()
        },
        {
          key: 'btn-2',
          icon: 'form',
          title: '编辑',
          type: 'primary',
          func: () => this.handleEdit()
          // func: () => this.handleEdit(true)
        },
        {
          key: 'btn-3',
          icon: 'delete',
          title: '删除',
          type: 'primary',
          func: () => this.handleEdit()
          // func: () => this.remove()
        },
        {
          key: 'btn-4',
          icon: 'check',
          title: '提交',
          type: 'primary',
          func: () => this.handleEdit()
          // func: () => this.submit()
        },
        {
          key: 'btn-5',
          icon: 'backward',
          title: '取回',
          type: 'primary',
          func: () => this.handleEdit()
          // func: () => this.cancel()
        },
        {
          key: 'btn-9',
          icon: 'fork',
          title: '审批',
          type: 'primary',
          func: () => this.handleEdit()
          // func: () => this.handleDetail()
        },
        {
          key: 'btn-6',
          icon: 'export',
          title: '导出',
          type: 'primary',
          func: () => this.handleEdit()
          // func: () => this.exportTable()
        },
        {
          key: 'btn-7',
          icon: 'printer',
          title: '打印',
          type: 'primary',
          func: () => this.handleEdit()
          // func: () => this.printTable()
        },
        {
          key: 'btn-8',
          icon: 'sync',
          title: '刷新',
          type: 'primary',
          func: () => this.handleEdit()
          // func: () => {
          //   this.queryParam = {}
          //   this.range = []
          //   this.refresh(true)
          // }
        }
      ]
    }
  },
  methods: {
    handleEdit () {
      this.$emit('onEdit')
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
/deep/ .read-after {
  color: #f55858;
}
</style>
