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

/* 
So far, these components are HIGHLY composable, which is no surpise considering they mostly just render
their children with some props.

So, composability is cool, and you can basically make whatever variations you want, like for example, if you wanted to make a
'MenuGroup' Component, you could do something like this:

function MenuGroup({ title, children }) {
  return (
    <div>
      <strong>{title}</strong>
      {children}
    </div>
  )
}

And something like that is just a *little* bit more constrained. Feels more design-system-y and less library-y.
Still pretty free-form as far as it goes, but you at least have SOME pre-determined shape.

Could easily extend this to use the airbnb 'base-variant' pattern too.

For example, the MenuButton could have an optional prop called icon, which would be a render prop. A lot of menu buttons have a little
arrow icon or some other bit of UI on the right hand side of the button, so that's the space that this prop would populate.

So you have:

                 MenuButton
BaseMenuButton /
               \
                MenuButtonWithIcon

hyper-flexible -> feels like it belongs in a library, something you can use to build a design system, but not a design system itself
Flexible, but constrained -> exposing the base, seems like it makes sense in a super big company with a lot of different products and
UIs to build, makes it easier on the team as well because you don't need to think of every usable variation.
Many, constrained options -> makes sense with a small system being used in a couple of similar products.
*/
