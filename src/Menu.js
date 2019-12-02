import React, { useContext, useEffect, useRef, useLayoutEffect } from 'react';
import { Machine, assign, send } from 'xstate';
import { useMachine } from '@xstate/react';

// TODO: clear out ref list every render
// TODO: set up click outside properly with an effect in 'Menu'

// state machine with xstate, pretty simple, just wanted to tinker with xstate really

const menuMachine = Machine({
  id: 'menu',
  initial: 'closed',
  context: {
    hovered: false
  },
  states: {
    closed: {
      on: { TOGGLE: 'open' }
    },
    open: {
      on: {
        TOGGLE: 'closed',
        MOUSEOUT: {
          actions: [
            assign((context, event) => {
              return { hovered: false };
            })
          ]
        },
        MOUSEIN: {
          actions: [
            assign((context, event) => {
              return { hovered: true };
            })
          ]
        },
        CLICK: {
          actions: [
            (context, event) => {
              console.log('hallo');
              if (context.hovered) {
                send('TOGGLE');
              }
            }
          ]
        }
      }
    }
  }
});

/////////////////////////////////////////////////
/* 
Menu Component - Utilizes Compound Component pattern 
with context to maximize flexibility.
*/

const MenuContext = React.createContext();

export function Menu({ children }) {
  const [current, send] = useMachine(menuMachine);
  const menuItemRefs = useRef();
  menuItemRefs.current = [];
  const menuButtonRef = useRef();

  return (
    <MenuContext.Provider
      value={{ current, send, menuButtonRef, menuItemRefs }}
    >
      <div
        onMouseLeave={() => send('MOUSEOUT')}
        onMouseEnter={() => send('MOUSEIN')}
        onMouseDown={() => send('CLICK')}
      >
        {children}
      </div>
    </MenuContext.Provider>
  );
}

export function MenuButton({ children }) {
  const { current, send, menuItemRefs, menuButtonRef } = useContext(
    MenuContext
  );

  const handleKeyDown = e => {
    if (e.key === 'ArrowDown' && current.matches('closed')) {
      send('TOGGLE');
    }
    if (e.key === 'ArrowDown' && current.matches('open')) {
      menuItemRefs.current[0].current.focus();
    }
    if (e.key === 'Escape' && current.matches('open')) {
      // menuItemRefs.current;
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
  const { current, send, menuItemRefs, menuButtonRef } = useContext(
    MenuContext
  );
  const itemRef = useRef();
  const indexRef = useRef();

  useLayoutEffect(() => {
    indexRef.current = menuItemRefs.current.length;
    menuItemRefs.current[indexRef.current] = itemRef;
  }, [menuItemRefs]);

  useEffect(() => {
    if (
      current.history.matches('closed') &&
      current.matches('open') &&
      indexRef.current === 0
    ) {
      itemRef.current.focus();
    }
  });

  const handleKeyDown = e => {
    if (
      e.key === 'ArrowDown' &&
      indexRef.current !== menuItemRefs.current.length - 1
    ) {
      menuItemRefs.current[indexRef.current + 1].current.focus();
    }
    if (e.key === 'ArrowUp' && indexRef.current > 0) {
      menuItemRefs.current[indexRef.current - 1].current.focus();
    }
    if (e.key === 'Escape') {
      menuButtonRef.current.focus();
      // menuItemRefs.current = menuItemRefs.current.slice(0, 1);
      send('TOGGLE');
    }
  };

  const handleSelect = () => {
    onSelect();
    menuButtonRef.current.focus();
    // menuItemRefs.current = menuItemRefs.current.slice(0, 1);
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
