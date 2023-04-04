import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import { BsArrowReturnLeft } from "react-icons/bs";

export const NotFound = () => {
  const { pathname } = useLocation();
  return (
    <div>
      <h1>Page Not Found</h1>
      <p>There is no page with the url {pathname}, try something else.</p>
      <Link to="/">
        <BsArrowReturnLeft size={40}/>
      </Link>
    </div>
  );
};
