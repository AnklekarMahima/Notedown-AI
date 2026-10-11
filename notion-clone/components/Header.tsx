"use client";
import { useUser, SignedOut, SignedIn, SignInButton, UserButton } from "@clerk/nextjs";
import Breadcrumbs from "./Breadcrumbs";

function Header() {
  const { user } = useUser();

  return (
    <div className="flex items-center justify-between p-5">
      {user && (
        <h1 className="text-2xl">
          {user?.firstName}&apos;s space
        </h1>
      )}

      {/* Breadcrumbs (directory)*/}
      <Breadcrumbs/>
      <div>
        <SignedOut>
          <SignInButton/>
        </SignedOut>

        <SignedIn>
          <UserButton/>
        </SignedIn>

      </div>
    </div>
  );
}
export default Header;
