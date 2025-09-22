"use client";
import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Icon from "@mui/material/Icon";
import Link from "next/link";

interface IListItemsProps {
  label: string;
  to: string;
  icon: any;
  isActive: boolean;
}

const ListItems = React.forwardRef<HTMLAnchorElement, IListItemsProps>(
  ({ label, to, icon, isActive }, ref) => {
    return (
      <ListItemButton
        ref={ref}
        component={Link}
        href={to}
        style={{
          textDecoration: "none",
          backgroundColor: isActive ? "#ccc" : "",
          color: "inherit",
        }}
      >
        <ListItemIcon>
          <Icon>{icon}</Icon>
        </ListItemIcon>
        <ListItemText primary={label} />
      </ListItemButton>
    );
  }
);

ListItems.displayName = 'ListItems';

export default ListItems;
