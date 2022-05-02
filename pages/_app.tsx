//%
import {useRouter} from "next/router";

import {useEffect, useState} from "react";

import {magic} from "../lib/magic-client";

//% styles
import "../styles/globals.css";

//% types
import type {AppProps} from "next/app";

function MyApp({Component, pageProps}: AppProps) {
  //%
  const [isLoading, setIsLoading] = useState(true);
  //%
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

  useEffect(() => {
    const handleComplete = () => {
      setIsLoading(false);
    };

    router.events.on("routeChangeComplete", handleComplete);

    return () => {
      router.events.off("routeChangeComplete", handleComplete);
    };
  });

  return isLoading ? <div>Loading...</div> : <Component {...pageProps} />;
}

export default MyApp;
