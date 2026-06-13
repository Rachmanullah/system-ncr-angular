export const BUTTON_VARIANTS = {
  PRIMARY: `
    bg-blue-600
    text-white
    hover:bg-blue-700
    focus:ring-blue-300
  `,

  SECONDARY: `
    bg-gray-200
    text-gray-800
    hover:bg-gray-300
    focus:ring-gray-300
  `,

  OUTLINE: `
    border
    border-blue-500
    bg-transparent
    text-blue-600
    hover:bg-blue-50
    focus:ring-blue-200
  `,

  GHOST: `
    bg-transparent
    text-gray-700
    hover:bg-gray-100
    focus:ring-gray-200
  `,

  DANGER: `
    bg-red-600
    text-white
    hover:bg-red-700
    focus:ring-red-300
  `,

  WARNING: `
    bg-yellow-600
    text-white
    hover:bg-yellow-700
    focus:ring-yellow-300
  `,

  SUCCESS: `
    bg-green-600
    text-white
    hover:bg-green-700
    focus:ring-green-300
  `
} as const;

export const BUTTON_SIZES = {
  SM: 'px-2 py-1 text-xs',
  MD: 'px-4 py-2 text-sm',
  LG: 'px-6 py-3 text-base',
} as const;

export const BUTTON_RADIUS = {
  NONE: 'rounded-none',
  SM: 'rounded',
  MD: 'rounded-md',
  LG: 'rounded-lg',
  XL: 'rounded-xl',
  FULL: 'rounded-full',
} as const;