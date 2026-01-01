import styles from '@/app/page.module.scss'
import Referee from '@/components/chess/Piece/Piece'
export default function Home() {
  return (
    <main className={styles.main}>
      <Referee />
    </main>
  )
}
