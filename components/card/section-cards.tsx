//% libs
import {v4 as uuid} from "uuid";

//% comps
import Card from "./card";

//% styles
import styles from "./section-cards.module.css";

//? Intersect with a size type?
type SectionCardsPropsT = {
  title: string;
  //! Change type
  videos: unknown[];
  size: "small" | "large" | "medium";
};
const SectionCards = (_props: Partial<SectionCardsPropsT>) => {
  const {
    title: _title = "Default title",
    videos: _videos = [],
    size: _size = "large",
  } = _props;

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>{_title}</h2>
      <div className={styles.cardWrapper}>
        {_videos.map((_video, _idx) => {
          //! Change types
          return (
            <Card
              idx={_idx}
              imgUrl={(_video as any).imgUrl}
              size={_size}
              key={uuid()}
            />
          );
        })}
      </div>
    </section>
  );
};

export default SectionCards;
