'use client';

import { useUser, SignIn, SignOutButton } from '@clerk/nextjs';

export default function Home() {
  const { isSignedIn, user } = useUser(); // Access user data with useUser

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {isSignedIn ? (
        <>
          <h1>Welcome , {user?.firstName}</h1>
          <SignOutButton />
        </>
      ) : (
        <SignIn />
      )}
    </div>
  );
}
