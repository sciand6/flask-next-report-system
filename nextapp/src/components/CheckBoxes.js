import React from 'react'
import styles from '@/styles/Home.module.css'
import CheckBox from './CheckBox'

function CheckBoxes({
  options,
  selectedOptions,
  handleSelectAll,
  handleOptionSelect,
}) {
  return (
    <div className={styles.checkboxes}>
      <CheckBox
        label="Select All"
        isChecked={selectedOptions.length === options.length}
        onCheck={() =>
          handleSelectAll(
            selectedOptions.length === options.length ? [] : options,
          )
        }
      />
      {options.map((option) => (
        <CheckBox
          key={option}
          label={option}
          isChecked={selectedOptions.includes(option)}
          onCheck={(event) => handleOptionSelect(event, option)}
        />
      ))}
    </div>
  )
}

export default CheckBoxes
