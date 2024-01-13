export const adminMenu = [
  {
    // Quản lý người dùng
    name: 'menu.admin.title',
    menus: [
      // {
      // name: 'menu.admin.manageDoctor',
      // link: '/system/manage-doctor',
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
      // },
      {
        name: 'menu.admin.manageAdmin',
        link: '/system/manage-admin',
      },
      {
        name: 'menu.admin.manageUser',
        link: '/system/users',
      },
      {
        name: 'menu.admin.manageDoctor',
        link: '/system/doctors',
      },
      {
        // Quản lý kế hoạch khám khám bệnh

        name: 'menu.doctor.manage-schedule',
        link: '/doctor/schedule',
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
        link: '/system/specialties',
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

export const doctorMenu = [
  {
    name: 'menu.admin.title',
    menus: [
      {
        // Quản lý kế hoạch khám khám bệnh
        name: 'menu.doctor.manage-schedule',
        link: '/doctor/schedule',
      },
    ],
  },
];
