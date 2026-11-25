import BannerSection from "../components/home-components/BannerSection";
import MostsaleProduct from "../components/home-components/MostsaleProduct";
import LatestProduct from "../components/home-components/LatestProduct";

export default function Home() {
  return (
    <>
      <BannerSection />
      <MostsaleProduct />
      <LatestProduct />
    </>
  );
}
