//% libs
import {v4 as uuid} from "uuid";
import cls from "classnames";

//% comps
import Card from "./card";

//% styles
import styles from "./section-cards.module.css";

//% types
import type {VideoT} from "../../types/youtube-api";

type SectionCardVideoT =
  | Omit<VideoT, "description" | "publishedAt" | "channelTitle" | "statistics">
  | {id: string; imgUrl: string};

//? Intersect with a size type?
type SectionCardsPropsT = {
  title: string;
  videos: SectionCardVideoT[];
  size: "small" | "large" | "medium";
  shouldWrap: boolean;
  shouldScale: boolean;
};
const SectionCards = function (_props: Partial<SectionCardsPropsT>) {
  const {
    title: _title = "Default title",
    videos: _videos = [],
    size: _size = "large",
    shouldWrap: shouldWrap_ = false,
    shouldScale: shouldScale_ = true,
  } = _props;

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>{_title}</h2>
      <div className={cls(styles.cardWrapper, shouldWrap_ && styles.wrap)}>
        {_videos.map((_video, _idx) => {
          //? Change key
          return (
            <Card
              idx={_idx}
              imgUrl={_video.imgUrl}
              size={_size}
              key={uuid()}
              videoId={_video.id}
              shouldScale={shouldScale_}
            />
          );
        })}
      </div>
    </section>
  );
};

export default SectionCards;
