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
    <div>
      <h3>{title}</h3>
      <h3>{subTitle}</h3>
      <button onClick={handleOnPlay}>Play</button>
      <div
        style={{
          backgroundImage: `url(${imgUrl})`,
          width: "100%",
          height: "100%",
          position: "absolute",
          backgroundSize: "cover",
          backgroundPosition: "50% 50%",
        }}></div>
    </div>
  );
};

export default Banner;
