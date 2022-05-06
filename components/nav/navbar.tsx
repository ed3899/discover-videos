//% libs
import {useRouter} from "next/router";
import Link from "next/link";
import Image from "next/image";

import {useEffect, useState} from "react";
import type {ReactEventHandler} from "react";

import {magic} from "../../lib/magic-client";

//% utils
import {traceColourfulRedError} from "../../utils";

//% styles
import styles from "./navbar.module.css";

const NavBar = () => {
  //%
  const [showDropdown, setShowDropdown] = useState(false);
  const [username, setUsername] = useState("");
  const [didToken, setDidToken] = useState("");

  //%
  const router = useRouter();

  //%
  useEffect(() => {
    /**
     * @abstract Gets the user and didToken from Magic
     */
    const getUser = async () => {
      try {
        const {email} = await magic!.user.getMetadata();
        const didToken = await magic!.user.getIdToken();

        if (email) {
          setUsername(email);
          setDidToken(didToken);
        }
      } catch (error) {
        console.error(error);
      }
    };

    getUser();
  }, []);

  //%
  /**
   * @abstract Routes to "/"
   * @param e_
   */
  const handleOnClickHome: ReactEventHandler<HTMLLIElement> = e_ => {
    e_.preventDefault();
    router.push("/");
  };
  /**
   * @abstract Routes to "/browse/my-list"
   * @param e_
   */
  const handleOnClickMyList: ReactEventHandler<HTMLLIElement> = e_ => {
    e_.preventDefault();
    router.push("/browse/my-list");
  };
  /**
   * @abstract Toggles the dropdown state of "Sign Out"
   * @param e_
   */
  const handleShowDropdown: ReactEventHandler<HTMLButtonElement> = e_ => {
    e_.preventDefault();
    setShowDropdown(!showDropdown);
  };
  /**
   * @abstract Signs the user out using a magicSDK method on the client
   */
  const handleSignOut: ReactEventHandler<HTMLAnchorElement> = async () => {
    try {
      await magic!.user.logout();
      const response = await fetch("/api/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${didToken}`,
          "Content-Type": "application/json",
        },
      });

      await response.json();
    } catch (error) {
      traceColourfulRedError(error, 3);
      router.push("/login");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
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
        <ul className={styles.navItems}>
          <li className={styles.navItem} onClick={handleOnClickHome}>
            Home
          </li>
          <li className={styles.navItem2} onClick={handleOnClickMyList}>
            My List
          </li>
        </ul>

        <nav className={styles.navContainer}>
          <div>
            <button className={styles.usernameBtn} onClick={handleShowDropdown}>
              <p className={styles.username}>{username}</p>
              {/* Expand more icon */}
              <Image
                src="/static/expand_more.svg"
                alt="Expand dropdown"
                width="24px"
                height="24px"
              />
            </button>

            {showDropdown && (
              <div className={styles.navDropdown}>
                <div>
                  <Link href="/login" passHref>
                    <a className={styles.linkName} onClick={handleSignOut}>
                      Sign out
                    </a>
                  </Link>
                  <div className={styles.lineWrapper}></div>
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default NavBar;
