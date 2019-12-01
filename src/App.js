import React from 'react';

import {
  Menu,
  MenuButton,
  MenuPopover,
  MenuItems,
  MenuItem,
  MenuLink
} from './Menu';

export default function App() {
  return (
    <Menu>
      <MenuButton>Click Me</MenuButton>
      <MenuPopover>
        <h3>Filters</h3>
        <MenuItems>
          <MenuItem>Products</MenuItem>
          <MenuItem>Domains</MenuItem>
          <MenuItem>Expiration Date</MenuItem>
        </MenuItems>
        <h3>Links</h3>
        <MenuItems>
          <MenuLink href="#">Settings</MenuLink>
        </MenuItems>
      </MenuPopover>
    </Menu>
  );
}
