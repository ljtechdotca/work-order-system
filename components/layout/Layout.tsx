import { Footer, Header } from "@components";
import Head from "next/head";
import React from "react";
import styles from "./Layout.module.scss";

export interface LayoutProps {}

export const Layout = ({ children }: React.PropsWithChildren<LayoutProps>) => {
  return (
    <div className={styles.root}>
      <Head>
        <title>Work Order System</title>
        <meta name="description" content="Work Order System" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className={styles.container}>{children}</main>
      <Footer />
    </div>
  );
};
