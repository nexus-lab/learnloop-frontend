import React from 'react';
import {
  ChevronDown,
  CreditCard,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import Image from 'next/image';

export function UserMenu({ imageUrl = 'https://images.unsplash.com/photo-1682687220866-c856f566f1bd', name='Francisco Ayala'}: { imageUrl: string; name: string }) {
  return (
    <DropdownMenu>
      {/* Image-Name-IconButton Layout */}
      <div className="flex flex-row mb-2 px-8 mt-16">
        <Image src={imageUrl} alt={name} className="h-8 w-8 rounded-full self-center" width={200} height={200} />
        <span className="text-white font-normal self-center ml-4 mr-4 text-sm">{name}</span>
        <DropdownMenuTrigger asChild className='self-center ml-auto'>
          <Button variant="outline" className="p-1 bg-transparent border-none ring-0 ring-transparent ring-offset-transparent focus-visible:ring-0 focus-visible:ring-transparent outline-none hover:text-white focus:border-none hover:border-none hover:bg-transparent focus:border-none">
            <ChevronDown className="h-5 w-5 text-white" />
          </Button>
        </DropdownMenuTrigger>
      </div>

      {/* Dropdown Menu */}
      <DropdownMenuContent className="w-56 bg-dashboard border-2 border-divider">
        <DropdownMenuLabel className="text-white">Your Account</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-divider" />
        <DropdownMenuGroup>
          <DropdownMenuItem className="text-white">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="text-white">
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Billing</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="text-white">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="bg-divider" />
        <DropdownMenuItem className="bg-red-700 hover:bg-red-500 focus:bg-red-500 active:bg-red-500">
          <LogOut className="mr-2 h-4 w-4 text-white" />
          <span className="text-white">Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}