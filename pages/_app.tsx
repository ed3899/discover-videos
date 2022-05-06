//% libs
import {useRouter} from "next/router";

import {useEffect, useState} from "react";

import {magic} from "../lib/magic-client";

//% comps
import Loading from "../components/loading/loading";

//% styles
import "../styles/globals.css";

//% types
import type {AppProps} from "next/app";

function MyApp({Component, pageProps}: AppProps) {
  //%
  const [isLoading, setIsLoading] = useState(false);
  //%
  const router = useRouter();

  // useEffect(() => {
  //   const redirect = async () => {
  //     const isLoggedIn = await magic!.user.isLoggedIn();

  //     if (isLoggedIn) {
  //       router.push("/");
  //     } else {
  //       router.push("/login");
  //     }
  //   };

  //   redirect();
  // }, []);

  useEffect(() => {
    const handleComplete = () => {
      console.log("handle Complete route change");
      setIsLoading(false);
    };

    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  return isLoading ? <Loading /> : <Component {...pageProps} />;
}

export default MyApp;
