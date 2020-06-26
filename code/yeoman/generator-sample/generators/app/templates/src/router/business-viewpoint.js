export default [
  {
    path: "/business-viewpoint/page-detail",
    name: "business-viewpoint-page-detail",
    component: () =>
      import(
        "../views/business-viewpoint/HelloWorld.vue"
      ),
    meta: {
      checkLogin: true,
      hiddenClineTabBar: true
    }
  }
];
