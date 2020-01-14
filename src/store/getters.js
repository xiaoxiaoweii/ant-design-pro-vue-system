const getters = {
  device: state => state.app.device,
  theme: state => state.app.theme,
  color: state => state.app.color,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  nickname: state => state.user.name,
  welcome: state => state.user.welcome,
  roles: state => state.user.roles,
  trees: state => state.user.trees,
  userId: state => state.user.uid,
  userInfo: state => state.user.info,
  addRouters: state => state.permission.addRouters,
  menuKey: state => state.menu_key,
  routerList: state => state.user.routerList,
  multiTab: state => state.app.multiTab
}

export default getters
