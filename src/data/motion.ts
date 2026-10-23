export const professionalRoles = [
  'Front-end Developer',
  'Back-end Developer',
  'UX/UI Designer',
  'Full-stack Developer',
] as const

export const motionSettings = {
  typing: { character: 80, erase: 42, hold: 1500, gap: 300 },
  feathers: {
    desktop: 30,
    tablet: 18,
    mobile: 10,
    minWidth: 12,
    maxWidth: 34,
    radius: 115,
    repulsion: 28,
  },
  portrait: { rotation: 720, duration: 1.6, haloRadius: 75, haloTravel: 22 },
} as const
