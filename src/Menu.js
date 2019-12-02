import React, { useContext, useEffect, useRef, useLayoutEffect } from 'react';
import { Machine } from 'xstate';
import { useMachine } from '@xstate/react';

const menuMachine = Machine({
  id: 'menu',
  initial: 'closed',
  states: {
    closed: {
      on: { TOGGLE: 'open' }
    },
    open: {
      on: { TOGGLE: 'closed' }
    }
  }
});

const MenuContext = React.createContext();

export function Menu({ children }) {
  const [current, send] = useMachine(menuMachine);
  const refContainer = useRef([]);

  return (
    <MenuContext.Provider value={{ current, send, refContainer }}>
      {children}
    </MenuContext.Provider>
  );
}

export function MenuButton({ children }) {
  const { current, send, refContainer } = useContext(MenuContext);
  const menuButtonRef = useRef();

  useEffect(() => {
    refContainer.current[0] = menuButtonRef;
  }, [refContainer]);

  const handleKeyDown = e => {
    if (e.key === 'ArrowDown' && current.matches('closed')) {
      send('TOGGLE');
    }
    if (e.key === 'ArrowDown' && current.matches('open')) {
      console.log(refContainer);
      refContainer.current[1].current.focus();
    }
    if (e.key === 'Escape' && current.matches('open')) {
      refContainer.current = refContainer.current.slice(0, 1);
      send('TOGGLE');
    }
  };

  return (
    <button
      onClick={() => send('TOGGLE')}
      onKeyDown={handleKeyDown}
      ref={menuButtonRef}
    >
      {children}
    </button>
  );
}

export function MenuPopover({ children }) {
  const { current } = useContext(MenuContext);

  return current.matches('open') && <div>{children}</div>;
}

export function MenuItems({ children }) {
  return <div>{children}</div>;
}

function useMenuItem() {
  const { current, send, refContainer } = useContext(MenuContext);
  const itemRef = useRef();
  const indexRef = useRef();

  useLayoutEffect(() => {
    indexRef.current = refContainer.current.length;
    refContainer.current[indexRef.current] = itemRef;
  }, [refContainer]);

  useEffect(() => {
    if (
      current.history.matches('closed') &&
      current.matches('open') &&
      indexRef.current === 1
    ) {
      itemRef.current.focus();
    }
  });

  const handleKeyDown = e => {
    if (e.key === 'ArrowDown') {
      if (indexRef.current !== refContainer.current.length - 1) {
        refContainer.current[indexRef.current + 1].current.focus();
      }
    }
    if (e.key === 'ArrowUp') {
      refContainer.current[indexRef.current - 1].current.focus();
    }
    if (e.key === 'Escape') {
      refContainer.current[0].current.focus();
      refContainer.current = refContainer.current.slice(0, 1);
      send('TOGGLE');
    }
  };

  const handleSelect = () => {
    onSelect();
    refContainer.current = refContainer.current.slice(0, 1);
    send('TOGGLE');
  };

  return { itemRef, handleKeyDown, handleSelect };
}

export function MenuItem({ children, onSelect }) {
  const { handleSelect, itemRef, handleKeyDown } = useMenuItem();

  return (
    <button onClick={handleSelect} ref={itemRef} onKeyDown={handleKeyDown}>
      {children}
    </button>
  );
}

export function MenuLink({ children, href }) {
  const { itemRef, handleKeyDown } = useMenuItem();

  return (
    <a href={href} ref={itemRef} onKeyDown={handleKeyDown}>
      {children}
    </a>
  );
}
