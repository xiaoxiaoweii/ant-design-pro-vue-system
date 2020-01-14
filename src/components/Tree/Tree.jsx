import { Menu, Icon, Input } from 'ant-design-vue'
import { purchase } from '@/core/icons'

// 自定义icon图标
const icons = {
  'purchase': purchase
}

const { Item, ItemGroup, SubMenu } = Menu
const { Search } = Input

export default {
  name: 'Tree',
  props: {
    dataSource: {
      type: Array,
      required: true
    },
    openKeys: {
      type: Array,
      default: () => []
    },
    search: {
      type: Boolean,
      default: false
    }
  },
  created () {
    this.localOpenKeys = this.openKeys.slice(0)
  },
  data () {
    return {
      localOpenKeys: [],
      searchText: ''
    }
  },
  methods: {
    handlePlus (item) {
      this.$emit('add', item)
    },
    handleSelect (item) {
      this.$emit('select', item)
    },
    onChange (e) {
      const value = e.target.value
      this.searchText = value
    },
    handleTitleClick (item) {
      this.$emit('titleClick', item)
    },

    renderSearch () {
      return (
        <Search
          placeholder="输入关键字"
          style="width: 100%; margin-bottom: 1rem"
          {...{ on: { change: (e) => this.onChange(e) } }}
        />
      )
    },
    renderIcon (icon) {
      if (icon === 'none' || icon === undefined || !icon) {
        return null
      }
      const props = {}
      // typeof (icon) === 'object' ? props.component = icon : props.type = icon
      icons[icon] ? props.component = icons[icon] : props.type = icon
      return (
        <Icon {... { props } }/>
      )
    },
    renderMenuItem (item) {
      return (
        <Item key={item.key} {...{ on: { click: () => this.handleSelect(item) } }}>
          { this.renderIcon(item.icon) }
          { item.title }
          { !item.hidden ? <a class="btn" style="width: 20px;z-index:1300" {...{ on: { click: () => this.handlePlus(item) } }}><a-icon type="plus"/></a> : null }
        </Item>
      )
    },
    renderItem (item) {
      return (item.children && item.children.length) ? this.renderSubItem(item, item.key) : this.renderMenuItem(item, item.key)
    },
    renderItemGroup (item) {
      const childrenItems = item.children.map(o => {
        return this.renderItem(o, o.key)
      })

      return (
        <ItemGroup key={item.key}>
          <template slot="title">
            <span>{ item.title }</span>
            <a-dropdown>
              <a class="btn"><a-icon type="ellipsis" /></a>
              <a-menu slot="overlay">
                <a-menu-item key="1">新增</a-menu-item>
                <a-menu-item key="2">合并</a-menu-item>
                <a-menu-item key="3">移除</a-menu-item>
              </a-menu>
            </a-dropdown>
          </template>
          { childrenItems }
        </ItemGroup>
      )
    },
    renderSubItem (item, key) {
      const childrenItems = item.children && item.children.map(o => {
        return this.renderItem(o, o.key)
      })

      const title = (
        <span slot="title">
          { this.renderIcon(item.icon) }
          <span>{ item.title }</span>
        </span>
      )

      if (item.group) {
        return this.renderItemGroup(item)
      }
      // titleClick={this.handleTitleClick(item)}
      return (
        <SubMenu key={key} {...{ on: { titleClick: () => this.handleTitleClick(item) } }}>
          { title }
          { childrenItems }
        </SubMenu>
      )
    }
  },
  render () {
    const { dataSource, search } = this.$props

    // this.localOpenKeys = openKeys.slice(0)
    const list = dataSource.map(item => {
      const newItem = JSON.parse(JSON.stringify(item))
      newItem.children = newItem.children.filter(d => d.title.includes(this.searchText))
      return this.renderItem(newItem)
    })

    return (
      <div class="tree-wrapper">
        { search ? this.renderSearch() : null }
        <Menu mode="inline" class="custom-tree" {...{ on: { click: item => this.$emit('click', item), 'update:openKeys': val => { this.localOpenKeys = val } } }} openKeys={this.localOpenKeys}>
          { list }
        </Menu>
      </div>
    )
  }
}
