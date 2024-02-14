export const THEME_COLORS = {
  mode_1: {
    MBcolor:
      'linear-gradient(270deg, rgba(244,244,18,1) 0%, rgba(0,212,255,1) 100%)',
    SideC: 'rgba(0,212,255,1)',
    SideU: 'rgba(244,244,18,1)',
  },
  mode_2: {
    MBcolor:
      'linear-gradient(270deg, rgba(244,18,18,1) 0%, rgba(255,191,0,1) 100%)',
    SideC: 'rgba(255,191,0,1)',
    SideU: 'rgba(244,18,18,1)',
  },
  mode_3: {
    MBcolor:
      'linear-gradient(270deg, rgba(244,153,18,1) 0%, rgba(0,255,138,1) 100%)',
    SideC: 'rgba(0,255,138,1)',
    SideU: 'rgba(244,153,18,1)',
  },
  mode_4: {
    MBcolor:
      'linear-gradient(270deg, rgba(244,18,18,1) 0%, rgba(0,152,255,1) 100%)',
    SideC: 'rgba(0,152,255,1)',
    SideU: 'rgba(244,18,18,1)',
  },
  mode_5: {
    MBcolor:
      'linear-gradient(270deg, rgba(238,18,244,1) 0%, rgba(120,0,255,1) 100%)',
    SideC: 'rgba(120,0,255,1)',
    SideU: 'rgba(238,18,244,1)',
  },
  mode_6: {
    MBcolor:
      'linear-gradient(270deg, rgba(18,194,244,1) 0%, rgba(237,0,255,1) 100%)',
    SideC: 'rgba(237,0,255,1)',
    SideU: 'rgba(18,194,244,1)',
  },
};

export const ThemeReducerFunction = (state, action) => {
  switch (action.type) {
    case 'MODE_1':
      return {
        MBcolor: THEME_COLORS.mode_1.MBcolor,
        SideC: THEME_COLORS.mode_1.SideC,
        SideU: THEME_COLORS.mode_1.SideU,
      };
    case 'MODE_2':
      return {
        MBcolor: THEME_COLORS.mode_2.MBcolor,
        SideC: THEME_COLORS.mode_2.SideC,
        SideU: THEME_COLORS.mode_2.SideU,
      };
    case 'MODE_3':
      return {
        MBcolor: THEME_COLORS.mode_3.MBcolor,
        SideC: THEME_COLORS.mode_3.SideC,
        SideU: THEME_COLORS.mode_3.SideU,
      };
    case 'MODE_4':
      return {
        MBcolor: THEME_COLORS.mode_4.MBcolor,
        SideC: THEME_COLORS.mode_4.SideC,
        SideU: THEME_COLORS.mode_4.SideU,
      };
    case 'MODE_5':
      return {
        MBcolor: THEME_COLORS.mode_5.MBcolor,
        SideC: THEME_COLORS.mode_5.SideC,
        SideU: THEME_COLORS.mode_5.SideU,
      };
    case 'MODE_6':
      return {
        MBcolor: THEME_COLORS.mode_6.MBcolor,
        SideC: THEME_COLORS.mode_6.SideC,
        SideU: THEME_COLORS.mode_6.SideU,
      };
    default:
      return state;
  }
};

export const FONSTS = {
  Font_1: 'blueParty',
  Font_2: 'capital',
  Font_3: 'digital',
  Font_4: 'lovely',
  Font_5: 'golden',
  Font_6: 'sunny',
  Font_7: 'sans',
};

export const FontReducerFunction = (state, action) => {
  switch (action.type) {
    case 'FONT_1':
      return { Font: FONSTS.Font_1, FontSize: '1.5rem' };
    case 'FONT_2':
      return { Font: FONSTS.Font_2, FontSize: '1rem' };
    case 'FONT_3':
      return { Font: FONSTS.Font_3, FontSize: '.5rem' };
    case 'FONT_4':
      return { Font: FONSTS.Font_4, FontSize: '1.75rem' };
    case 'FONT_5':
      return { Font: FONSTS.Font_5, FontSize: '2rem' };
    case 'FONT_6':
      return { Font: FONSTS.Font_6, FontSize: '1.5rem' };
    case 'FONT_7':
      return { Font: FONSTS.Font_7, FontSize: '1rem' };
    default:
      return state;
  }
};
