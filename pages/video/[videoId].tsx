//% libs
import {useRouter} from "next/router";

import Modal from "react-modal";

//% styles
import styles from "../../styles/Video.module.css";

//% types
import type {NextPage} from "next";

Modal.setAppElement("#__next");

const Video: NextPage = () => {
  const router = useRouter();
  return (
    <div className={styles.container}>
      <Modal
        isOpen={true}
        contentLabel="Example Modal"
        onRequestClose={() => router.back()}
        className={styles.modal}
        overlayClassName={styles.overlay}>
        <div>
          <iframe
            id="ytplayer"
            className={styles.videoPlayer}
            typeof="text/html"
            frameBorder="0"
            width="100%"
            height="360"
            src={`https://www.youtube.com/embed/${router.query.videoId}?autoplay=0&origin=http://example.com&controls=0&rel=0`}></iframe>
        </div>
      </Modal>
    </div>
  );
};

export default Video;
