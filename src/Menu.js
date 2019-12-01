import React, { useContext } from 'react';
import { Machine } from 'xstate';
import { useMachine } from '@xstate/react';

const menuMachine = Machine({
  id: 'menu',
  initial: 'closed',
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

export function Menu({ children }) {
  const [current, send] = useMachine(menuMachine);

  return (
    <MenuContext.Provider value={{ current, send }}>
      {children}
    </MenuContext.Provider>
  );
}

export function MenuButton({ children }) {
  const { send } = useContext(MenuContext);

  return <button onClick={() => send('CLICK')}>{children}</button>;
}

export function MenuPopover({ children }) {
  const { current } = useContext(MenuContext);

  return current.matches('open') && <div>{children}</div>;
}

export function MenuItems({ children }) {
  return <div>{children}</div>;
}

export function MenuItem({ children }) {
  return <button>{children}</button>;
}

export function MenuLink({ children, href }) {
  return <a href={href}>{children}</a>;
}
