export const professionalRoles = [
  'Front-end Developer',
  'Back-end Developer',
  'UX/UI Designer',
  'Full-stack Developer',
] as const

export const motionSettings = {
  typing: { character: 80, erase: 42, hold: 1500, gap: 300 },
  feathers: {
    radius: 115,
    repulsion: 28,
    layers: [
      {
        id: 'foreground',
        desktop: 5,
        tablet: 3,
        mobile: 1,
        files: [
          'pena_01_pluma_curva_grande.svg',
          'pena_02_pluma_aberta_borda.svg',
          'pena_04_pluma_ondulada.svg',
        ],
        minWidth: 240,
        maxWidth: 380,
        blur: 1.4,
        scroll: 0.12,
      },
      {
        id: 'middle',
        desktop: 11,
        tablet: 6,
        mobile: 3,
        files: [
          'pena_03_pluma_delicada.svg',
          'pena_04_pluma_ondulada.svg',
          'pena_05_pluma_fina.svg',
          'pena_06_pluma_solta.svg',
        ],
        minWidth: 58,
        maxWidth: 128,
        blur: 0.35,
        scroll: 0.06,
      },
      {
        id: 'background',
        desktop: 14,
        tablet: 9,
        mobile: 6,
        files: ['pena_03_pluma_delicada.svg', 'pena_05_pluma_fina.svg', 'pena_06_pluma_solta.svg'],
        minWidth: 22,
        maxWidth: 52,
        blur: 0.8,
        scroll: 0.02,
      },
    ],
  },
  portrait: { rotationY: 720, duration: 1.6, haloRadius: 75, haloTravel: 22 },
} as const
