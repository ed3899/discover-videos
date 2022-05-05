//% libs
import {getMyListVideosWrapper} from "../../lib/videos";

//% comps
import Head from "next/head";

import NavBar from "../../components/nav/navbar";
import SectionCards from "../../components/card/section-cards";

//% utils
import {useRedirectUser} from "../../utils";

//% styles
import styles from "../../styles/MyList.module.css";

//% type
import type {
  NextPage,
  GetServerSidePropsResult,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";

type MyListDataT = {
  videos: {
    id: string;
    imgUrl: string;
  }[];
};

export const getServerSideProps = async (
  context_: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<MyListDataT>> => {
  const {userId: userId_, token: token_} = useRedirectUser(context_);

  if (!userId_ || !token_) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const myListVideos_ = await getMyListVideosWrapper(userId_, token_);

  return {
    props: {
      videos: myListVideos_,
    },
  };
};

const MyList: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = props => {
  const {videos} = props;
  return (
    <div>
      <Head>
        <title>My List</title>
      </Head>

      <main className={styles.main}>
        <NavBar />
        <div className={styles.sectionWrapper}>
          <SectionCards title="My List" videos={videos} size="small" />
        </div>
      </main>
    </div>
  );
};

export default MyList;
