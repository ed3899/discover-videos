//% libs
import {useRouter} from "next/router";

import {useState, useEffect} from "react";
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
import type {StatsApiResponseBodyT} from "../api/stats";
import type {VideoStatsT} from "../../types";

// Attaches the modal to the app for SEO purposes
Modal.setAppElement("#__next");

/**
 * @abstract Gets the static props on the server
 * @param context_
 * @returns
 */
export const getStaticProps = async (context_: GetStaticPropsContext) => {
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
  const videoId = router.query.videoId ?? "";

  //%
  /**
   * @abstract An utility function for getting like info on a video id
   * @async
   * @internal
   * @param videoId_
   * @returns
   */
  const _getLikeInfo = async (videoId_: string) => {
    const params = new URLSearchParams();
    params.append("videoId", videoId_);

    const url_ = `/api/stats?${params.toString()}`;

    const response_ = await fetch(url_, {
      method: "GET",
    });

    const data_ = (await response_.json()) as StatsApiResponseBodyT;
    const videoStats_ = data_.response as VideoStatsT[];

    //? What if no video

    if (videoStats_.length > 0) {
      console.log({videoStats_});
      const favourited_ = videoStats_[0].favourited;

      favourited_ === 1 ? setToggleLike(true) : setToggleDisLike(true);
    }
  };

  /**
   * @abstract An utility function for running the rating service on Hasura
   * @internal
   * @param favourited_
   * @returns
   */
  const _runRatingService = async (favourited_: number, videoId_: string) => {
    const params = new URLSearchParams();
    params.append("videoId", videoId_);

    const url = `/api/stats?${params.toString()}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        videoId: videoId,
        favourited: favourited_,
      }),
    });

    return response;
  };

  //%
  const [toggleLike, setToggleLike] = useState(false);
  const [toggleDisLike, setToggleDisLike] = useState(false);

  //%
  useEffect(() => {
    _getLikeInfo(videoId as string);
  }, []);

  //%
  /**
   * @abstract Toggles dislike button
   */
  const handleToggleDislike = async () => {
    // This logic won't allow for undefined like
    const val = !toggleDisLike;
    setToggleDisLike(val);
    setToggleLike(toggleDisLike);

    await _runRatingService(val ? 0 : 1, videoId as string);
  };

  /**
   * @abstract Toggles like button
   */
  const handleToggleLike = async () => {
    // This logic won't allow for undefined like
    const val = !toggleLike;
    setToggleLike(val);
    setToggleDisLike(toggleLike);

    await _runRatingService(val ? 1 : 0, videoId as string);
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
          src={`https://www.youtube.com/embed/${videoId}?autoplay=0&origin=http://example.com&controls=0&rel=0`}></iframe>

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
