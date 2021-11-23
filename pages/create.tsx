import { Button } from "@components";
import styles from "@styles/Home.module.scss";
import { IOrder } from "@types";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import getConfig from "next/config";
import { useRouter } from "next/dist/client/router";
import React, { useState } from "react";

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.url}`;

export const getStaticProps = async () => {
  let orders: IOrder[] = [];
  try {
    const response = await fetch(`${baseUrl}/api/orders`);
    const { data } = await response.json();
    orders = data;
  } catch (error) {
    console.error(error);
  }
  return {
    props: orders,
  };
};

const Create: NextPage = () => {
  const router = useRouter();
  const [alert, setAlert] = useState<string | null>(null);
  const [range, setRange] = useState<number>(0);
  const { data: session, status: loading } = useSession();

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let formData = null;
    if (event.target instanceof HTMLFormElement) {
      formData = Object.fromEntries(new FormData(event.target));
    }
    if (!session || !formData) return setAlert("Bad Form Submission");
    formData.userId = session.user.id;
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        router.push("/");
      }
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        setAlert(error.message);
      }
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        {alert && <div className={styles.alert}>!{alert}!</div>}
        <form onSubmit={handleCreate}>
          <fieldset>
            <label htmlFor="title">Title</label>
            <input name="title" id="title" type="text" required />
          </fieldset>
          <div className={styles.flex}>
            <fieldset>
              <label htmlFor="low">Low</label>
              <input name="tag" id="low" type="radio" value="Low" required />
            </fieldset>
            <fieldset>
              <label htmlFor="normal">Normal</label>
              <input
                name="tag"
                id="normal"
                type="radio"
                value="Normal"
                required
              />
            </fieldset>
            <fieldset>
              <label htmlFor="emergency">Emergency</label>
              <input
                name="tag"
                id="emergency"
                type="radio"
                value="Emergency"
                required
              />
            </fieldset>
          </div>
          <fieldset>
            <label htmlFor="emergency">Description</label>
            <textarea
              name="description"
              id="description"
              cols={30}
              rows={10}
              required
            />
          </fieldset>
          <div className={styles.flex}>
            <Button type="submit">Create</Button>
            <Button type="reset">Reset</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Create;
