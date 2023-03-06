import React from 'react'

function Select({ id, label, options, onChange }) {
  return (
    <>
      <label htmlFor={id}>{label}:&nbsp;</label>
      <select id={id} name={id} onChange={onChange}>
        <option key="All" value="">
          Select All
        </option>
        {options}
      </select>
    </>
  )
}

export default Select
