import React from 'react'
import style from './SettingsModal.module.css'

function SettingsModal({ settings, onClose, onUpdateSetting }) {
  const handleSubmit = (e, setting) => {
    e.preventDefault()
    const highLimit = e.target.highLimit.value
    const highHighLimit = e.target.highHighLimit.value
    onUpdateSetting(setting.measurementType, highLimit, highHighLimit)
  }

  return (
    <div className={style.modalOverlay}>
        
      <div className={style.modal}>
      <h2>Cài đặt</h2>
        {settings.map(setting => (
          <form key={setting._id} onSubmit={(e) => handleSubmit(e, setting)} className={style.settingForm}>
            <h3>{setting.measurementType}</h3>
            <div className={style.inputRow}>
              <label>
                High Limit:
                <input
                  type="number"
                  name="highLimit"
                  defaultValue={setting.highLimit}
                />
              </label>
              <label>
                High High Limit:
                <input
                  type="number"
                  name="highHighLimit"
                  defaultValue={setting.highHighLimit}
                />
              </label>
              <button type="submit">Update</button>
            </div>
          </form>
        ))}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  )
}

export default SettingsModal
