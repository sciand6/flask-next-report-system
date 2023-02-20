import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useEffect, useState } from 'react'
import ReportTable from '@/components/ReportTable'

export default function Home() {
  const [report, setreport] = useState({})
  const [baseUrl, setbaseUrl] = useState(
    process.env.NODE_ENV === 'production'
      ? 'http://34.86.206.228:8080/api'
      : 'http://localhost:8000',
  )

  useEffect(() => {
    fetch(`${baseUrl}/data`, {
      method: 'GET',
      mode: 'cors',
    })
      .then((res) => res.json())
      .then((data) => setreport(data))
      .catch((err) => console.log(err))
  }, [])

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
        {report.data ? <ReportTable report={report} /> : 'No data'}
      </main>
    </>
  )
}
