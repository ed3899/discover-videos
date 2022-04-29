//% styles
import styles from "./banner.module.css";

type BannerPropsT = {
  title: string;
  subTitle: string;
  imgUrl: string;
};
const Banner = (_props: Partial<BannerPropsT>) => {
  const {
    title = "placeholder title",
    subTitle = "placeholder subTitle",
    imgUrl = "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png?v=1530129081",
  } = _props;

  const handleOnPlay = () => console.log("Handle on play");

  return (
    <div className={styles.container}>
      <div className={styles.leftWrapper}>
        <div className={styles.left}>
          <div className={styles.nseriesWrapper}>
            <p className={styles.firstLetter}>N</p>
            <p className={styles.series}>S E R I E S</p>
          </div>
          <h3 className={styles.title}>{title}</h3>
          <h3 className={styles.subTitle}>{subTitle}</h3>

          <div className={styles.playBtnWrapper}>
            <button className={styles.btnWithIcon} onClick={handleOnPlay}>
              <span className={styles.playText}>Play</span>
            </button>
          </div>
        </div>
      </div>

      <div
        className={styles.bannerImg}
        style={{
          backgroundImage: `url(${imgUrl})`,
        }}></div>
    </div>
  );
};

export default Banner;
