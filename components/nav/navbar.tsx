//% libs
import {useRouter} from "next/router";
import Link from "next/link";

import {ReactEventHandler} from "react";

//% styles
import styles from "./navbar.module.css";

type NavBarPropsT = {
  username: string;
};
const NavBar = (props: Partial<NavBarPropsT>) => {
  const {username = "Username placeholder"} = props;

  const router = useRouter();

  const handleOnClickHome: ReactEventHandler<HTMLLIElement> = e => {
    e.preventDefault();
    router.push("/");
  };

  const handleOnClickMyList: ReactEventHandler<HTMLLIElement> = e => {
    e.preventDefault();
    router.push("/browse/my-list");
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <a className={styles.logoLink} href="/">
          <div className={styles.logoWrapper}>Netflix</div>
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
            <button className={styles.usernameBtn}>
              <p className={styles.username}>{username}</p>
              {/* Expand more icon */}
            </button>

            <div className={styles.navDropdown}>
              <div>
                <Link href="/login">
                  <a className={styles.linkName}>Sign out</a>
                </Link>
                <div className={styles.lineWrapper}></div>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default NavBar;
