export const BUTTON_VARIANS = {
    PRIMARY:
        'text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-300',

    SUCCESS:
        'text-white bg-green-600 hover:bg-green-700 focus:ring-green-300',

    DANGER:
        'text-white bg-red-600 hover:bg-red-700 focus:ring-red-300',

    WARNING:
        'text-black bg-yellow-400 hover:bg-yellow-500 focus:ring-yellow-300',

    SECONDARY:
        'text-gray-800 bg-gray-200 hover:bg-gray-300 focus:ring-gray-300',

    DARK:
        'text-white bg-gray-800 hover:bg-gray-900 focus:ring-gray-500',
} as const;

export const BUTTON_SIZES = {
    SM: 'px-2 py-1 text-xs',
    MD: 'px-4 py-2 text-sm',
    LG: 'px-6 py-3 text-base',
} as const;