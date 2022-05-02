//% libs
import {useRouter} from "next/router";
import Link from "next/link";
import Image from "next/image";

import {useEffect, useState} from "react";
import type {ReactEventHandler} from "react";

import {magic} from "../../lib/magic-client";

import {weAreOnBrowser} from "../../utils";

//% styles
import styles from "./navbar.module.css";

type NavBarPropsT = {
  username: string;
};
const NavBar = () => {
  //%
  const [showDropdown, setShowDropdown] = useState(false);
  const [username, setUsername] = useState("");

  //%
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      try {
        const {email} = await magic!.user.getMetadata();

        if (email) setUsername(email);
      } catch (error) {
        console.error(error);
      }
    };

    getUser();
  }, []);

  //%
  const handleOnClickHome: ReactEventHandler<HTMLLIElement> = e => {
    e.preventDefault();
    router.push("/");
  };
  const handleOnClickMyList: ReactEventHandler<HTMLLIElement> = e => {
    e.preventDefault();
    router.push("/browse/my-list");
  };
  const handleShowDropdown: ReactEventHandler<HTMLButtonElement> = e => {
    e.preventDefault();
    setShowDropdown(!showDropdown);
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
                  <Link href="/login">
                    <a className={styles.linkName}>Sign out</a>
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
