//% libs
import type {NextPage} from "next";
import Head from "next/head";
import Image from "next/image";

//% styles
import styles from "../styles/Login.module.css";

const Login: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Netflix SignIn</title>
      </Head>

      <header>
        <div className={styles.headerWrapper}>
          <a className={styles.logoLink} href="/">
            <div className={styles.logoWrapper}>
              <Image
                src="/static/netflix.svg"
                alt="Netflix logo"
                width="128px"
                height="34px"
              />
            </div>
          </a>
        </div>
      </header>
    </div>
  );
};

export default Login;
