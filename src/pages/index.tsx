import { GetServerSideProps, NextPage } from "next";
import { useState } from "react";
import styles from "../styles/index.module.css";

type Props = {
  initialImageUrl: string;
};
// ページコンポーネント関数にpropsを受け取る引数を追加する
const IndexPage: NextPage<Props> = ({ initialImageUrl }) => {
  const [imageUrl, setImageUrl] = useState(initialImageUrl); // 初期値を渡す
  const [loading, setLoading] = useState(true); // 初期状態はfalseにしておく

  // useEffect(() => {
  //   fetchImage().then((newImage) => {
  //     setImageUrl(newImage.url);
  //     setLoading(false);
  //   });
  // }, []);

  const handleClick = async () => {
    setLoading(true);
    const newImage = await fetchImage();
    setImageUrl(newImage.url);
    setLoading(false);
  };

  return (
    <div className={styles.page}>
      <button onClick={handleClick} className={styles.button}>
        他のにゃんこも見る
      </button>
      <div className={styles.frame}>{loading || <img src={imageUrl} className={styles.img} />}</div>
    </div>
  );
};
export default IndexPage;

// サーバーサイドで実行する処理
export const getServerSideProps: GetServerSideProps<Props> = async () => {
  let initialImageUrl: string = "";
  try {
    const image = await fetchImage();
    initialImageUrl = image.url;
  } catch (error) {
    console.error("Error fetching initial image: ", error);
  }
  return {
    props: {
      initialImageUrl,
    },
  };
};

type Image = {
  url: string;
};
const fetchImage = async (): Promise<Image> => {
  const res = await fetch("https://api.thecatapi.com/v1/images/search");
  if (!res.ok) {
    throw new Error(`Fetch failed with status: ${res.status}`);
  }
  const images = await res.json();
  return images[0];
};
