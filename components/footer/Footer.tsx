import styles from "./Footer.module.scss";
export interface FooterProps {}

export const Footer = ({}: FooterProps) => {
  return (
    <footer className={styles.root}>
      <div className={styles.container}>Work Order System </div>
    </footer>
  );
};
