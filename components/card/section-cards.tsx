//% comps
import Card from "./card";

//% styles
import styles from "./section-cards.module.css";

type SectionCardsPropsT = {
  title: string;
};
const SectionCards = (props: Partial<SectionCardsPropsT>) => {
  const {title = "Default title"} = props;

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.cardWrapper}>
        <Card imgUrl="/static/clifford.webp" size="large" />
        <Card imgUrl="/static/clifford.webp" size="large" />
        <Card imgUrl="/static/clifford.webp" size="large" />
        <Card imgUrl="/static/clifford.webp" size="large" />
        <Card imgUrl="/static/clifford.webp" size="large" />
        <Card imgUrl="/static/clifford.webp" size="large" />
        <Card imgUrl="/static/clifford.webp" size="large" />
        <Card imgUrl="/static/clifford.webp" size="large" />
        <Card imgUrl="/static/clifford.webp" size="large" />
        <Card imgUrl="/static/clifford.webp" size="large" />
      </div>
    </section>
  );
};

export default SectionCards;
