import Link from 'next/link';
import styles from './page.module.scss'

export default function Home() {
  return (
    <main className={styles.main}>
      <h1>Top Page</h1>
      <Link href={'/chess'}>Chess</Link>
    </main>
  )
}
