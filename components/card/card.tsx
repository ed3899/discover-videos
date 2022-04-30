//% libs
import Image from "next/image";

import {placeholderImg} from "../../utils";

type CardPropsT = {
  imgUrl: string;
  size: "large" | "small" | "medium";
};
const Card = (props: Partial<CardPropsT>) => {
  const {imgUrl = placeholderImg(), size} = props;
  return (
    <div>
      Card
      <Image src={imgUrl} alt="unknown" width="300px" height="300px" />
    </div>
  );
};

export default Card;
