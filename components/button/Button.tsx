import React from "react";
import styles from "./Button.module.scss";

export interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  type?: "button" | "submit" | "reset";
}

export const Button = ({
  children,
  type = "button",
  ...attributes
}: React.PropsWithChildren<ButtonProps>) => {
  return (
    <div className={styles.root}>
      <button className={styles.container} {...attributes} type={type}>
        {children}
      </button>
    </div>
  );
};
