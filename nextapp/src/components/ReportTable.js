import React, { useMemo, useState } from 'react'
import { useTable, useSortBy } from 'react-table'
import styles from '@/styles/Home.module.css'

function ReportTable({ report }) {
  const columns = useMemo(() => report.columns, [report])
  const data = useMemo(() => report.data, [report])
  const [selectedTeams, setSelectedTeams] = useState(
    report.data.map((d) => d.TEAM_NAME),
  )

  const tableInstance = useTable(
    {
      columns,
      data,
    },
    useSortBy,
  )
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = tableInstance

  const handleTeamSelect = (event, teamName) => {
    if (event.target.checked) {
      setSelectedTeams([...selectedTeams, teamName])
    } else {
      setSelectedTeams(selectedTeams.filter((team) => team !== teamName))
    }
  }

  const teamNames = Array.from(new Set(data.map((d) => d.TEAM_NAME)))

  return (
    <>
      <div className={styles.checkboxes}>
        <label className={styles.checkbox}>
          <input
            type="checkbox"
            checked={selectedTeams.length === teamNames.length}
            onChange={() =>
              setSelectedTeams(
                selectedTeams.length === teamNames.length ? [] : teamNames,
              )
            }
          />
          <span className={styles.checkmark}></span>
          Select All
        </label>
        {teamNames.map((teamName) => (
          <label className={styles.checkbox} key={teamName}>
            <input
              type="checkbox"
              checked={selectedTeams.includes(teamName)}
              onChange={(event) => handleTeamSelect(event, teamName)}
            />
            <span className={styles.checkmark}></span>
            {teamName}
          </label>
        ))}
      </div>
      <div className={styles.container}>
        <table className={styles.redTable} {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render('Header')}
                    <span>
                      {column.isSorted ? (column.isSortedDesc ? 'v' : '^') : ''}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows
              .filter((row) =>
                selectedTeams.length === 0
                  ? false
                  : selectedTeams.includes(row.original.TEAM_NAME),
              )
              .map((row) => {
                prepareRow(row)
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => (
                      <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    ))}
                  </tr>
                )
              })}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default ReportTable
