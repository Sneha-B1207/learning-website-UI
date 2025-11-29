import { useEffect } from "react";
import { useRouter } from "next/router";

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedIn");
    if (loggedIn) {
      router.replace("/accounts");
    } else {
      router.replace("/login");
    }
  }, [router]);

  return null; // empty while redirecting
};

export default Home;
