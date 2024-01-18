export const adminMenu = [
  {
    name: 'menu.admin.title',
    menus: [
      {
        name: 'menu.admin.manageUser',
        link: '/system/users',
      },
      {
        name: 'menu.admin.manageDoctor',
        link: '/system/doctors',
      },
      {
        name: 'menu.doctor.manage-schedule',
        link: '/doctor/schedule',
      },
    ],
  },
  {
    name: 'menu.admin.titleClinic',
    menus: [
      {
        name: 'menu.admin.manageClinic',
        link: '/system/clinics',
      },
    ],
  },
  {
    name: 'menu.admin.titleSpecialty',
    menus: [
      {
        name: 'menu.admin.manageSpecialty',
        link: '/system/specialties',
      },
    ],
  },
];

export const doctorMenu = [
  {
    name: 'menu.admin.title',
    menus: [
      {
        name: 'menu.doctor.manage-schedule',
        link: '/doctor/schedule',
      },
      {
        name: 'menu.doctor.manage-patient',
        link: '/doctor/patient',
      },
    ],
  },
];
