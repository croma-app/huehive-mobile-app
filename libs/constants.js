export const ROUTE_NAMES = {
  MY_PALETTES: 'MyPalettes',
  ABOUT_US: 'AboutUs',
  HOME_SEARCH: 'HomeSearch',
  CHAT_SESSION: 'ChatSession',
  CHAT_SESSION_HISTORIES: 'ChatSessionHistories',
  COLOR_DETAILS: 'ColorDetails',
  PALETTES: 'Palettes',
  SAVE_PALETTE: 'SavePalette',
  PRO_VERSION: 'ProVersion',
  PALETTE_LIBRARY: 'PaletteLibrary',
  COLOR_LIST: 'ColorList',
  USER_PROFILE: 'UserProfile',
  EXPLORE_PALETTE: 'ExplorePalette'
};

export const NUMBER_OF_COLORS_PRO_COUNT = 10;
export const PRIVATE_ROUTES = new Set([
  ROUTE_NAMES.HOME_SEARCH,
  ROUTE_NAMES.CHAT_SESSION_HISTORIES
]);
