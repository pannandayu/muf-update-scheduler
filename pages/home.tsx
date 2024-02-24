import Router from "next/router";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

type AuthStatus = {
  message: string;
};

const Home: React.FC = () => {
  const authData = useSelector((state: any) => state.auth);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/monitor", {
          method: "GET",
          headers: { Authorization: "Bearer: " + authData.token },
        });

        if (response.status !== 200) {
          return Router.push("/");
        }
      } catch (err: any) {}
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Welcome {authData.username}</h1>
      <p>Reloading means login</p>
    </div>
  );
};

export default Home;
