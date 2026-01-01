import styles from '@/app/page.module.scss'
import ChessPiece from '@/components/chess/ChessPiece/ChessPiece'
export default function Home() {
  return (
    <main className={styles.main}>
      <ChessPiece />
    </main>
  )
}
