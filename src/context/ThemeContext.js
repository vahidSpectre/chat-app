import React, { useReducer, createContext, useEffect } from 'react';
import { FontReducerFunction, ThemeReducerFunction } from './ThemeReducer';

const INTITAIL_STATE = {
  MBcolor: JSON.parse(localStorage?.getItem('MBcolor')) || 'white',
  SideC: JSON.parse(localStorage?.getItem('SideC')) || 'white',
  SideU: JSON.parse(localStorage?.getItem('SideU')) || 'white',
  Font: JSON.parse(localStorage?.getItem('Font')) || 'sans-serif',
  dispach: () => {},
  fontDispach: () => {},
};
const INTITAIL_FONTSTATE = {
  Font: JSON.parse(localStorage?.getItem('Font')) || 'sans-serif',
  FontSize: JSON.parse(localStorage?.getItem('FontSize')) || '1rem',
  fontDispach: () => {},
};

export const ThemeContext = createContext(INTITAIL_STATE);

export const ThemeContextProvider = ({ children }) => {
  const [state, dispach] = useReducer(ThemeReducerFunction, INTITAIL_STATE);
  const [fontstate, fontDispach] = useReducer(
    FontReducerFunction,
    INTITAIL_FONTSTATE
  );
  useEffect(() => {
    localStorage.setItem('MBcolor', JSON.stringify(state.MBcolor));
    localStorage.setItem('SideC', JSON.stringify(state.SideC));
    localStorage.setItem('SideU', JSON.stringify(state.SideU));
    localStorage.setItem('Font', JSON.stringify(fontstate.Font));
    localStorage.setItem('FontSize', JSON.stringify(fontstate.FontSize));
  }, [
    state.MBcolor,
    state.SideC,
    state.SideU,
    fontstate.Font,
    fontstate.FontSize,
  ]);

  return (
    <ThemeContext.Provider
      value={{
        MBcolor: state.MBcolor,
        SideC: state.SideC,
        SideU: state.SideU,
        Font: fontstate.Font,
        FontSize: fontstate.FontSize,
        dispach,
        fontDispach,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
