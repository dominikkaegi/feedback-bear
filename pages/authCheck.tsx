import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/client";
import { Button } from "@chakra-ui/react";

export default function Home() {
  const [session, loading] = useSession();

  if (loading) {
    return <h1>Loading....</h1>;
  }

  if (session) {
    return (
      <div>
        <h1>Hello, {session.user?.name}</h1>
        <Button onClick={() => signOut()}>Signout</Button>
      </div>
    );
  } else {
    return (
      <div>
        <h1>You are not logged in.</h1>
        <Button onClick={() => signIn()}>SignIn</Button>
      </div>
    );
  }
}
