import React, { useContext } from 'react';
import { Machine } from 'xstate';
import { useMachine } from '@xstate/react';

const menuMachine = Machine({
  id: 'menu',
  initial: 'idle',
  states: {
    closed: {
      on: { CLICK: 'open' }
    },
    open: {
      on: { CLICK: 'closed' }
    }
  }
});

const MenuContext = React.createContext();

function Menu({ children }) {
  const [current, send] = useMachine(menuMachine);

  return (
    <MenuContext.Provider value={{ current, send }}>
      {children}
    </MenuContext.Provider>
  );
}

function MenuButton({ children }) {
  const { send } = useContext(MenuContext);

  return <button onClick={() => send('CLICK')}>{children}</button>;
}

function MenuPopover({ children }) {
  const { current } = useContext(MenuContext);

  return;
}

function MenuItem() {}
