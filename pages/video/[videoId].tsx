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
        <div>Modal body</div>
      </Modal>
    </div>
  );
};

export default Video;
