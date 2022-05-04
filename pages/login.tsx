//% libs
import type {NextPage} from "next";
import Head from "next/head";
import Image from "next/image";
import {useRouter} from "next/router";

import React, {ReactEventHandler, useEffect, useState} from "react";

import {magic} from "../lib/magic-client";

//% utils
import {traceColourfulRedError} from "../utils";

//% styles
import styles from "../styles/Login.module.css";

//% types
import type {LoginApiResponseBodyT} from "./api/login";

const Login: NextPage = () => {
  const [email, setEmail] = useState("");
  const [userMsg, setUserMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  //%
  const router = useRouter();

  //%
  useEffect(() => {
    const handleComplete = () => {
      setIsLoading(false);
    };

    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  //%
  /**
   * @abstract Set the email in the component state
   * @param e_
   * @returns void
   */
  const handleOnChangeEmail: React.ChangeEventHandler<
    HTMLInputElement
  > = e_ => {
    setUserMsg("");
    const email = e_.target.value;
    setEmail(email);
  };
  /**
   * @abstract Logs the user in using via magic SDK
   * @description It uses a DID token behind the scenes, requires the user to check his/her email and click on the verification link, once that is done, the user is redirected to the '/' page.
   * @param e_
   */
  const handleLoginWithEmail: ReactEventHandler<
    HTMLButtonElement
  > = async e_ => {
    e_.preventDefault();

    if (email) {
      try {
        setIsLoading(true);

        const didToken = await magic!.auth.loginWithMagicLink({
          email,
        });

        if (didToken) {
          const response = await fetch("/api/login", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${didToken}`,
              "Content-Type": "application/json",
            },
          });

          const loggedInResponse =
            (await response.json()) as LoginApiResponseBodyT;

          if (loggedInResponse.done) {
            console.log({loggedInResponse});
            router.push("/");
          } else {
            setIsLoading(false);
            setUserMsg("Something went wrong logging in");
          }
        }
      } catch (error) {
        traceColourfulRedError(error, 3);
        setIsLoading(false);
      }
    } else {
      //show user message
      setIsLoading(false);
      setUserMsg("Enter a valid use email address");
    }
  };

  //%
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
            {isLoading ? "Loading..." : "Sign In"}
          </button>
        </div>
      </main>
    </div>
  );
};

export default Login;
