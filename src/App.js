import React from 'react';

import { Menu, MenuButton, MenuPopover } from './Menu';

export default function App() {
  return (
    <Menu>
      <MenuButton>Click Me</MenuButton>
      <MenuPopover>Oh Hello</MenuPopover>
    </Menu>
  );
}
