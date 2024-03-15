import FoodDetailsPage from "@/components/templates/FoodDetailsPage";
import { useRouter } from "next/router";

const FoodDetails = ({ data }) => {
  const router = useRouter();

  if (router.isFallback) return <h2>Loading...</h2>;

  return (
    <>
      <FoodDetailsPage data={data} />
    </>
  );
};

const getStaticPaths = async () => {
  const res = await fetch("http://localhost:4000/data");
  const json = await res.json();

  const data = json.slice(0, 10);

  const paths = data.map((item) => ({
    params: { foodId: item.id.toString() },
  }));

  return {
    paths,
    fallback: true,
  };
};

const getStaticProps = async (context) => {
  const {
    params: { foodId },
  } = context;

  const res = await fetch(`http://localhost:4000/data/${foodId}`);
  const data = await res.json();

  if (!data.id) {
    return {
      notFound: true,
    };
  }

  return {
    props: { data },
    revalidate: 1 * 60 * 60, //1 hour
  };
};

export default FoodDetails;
export { getStaticProps, getStaticPaths };
