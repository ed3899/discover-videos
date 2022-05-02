//% libs
import {useRouter} from "next/router";

import Modal from "react-modal";

import cls from "classnames";

//% styles
import styles from "../../styles/Video.module.css";

//% types
import type {NextPage} from "next";

Modal.setAppElement("#__next");

const Video: NextPage = () => {
  const router = useRouter();

  const video = {
    title: "Some title",
    publishTime: "Some publish time",
    description: "Some massive description",
    channelTitle: "Some channel",
    viewCount: 10000,
  };

  const {title, publishTime, description, channelTitle, viewCount} = video;
  return (
    <div className={styles.container}>
      <Modal
        isOpen={true}
        contentLabel="Example Modal"
        onRequestClose={() => router.back()}
        className={styles.modal}
        overlayClassName={styles.overlay}>
        <iframe
          id="ytplayer"
          className={styles.videoPlayer}
          typeof="text/html"
          frameBorder="0"
          width="100%"
          height="360"
          src={`https://www.youtube.com/embed/${router.query.videoId}?autoplay=0&origin=http://example.com&controls=0&rel=0`}></iframe>

        <div className={styles.modalBody}>
          <div className={styles.modalBodyContent}>
            <div className={styles.col1}>
              <p className={styles.publishTime}>{publishTime}</p>
              <p className={styles.title}>{title}</p>
              <p className={styles.description}>{description}</p>
            </div>

            <div className={styles.col2}>
              <p className={cls(styles.subText, styles.subTextWrapper)}>
                <span className={styles.textColor}>Cast: </span>
                <span className={styles.channelTitle}>{channelTitle}</span>
              </p>
              <p className={cls(styles.subText, styles.subTextWrapper)}>
                <span className={styles.textColor}>View Count: </span>
                <span className={styles.channelTitle}>{viewCount}</span>
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Video;
