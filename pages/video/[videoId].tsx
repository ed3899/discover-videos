//% libs
import {useRouter} from "next/router";

import {useState} from "react";
import Modal from "react-modal";

import cls from "classnames";

import {getYouTubeVideosById} from "../../lib/videos";

//% comps
import NavBar from "../../components/nav/navbar";
import Like from "../../components/icons/like-icon";
import DisLike from "../../components/icons/dislike-icon";

//% styles
import styles from "../../styles/Video.module.css";

//% types
import type {
  InferGetStaticPropsType,
  NextPage,
  GetStaticPaths,
  GetStaticPropsContext,
} from "next";
import type {VideoT} from "../../types/youtube-api";

// Attaches the modal to the app for SEO purposes
Modal.setAppElement("#__next");

/**
 * @abstract Gets the static props on the server
 * @param context_
 * @returns
 */
export const getStaticProps = async (context_: GetStaticPropsContext) => {
  //   const video = {
  //     title: "Some title",
  //     publishTime: "Some publish time",
  //     description: "Some massive description",
  //     channelTitle: "Some channel",
  //     viewCount: 10000, "F4Z0GHWHe60"
  //   };

  const videoId = context_.params!.videoId as string;

  const videoArray = await getYouTubeVideosById(videoId);

  return {
    props: {
      video: videoArray.length > 0 ? videoArray[0] : {},
    },
    revalidate: 10,
  };
};

/**
 * @abstract Gets the static paths on the server
 * @returns
 */
export const getStaticPaths: GetStaticPaths = async () => {
  const listOfVideos = ["F4Z0GHWHe60", "4zH5iYM4wJo", "KCPEHsAViiQ"];

  const paths = listOfVideos.map(videoId => ({
    params: {
      videoId,
    },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

const Video: NextPage<
  InferGetStaticPropsType<typeof getStaticProps>
> = props => {
  const {
    title: title_ = "No title",
    publishedAt: publishedAt_ = "No publish date",
    description: description_ = "No description",
    channelTitle: channelTitle_ = "No channel title",
    statistics: statistics_ = "No statistics",
  } = props.video as VideoT;

  const safeGuardedStatistics_ =
    typeof statistics_ === "string" ? statistics_ : statistics_.viewCount;

  //%
  const router = useRouter();

  //%
  const [toggleLike, setToggleLike] = useState(false);
  const [toggleDisLike, setToggleDisLike] = useState(false);

  //%
  /**
   * @abstract Toggles dislike button
   */
  const handleToggleDislike = () => {
    // This logic won't allow for undefined like
    setToggleDisLike(!toggleDisLike);
    setToggleLike(toggleDisLike);
  };

  /**
   * @abstract Toggles like button
   */
  const handleToggleLike = () => {
    // This logic won't allow for undefined like
    setToggleLike(!toggleLike);
    setToggleDisLike(toggleLike);
  };

  return (
    <div className={styles.container}>
      <NavBar />
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

        <div className={styles.likeDislikeBtnWrapper}>
          <div className={styles.likeBtnWrapper}>
            <button onClick={handleToggleLike}>
              <div className={styles.btnWrapper}>
                <Like selected={toggleLike} />
              </div>
            </button>
          </div>

          <button onClick={handleToggleDislike}>
            <div className={styles.btnWrapper}>
              <DisLike selected={toggleDisLike} />
            </div>
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.modalBodyContent}>
            <div className={styles.col1}>
              <p className={styles.publishTime}>{publishedAt_}</p>
              <p className={styles.title}>{title_}</p>
              <p className={styles.description}>{description_}</p>
            </div>

            <div className={styles.col2}>
              <p className={cls(styles.subText, styles.subTextWrapper)}>
                <span className={styles.textColor}>Cast: </span>
                <span className={styles.channelTitle}>{channelTitle_}</span>
              </p>
              <p className={cls(styles.subText, styles.subTextWrapper)}>
                <span className={styles.textColor}>View Count: </span>
                <span className={styles.channelTitle}>
                  {safeGuardedStatistics_}
                </span>
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Video;
