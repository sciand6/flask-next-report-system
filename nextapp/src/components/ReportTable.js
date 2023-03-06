import React, { useMemo, useState } from 'react'
import { useTable, useSortBy } from 'react-table'
import styles from '@/styles/Home.module.css'
import CheckBoxes from './CheckBoxes'

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
      <CheckBoxes
        options={teamNames}
        selectedOptions={selectedTeams}
        handleSelectAll={setSelectedTeams}
        handleOptionSelect={handleTeamSelect}
      />
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
