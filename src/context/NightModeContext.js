import { createContext, useState } from 'react';

const NightModeContext = createContext({
  mode: true,
  toggle: (x) => {},
});

export const NightModeContextProvider = (props) => {
  const [mode, setMode] = useState(true);

  function toggleMode(x) {
    setMode(x);
  }

  const context = {
    mode: mode,
    toggle: toggleMode,
  };

  return (
    <NightModeContext.Provider value={{ context }}>
      {props.children}
    </NightModeContext.Provider>
  );
};
export default NightModeContext;
