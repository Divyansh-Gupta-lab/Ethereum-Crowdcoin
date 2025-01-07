"use client";

import React from "react";
import { redirect, useRouter } from "next/navigation";
import { MenuMenu, MenuItem, Menu } from "semantic-ui-react";

export default function Header() {
  const router = useRouter();
  return (
    <div className="mt-3 mb-5">
      <Menu>
        <MenuItem onClick={() => router.replace("/")}>Crown Coin</MenuItem>
        <Menu.Menu position="right">
          <MenuItem onClick={() => router.replace("/")}>Campaigns</MenuItem>
          <MenuItem
            content="+"
            onClick={() => router.replace("/campaigns/new")}
          ></MenuItem>
        </Menu.Menu>
      </Menu>
    </div>
  );
}
