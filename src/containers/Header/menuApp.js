export const adminMenu = [
  {
    // Quản lý người dùng
    name: 'menu.admin.title',
    menus: [
      {
        name: 'menu.admin.manageDoctor',
        link: '/system/manage-doctor',
        // subMenus: [
        //   {
        //     name: 'menu.system.system-administrator.manage-user',
        //     link: '/system/manage-user',
        //   },
        //   {
        //     name: 'menu.system.system-administrator.product-manage',
        //     link: '/system/product-manage',
        //   },
        // {
        //   name: 'menu.system.system-administrator.register-package-group-or-account',
        //   link: '/system/register-package-group-or-account',
        // },
        // ],
      },
      {
        name: 'menu.admin.manageAdmin',
        link: '/system/manage-admin',
      },
      {
        name: 'menu.admin.manageUser',
        link: '/system/manage-user',
      },
    ],
  },
  {
    // Quản lý phòng khám
    name: 'menu.admin.titleClinic',
    menus: [
      {
        name: 'menu.admin.manageClinic',
        link: '/system/manage-clinic',
      },
    ],
  },
  {
    // Quản lý chuyên khoa
    name: 'menu.admin.titleSpecialty',
    menus: [
      {
        name: 'menu.admin.manageSpecialty',
        link: '/system/manage-specialty',
      },
    ],
  },
  {
    // Quản lý cẩm nang
    name: 'menu.admin.titleHandbook',
    menus: [
      {
        name: 'menu.admin.manageHandbook',
        link: '/system/manage-handbook',
      },
    ],
  },
];
