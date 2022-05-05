//% comps
import Head from "next/head";

import NavBar from "../../components/nav/navbar";
import SectionCards from "../../components/card/section-cards";

//% type
import type {NextPage} from "next";

type MyListPropsT<T> = {
  prop1: T;
};

const MyList: NextPage = () => {
  return (
    <div>
      <Head>
        <title>My List</title>
      </Head>

      <main>
        <NavBar />
        <div>
          <SectionCards title="My List" videos={[]} size="small" />
        </div>
      </main>
    </div>
  );
};

export default MyList;
