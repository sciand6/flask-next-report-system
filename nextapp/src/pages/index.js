import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useEffect, useState } from 'react'
import ReportTable from '@/components/ReportTable'
import Select from '@/components/Select'

export default function Home() {
  const [report, setreport] = useState({})
  const [baseUrl, setbaseUrl] = useState(
    process.env.NODE_ENV === 'production'
      ? 'http://34.86.206.228:8080/api'
      : 'http://localhost:8000',
  )
  const gameOptions = Array.from({ length: 10 }, (_, i) => (
    <option key={i + 1} value={i + 1}>
      Last {i + 1}
    </option>
  ))
  const [lastNGames, setlastNGames] = useState('')

  const fetchData = () => {
    fetch(`${baseUrl}/data?lastNGames=${lastNGames}`, {
      method: 'GET',
      mode: 'cors',
    })
      .then((res) => res.json())
      .then((data) => setreport(data))
      .catch((err) => console.log(err))
  }

  useEffect(fetchData, [lastNGames])

  return (
    <>
      <Head>
        <title>Reports</title>
        <meta name="description" content="Reports" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h2 className={styles.header}>NBA Team Report</h2>
        <Select
          id="games"
          label="Games"
          options={gameOptions}
          onChange={(e) => setlastNGames(e.target.value)}
        />
        {report.data ? <ReportTable report={report} /> : 'No data'}
      </main>
    </>
  )
}
