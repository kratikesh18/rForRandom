"use client";
import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";

const Navbar = () => {
  const { data: session } = useSession();
  const user: User = session?.user as User;

  return (
    <nav className=" p-4 md:p-6 shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <a href="#" className="text-xl font-bold mb-4 md:mb-0">
          rForRandom
        </a>
        {session ? (
          <>
            <span className="mr-4">Hey! {user?.username || user?.email}</span>
            <Button className="w-full md:w-auto" onClick={() => signOut()}>
              LogOut
            </Button>
          </>
        ) : (
          <Link href={`/sign-in`} className="w-full md:w-auto">
            <Button>LogIn</Button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
