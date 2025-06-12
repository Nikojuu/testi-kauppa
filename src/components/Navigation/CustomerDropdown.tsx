"use client";
import { User } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { User as UserType } from "@/app/utils/types";
import { logout } from "@/lib/actions/authActions";

const CustomerDropdown = ({ user }: { user: UserType | null }) => {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <User size={24} />
          <span className="sr-only">User menu</span>
        </Button>
      </DropdownMenuTrigger>{" "}
      <DropdownMenuContent align="end" className="w-48" sideOffset={5}>
        {user ? (
          <>
            <DropdownMenuLabel>Tervetuloa {user.firstName}!</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href="/mypage">Oma sivu</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <form
                action={() => {
                  logout();
                }}
              >
                <Button type="submit">Kirjaudu ulos</Button>
              </form>
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem asChild>
              <Link href="/login">Kirjaudu</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/register">Rekisteröidy</Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CustomerDropdown;
