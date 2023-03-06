import React from 'react'
import styles from '@/styles/Home.module.css'

function CheckBox({ label, isChecked, onCheck }) {
  return (
    <label className={styles.checkbox}>
      <input type="checkbox" checked={isChecked} onChange={onCheck} />
      <span className={styles.checkmark}></span>
      {label}
    </label>
  )
}

export default CheckBox
