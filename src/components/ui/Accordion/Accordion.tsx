import { FC, PropsWithChildren } from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ReactComponent as Arrow } from "./down.svg";
import styles from "./Accordion.module.scss";
import classNames from "classnames";

export const Trigger: FC<
  PropsWithChildren<AccordionPrimitive.AccordionTriggerProps>
> = ({ children, ...props }) => {
  return (
    <AccordionPrimitive.Header className={styles.header}>
      <AccordionPrimitive.Trigger {...props} className={styles.trigger}>
        <Arrow className={styles.arrow} />
        <div className="flex-1 text-left">{children}</div>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
};

export const Content: FC<
  PropsWithChildren<AccordionPrimitive.AccordionContentProps>
> = ({ children, ...props }) => {
  return (
    <AccordionPrimitive.Content className={styles.content} {...props}>
      <div className="p-4 pt-0">{children}</div>
    </AccordionPrimitive.Content>
  );
};

export interface ItemProps
  extends PropsWithChildren<AccordionPrimitive.AccordionItemProps> {
  className?: string;
}

export const Item: FC<ItemProps> = ({ className, children, ...props }) => {
  return (
    <AccordionPrimitive.Item
      className={classNames(styles.root, className)}
      {...props}
    >
      {children}
    </AccordionPrimitive.Item>
  );
};

const Root: FC<
  PropsWithChildren<
    | AccordionPrimitive.AccordionSingleProps
    | AccordionPrimitive.AccordionMultipleProps
  >
> = ({ children, ...props }) => {
  return (
    <AccordionPrimitive.Root {...props}>{children}</AccordionPrimitive.Root>
  );
};

export default { Root, Trigger, Item, Content };
