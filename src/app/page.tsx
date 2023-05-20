import styles from './page.module.scss'
import Referee from '@/components/Referee/referee';

export default function Home() {
  return (
    <main className={styles.main}>
      <Referee />
    </main>
  )
}
