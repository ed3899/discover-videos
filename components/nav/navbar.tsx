type NavBarPropsT = {
  username: string;
};
const NavBar = (props: Partial<NavBarPropsT>) => {
  const {username = "Username placeholder"} = props;

  return (
    <div>
      Nav Bar
      <p>{username}</p>
      <ul>
        <li>Home</li>
        <li>My List</li>
      </ul>
      <nav>
        <div>
          <button>
            <p>{username}</p>
          </button>

          <div>
            <a>Sign out</a>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
