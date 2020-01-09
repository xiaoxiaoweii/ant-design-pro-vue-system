<template>
  <div>
    <div class="table-operator" :style="{ 'margin-bottom': '24px'}">
      <span v-for="item in menuBtns" :key="item.key">
        <a-dropdown v-if="item.title === '导出'">
          <a-menu slot="overlay">
            <a-menu-item>
              <a-icon :type="item.icon" />PDF
            </a-menu-item>
            <a-menu-item>
              <a-icon :type="item.icon" />EXCEL
            </a-menu-item>
          </a-menu>
          <a-button class="menu-button" :type="item.type" :icon="item.icon">
            {{ item.title }}
            <a-icon type="down" />
          </a-button>
        </a-dropdown>
        <a-dropdown v-else-if="item.title === '打印'">
          <a-menu slot="overlay">
            <a-menu-item key="print-all">
              <a-icon type="printer" />全部
            </a-menu-item>
            <a-menu-item>
              <a-icon type="printer" />已选择
            </a-menu-item>
          </a-menu>
          <a-button class="menu-button" :type="item.type" :icon="item.icon">
            {{ item.title }}
            <a-icon type="down" />
          </a-button>
        </a-dropdown>
        <a-button v-else class="menu-button" :type="item.type" :icon="item.icon">{{ item.title }}</a-button>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TableList',
  data () {
    return {
      menuBtns: [ // 导航菜单按钮
        {
          key: 'btn-1',
          icon: 'plus',
          title: '新建',
          type: 'primary'
          // func: () => this.handleEdit()
        },
        {
          key: 'btn-2',
          icon: 'form',
          title: '编辑',
          type: 'primary'
          // func: () => this.handleEdit(true)
        },
        {
          key: 'btn-3',
          icon: 'delete',
          title: '删除',
          type: 'primary'
          // func: () => this.remove()
        },
        {
          key: 'btn-4',
          icon: 'check',
          title: '提交',
          type: 'primary'
          // func: () => this.submit()
        },
        {
          key: 'btn-5',
          icon: 'backward',
          title: '取回',
          type: 'primary'
          // func: () => this.cancel()
        },
        {
          key: 'btn-9',
          icon: 'fork',
          title: '审批',
          type: 'primary'
          // func: () => this.handleDetail()
        },
        {
          key: 'btn-6',
          icon: 'export',
          title: '导出',
          type: 'primary'
          // func: () => this.exportTable()
        },
        {
          key: 'btn-7',
          icon: 'printer',
          title: '打印',
          type: 'primary'
          // func: () => this.printTable()
        },
        {
          key: 'btn-8',
          icon: 'sync',
          title: '刷新',
          type: 'primary'
          // func: () => {
          //   this.queryParam = {}
          //   this.range = []
          //   this.refresh(true)
          // }
        }
      ]
    }
  }
}
</script>

</style>
