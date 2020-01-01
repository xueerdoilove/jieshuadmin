const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  name: state => state.user.name,
  bookStoreId: state => state.user.bookStoreId,
  permission_routers: state => state.permission.routers,  //路由列表
  addRouters: state => state.permission.addRouters
}
export default getters
