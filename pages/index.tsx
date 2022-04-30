//% libs
import type {NextPage} from "next";
import Head from "next/head";
import type {InferGetServerSidePropsType} from "next";

//% comps
import Banner from "../components/banner/banner";
import NavBar from "../components/nav/navbar";
import SectionCards from "../components/card/section-cards";

//% styles
import styles from "../styles/Home.module.css";

//% data
import {getVideos} from "../lib/videos";

export const getServerSideProps = async () => {
  const disneyVideos = await getVideos();

  return {
    props: {
      disneyVideos,
    },
  };
};

const Home: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = props => {
  const {disneyVideos} = props;

  return (
    <div className={styles.container}>
      <Head>
        <title>Netflix</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <NavBar username="ankita" />
        <Banner
          title="Clifford the red dog"
          subTitle="a very cute dog"
          imgUrl="/static/clifford.webp"
        />

        <div className={styles.sectionWrapper}>
          <SectionCards title="Disney" videos={disneyVideos} />
          <SectionCards title="Disney" videos={disneyVideos} size="medium" />
        </div>
      </main>
    </div>
  );
};

export default Home;
