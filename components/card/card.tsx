//% libs
import Image from "next/image";
import {useRouter} from "next/router";

import {forwardRef} from "react";

import {motion} from "framer-motion";

import cls from "classnames";

import {defaultImg} from "../../utils";

//% styles
import styles from "./card.module.css";

type CardPropsT = {
  imgUrl: string;
  size: "large" | "small" | "medium";
  idx: number;
  videoId: string;
};
const Card = (props: Partial<CardPropsT>) => {
  const {imgUrl = defaultImg(), size = "medium", idx, videoId} = props;

  //%
  const router = useRouter();

  //%
  const handleRouting = (videoId_: string) => {
    router.push(`/video/${videoId_}`);
  };

  const classMap: Record<CardPropsT["size"], string> = {
    large: styles.lgItem,
    medium: styles.mdItem,
    small: styles.smItem,
  };

  return (
    <div className={styles.container}>
      <motion.div
        className={cls(styles.imgMotionWrapper, classMap[size])}
        whileHover={idx === 0 ? {scaleY: 1.1} : {scale: 1.1}}>
        <Image
          src={imgUrl}
          alt="unknown"
          layout="fill"
          className={styles.cardImg}
          onClick={() => handleRouting(videoId!)}
        />
      </motion.div>
    </div>
  );
};

export default Card;
