import Piece from '@/components/chess/Piece/Piece'
import styles from '@/app/page.module.scss'
export default function Home() {
  return (
    <main className={styles.main}>
      <Piece />
    </main>
  )
}
