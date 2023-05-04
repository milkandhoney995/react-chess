import styles from './page.module.scss'
import Chessboard from '../components/Chessboard/Chessboard';

export default function Home() {
  return (
    <main className={styles.main}>
      <Chessboard />
    </main>
  )
}
