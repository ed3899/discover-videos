//% libs
import {v4 as uuid} from "uuid";

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
          //? Change key
          return (
            <Card
              idx={_idx}
              imgUrl={_video.imgUrl}
              size={_size}
              key={uuid()}
              videoId={_video.id}
            />
          );
        })}
      </div>
    </section>
  );
};

export default SectionCards;
