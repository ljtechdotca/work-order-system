import { Button } from "@components";
import styles from "@styles/Home.module.scss";
import { IOrder } from "@types";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import getConfig from "next/config";
import { useRouter } from "next/dist/client/router";
import React, { useState } from "react";

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.url}`;

type Params = {
  params: {
    id: string;
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  let ordersParams: Params[] = [];
  try {
    const response = await fetch(`${baseUrl}/api/orders`);
    const { data } = await response.json();
    ordersParams = data.orders.map((order: IOrder) => {
      return {
        params: {
          id: order.id,
        },
      };
    });
  } catch (error) {
    console.error(error);
  }
  return {
    paths: ordersParams,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  let order: IOrder | null = null;
  let orderId: string;
  const { params } = context;
  if (params) {
    orderId = params.id as string;
    try {
      const response = await fetch(`${baseUrl}/api/orders/${orderId}`);
      const { data } = await response.json();
      order = data.order;
    } catch (error) {
      console.error(error);
    }
  }
  if (!order) throw new Error("No Order Found");
  return {
    props: { order: order },
  };
};

interface HomeProps {
  order: IOrder;
}

const Home: NextPage<HomeProps> = ({ order }) => {
  const router = useRouter();
  const [alert, setAlert] = useState<string | null>(null);
  const [orderState, setOrderState] = useState<IOrder>(order);

  const handleDelete = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/orders/${orderState.id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        router.push("/");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let formData = null;
    if (event.target instanceof HTMLFormElement) {
      formData = Object.fromEntries(new FormData(event.target));
    }
    if (!formData) return setAlert("Bad Form Submission");
    try {
      const response = await fetch(`${baseUrl}/api/orders/${orderState.id}`, {
        method: "PUT",
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
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        {alert && <div className={styles.alert}>!{alert}!</div>}
        <div className={styles.item}>
          <div className={styles.flex}>
            <div className={styles.id}>#{orderState.id}</div>
            <div className={styles.name}>{orderState.user.name}</div>
          </div>
          <div className={styles.flex}>
            <h1>{orderState.title} </h1>
            <span className={styles[`tag__${orderState.tag}`]}>
              {orderState.tag}
            </span>
          </div>
          <p className={styles.description}>{orderState.description}</p>
        </div>
        <form onSubmit={handleUpdate}>
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
              onChange={(event) =>
                setOrderState((state) => ({
                  ...state,
                  description: event.target.value,
                }))
              }
              value={orderState.description}
              required
            />
          </fieldset>
          <div className={styles.flex}>
            <Button type="submit">Update</Button>
            <Button type="reset">Reset</Button>
            <Button onClick={handleDelete}>Delete</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Home;
