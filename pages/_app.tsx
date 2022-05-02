//%
import {useRouter} from "next/router";

import {useEffect} from "react";

import {magic} from "../lib/magic-client";

//% styles
import "../styles/globals.css";

//% types
import type {AppProps} from "next/app";

function MyApp({Component, pageProps}: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const redirect = async () => {
      const isLoggedIn = await magic!.user.isLoggedIn();

      if (isLoggedIn) {
        router.push("/");
      } else {
        router.push("/login");
      }
    };

    redirect();
  }, []);
  return <Component {...pageProps} />;
}

export default MyApp;
