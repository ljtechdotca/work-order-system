import { Button } from "@components";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import styles from "./Header.module.scss";
export interface HeaderProps {}

export const Header = ({}: HeaderProps) => {
  const { data: session, status: loading } = useSession();

  return (
    <header className={styles.root}>
      <div className={styles.container}>
        <nav>
          <Link href="/">
            <a className={styles.link}>Home</a>
          </Link>
          <Link href="/create">
            <a className={styles.link}>Create</a>
          </Link>
        </nav>
        {loading !== "loading" && session ? (
          <Button onClick={() => signOut()}>Sign Out</Button>
        ) : (
          <Button onClick={() => signIn()}>Sign In</Button>
        )}
      </div>
    </header>
  );
};
