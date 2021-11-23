import styles from "@styles/Home.module.scss";
import { IOrder } from "@types";
import type { NextPage } from "next";
import getConfig from "next/config";
import Link from "next/link";

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.url}`;

export const getStaticProps = async () => {
  let orders: IOrder[] = [];
  try {
    const response = await fetch(`${baseUrl}/api/orders`);
    const { data } = await response.json();
    orders = data.orders;
  } catch (error) {
    console.error(error);
  }
  return {
    props: { orders: orders },
  };
};

interface HomeProps {
  orders: IOrder[];
}

const Home: NextPage<HomeProps> = ({ orders }) => {
  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <ul className={styles.list}>
          {orders.map((order) => (
            <li key={order.id} className={styles.item}>
              <div className={styles.flex}>
                <div className={styles.id}>#{order.id}</div>
                <div className={styles.name}>{order.user.name}</div>
              </div>
              <div className={styles.flex}>
                <Link href={`/edit/${order.id}`}>
                  <a className={styles.link}>
                    <h1>{order.title}</h1>
                  </a>
                </Link>
                <span className={styles[`tag__${order.tag}`]}>{order.tag}</span>
              </div>
              <p className={styles.description}>{order.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;
