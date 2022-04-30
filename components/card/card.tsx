//% libs
import Image from "next/image";

import {placeholderImg} from "../../utils";

//% styles
import styles from "./card.module.css";

type CardPropsT = {
  imgUrl: string;
  size: "large" | "small" | "medium";
};
const Card = (props: Partial<CardPropsT>) => {
  const {imgUrl = placeholderImg(), size} = props;

  const classMap: Record<CardPropsT["size"], string> = {
    large: styles.lgItem,
    medium: styles.mdItem,
    small: styles.smItem,
  };

  return (
    <div className={styles.container}>
      Card
      <div className={size ? classMap[size] : classMap["small"]}>
        <Image
          src={imgUrl}
          alt="unknown"
          layout="fill"
          className={styles.cardImg}
        />
      </div>
    </div>
  );
};

export default Card;
