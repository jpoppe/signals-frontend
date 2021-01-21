import { themeSpacing } from '@amsterdam/asc-ui';
import React from 'react';
import styled from 'styled-components';

const DEFAULT_ICON_SIZE = 40;

const List = styled.ul`
  padding: 0;
  margin: 0;
`;

const ListItem = styled.li`
  line-height: ${themeSpacing(4)};
  padding: ${themeSpacing(1, 0)};
  display: flex;
  align-items:center;
  font-size: initial;

  &:focus {
    outline-style: none;
  }
`;

const StyledIcon = styled.span<{ url: string; size: number }>`
  margin-right: ${themeSpacing(2)};
  display: inline-block;
  background-image: url(${({ url }) => url}) ;
  background-size: cover;
  width: ${({ size }) => size}px;
  height:${({ size }) => size}px;
`;

export interface IconListItem {
  iconUrl: string;
  label: string;
  id: string;
}

export interface IconListProps {
  items: IconListItem[];
  id: string;
  size?: number;
  className?: string;
}

const IconList: React.FC<IconListProps> = ({ items, size = DEFAULT_ICON_SIZE, id, className }) => (
  <List className={className} data-testid={id}>
    {items.map(({ iconUrl, label, id: itemId }) => (
      <ListItem data-testid={`${id}-item-${itemId}`} key={label} tabIndex={-1}>
        <React.Fragment>
          <StyledIcon url={iconUrl} size={size} />
          {label}
        </React.Fragment>
      </ListItem>
    ))}
  </List>
);

export default IconList;
