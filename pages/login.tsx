//% libs
import type {NextPage} from "next";
import Head from "next/head";
import Image from "next/image";
import {useRouter} from "next/router";

import React, {ReactEventHandler, useState} from "react";

//% styles
import styles from "../styles/Login.module.css";

const Login: NextPage = () => {
  const [email, setEmail] = useState("");
  const [userMsg, setUserMsg] = useState("");

  const router = useRouter()

  const handleOnChangeEmail: React.ChangeEventHandler<
    HTMLInputElement
  > = e_ => {
    setUserMsg("");
    const email = e_.target.value;
    setEmail(email);
  };
  const handleLoginWithEmail: ReactEventHandler<HTMLButtonElement> = e_ => {
    e_.preventDefault();

    if (email) {
      if (email === "email") {
        router.push("/")
      } else {
        setUserMsg("Something went wrong loggin in");
      }
    } else {
      //show use message
      setUserMsg("Enter a valid use email address");
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Netflix SignIn</title>
      </Head>

      <header className={styles.header}>
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

      <main className={styles.main}>
        <div className={styles.mainWrapper}>
          <h1 className={styles.signinHeader}>Sign In</h1>

          <input
            type="email"
            placeholder="Email address"
            className={styles.emailInput}
            onChange={handleOnChangeEmail}
          />

          <p className={styles.userMsg}>{userMsg}</p>

          <button onClick={handleLoginWithEmail} className={styles.loginBtn}>
            Sign In
          </button>
        </div>
      </main>
    </div>
  );
};

export default Login;
