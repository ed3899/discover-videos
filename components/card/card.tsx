//% libs
import Image from "next/image";

import {defaultImg} from "../../utils";

//% styles
import styles from "./card.module.css";

type CardPropsT = {
  imgUrl: string;
  size: "large" | "small" | "medium";
};
const Card = (props: Partial<CardPropsT>) => {
  const {imgUrl = defaultImg(), size = "medium"} = props;

  const classMap: Record<CardPropsT["size"], string> = {
    large: styles.lgItem,
    medium: styles.mdItem,
    small: styles.smItem,
  };

  return (
    <div className={styles.container}>
      Card
      <div className={classMap[size]}>
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
