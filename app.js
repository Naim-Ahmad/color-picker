// Global
const defaultObj = {
  red: 171,
  green: 205,
  blue: 239,
}

const colorArr = [
  '#3C0C24',
  '#DDE520',
  '#E945C0',
  '#6A4503',
  '#90BAAB',
  '#6AC51D',
  '#246F68',
  '#07F8BB',
  '#D60865',
  '#796773',
  '#2545AB',
  '#C99332',
  '#CE82FB',
  '#A7A785',
  '#FA915D',
]
let customColor = []

// Onload handler function

window.onload = () => {
  main()
  updateToDom(defaultObj)
  const customColorsString = localStorage.getItem('customColor')
  if (customColorsString) {
    customColor = JSON.parse(customColorsString)
    if (customColor.length > 12) {
      customColor = customColor.slice(0, 12)
    }
    updatePaletteColor(
      document.querySelector('.custom-preset-container'),
      customColor
    )
  }
}

// Main function the collect all references
function main() {
  // Dom references

  const randomColorBtn = document.getElementById('random-color-btn')
  const showHexCode = document.getElementById('show-hex-code')
  const redSlider = document.getElementById('red')
  const greenSlider = document.getElementById('green')
  const blueSlider = document.getElementById('blue')
  const copyBtn = document.getElementById('copy-btn')
  const saveBtn = document.getElementById('save-btn')
  const paletteContainer = document.querySelector('.preset-palette-container')
  const customPresetContainer = document.querySelector(
    '.custom-preset-container'
  )
  const bgUploadBtn = document.getElementById('bg-upload-btn')
  const bgUploadField = document.getElementById('bg-upload-field')
  const previewBg = document.querySelector('.view-background')
  const bgRemoveBtn = document.getElementById('bg-remove-btn')
  const bgController = document.querySelector('.bg-controller')

  // event listener

  randomColorBtn.addEventListener('click', handleGenerateRandomColor)
  showHexCode.addEventListener('keyup', handleHexInput)
  redSlider.addEventListener(
    'change',
    handleCreateSliderObject(redSlider, greenSlider, blueSlider)
  )
  greenSlider.addEventListener(
    'change',
    handleCreateSliderObject(redSlider, greenSlider, blueSlider)
  )
  blueSlider.addEventListener(
    'change',
    handleCreateSliderObject(redSlider, greenSlider, blueSlider)
  )
  copyBtn.addEventListener('click', handleCopyToClipBoard)
  saveBtn.addEventListener(
    'click',
    handleSaveBtn(customPresetContainer, showHexCode)
  )

  paletteContainer.addEventListener(
    'click',
    handlePresetColor(paletteContainer)
  )
  customPresetContainer.addEventListener('click', presetCopyToClip)

  bgUploadBtn.addEventListener('click', function () {
    bgUploadField.click()
  })
  bgUploadField.addEventListener(
    'change',
    handleUpload(previewBg, bgRemoveBtn, bgController)
  )
  bgRemoveBtn.addEventListener(
    'click',
    handleRemove(previewBg, bgRemoveBtn, bgController)
  )
  document
    .getElementById('bgSize')
    .addEventListener('change', handleBgController(previewBg))
  document
    .getElementById('bgRepeat')
    .addEventListener('change', handleBgController(previewBg))
  document
    .getElementById('bgPosition')
    .addEventListener('change', handleBgController(previewBg))
  document
    .getElementById('bgAttachment')
    .addEventListener('change', handleBgController(previewBg))
}

// All Handler

/**
 * The function generate color decimal object and this object passed to updateToDom function for changes
 */
function handleGenerateRandomColor() {
  const decimalObj = generateDecimal()
  updateToDom(decimalObj)
}

/**
 * The function take hex color from hex input field and validated value of input and convert hex color to decimal as object and passed the update to updateToDom for update the changes every where
 * @param {Event} e
 */
function handleHexInput(e) {
  const color = e.target.value
  if (color) {
    document.getElementById('show-hex-code').value = color.toUpperCase()
    if (isValidHex(color)) {
      const decimal = hexToDecimal(color)
      updateToDom(decimal)
    }
  }
}

/**
 * The function take input range value and create an color object then the object pass to updateToDom function for update all changes by input range
 * @return {Object} color
 */

function handleCreateSliderObject(redSlider, greenSlider, blueSlider) {
  return function () {
    const color = {
      red: parseInt(redSlider.value),
      green: parseInt(greenSlider.value),
      blue: parseInt(blueSlider.value),
    }
    updateToDom(color)
  }
}

/**
 * handle copy to clip board
 */

function handleCopyToClipBoard() {
  const mode = checkedRadioBtn(document.getElementsByName('copy-mode'))
  if (mode === null) {
    throw new Error('Invalid Radio Input')
  }

  if (mode === 'hex') {
    const hexCode = document.getElementById('show-hex-code')
    if (mode && isValidHex(hexCode.value)) {
      navigator.clipboard.writeText(`#${hexCode.value}`)
      generateToastMessage(`#${hexCode.value}`)
      playSound()
    }
  } else {
    const rgbCode = document.getElementById('show-rgb-code')
    navigator.clipboard.writeText(rgbCode.value)
    generateToastMessage(`${rgbCode.value}`)
    playSound()
  }
}

/**
 * The function take preset color container node and generate child and append this child to parent (preset color container)
 * @param {Node} parent
 */

function handlePresetColor(parent) {
  updatePaletteColor(parent, colorArr)
  return function (event) {
    presetCopyToClip(event)
  }
}

// handle save button

function handleSaveBtn(parent, showHexCode) {
  return function () {
    const color = `#${showHexCode.value}`
    if (customColor.includes(color)) {
      generateToastMessage('Already saved', '', 'lightcoral')
      return
    }
    customColor.unshift(color)
    localStorage.setItem('customColor', JSON.stringify(customColor))
    if (customColor.length > 15) {
      customColor = customColor.slice(0, 15)
    }
    removeChildren(parent)
    updatePaletteColor(parent, customColor)
    generateToastMessage(color, 'saved')
    playSound()
  }
}
/**
 *
 * @param {Node} parent
 */
function removeChildren(parent) {
  let child = parent.lastElementChild
  while (child) {
    parent.removeChild(child)
    child = parent.lastElementChild
  }
}
/**
 *
 * @param {Node} previewBg
 * @returns
 */
function handleBgController(previewBg) {
  return function () {
    previewBg.style.backgroundSize = document.getElementById('bgSize').value
    previewBg.style.backgroundRepeat = document.getElementById('bgRepeat').value
    previewBg.style.backgroundPosition =
      document.getElementById('bgPosition').value
    document.body.style.backgroundSize = document.getElementById('bgSize').value
    document.body.style.backgroundRepeat =
      document.getElementById('bgRepeat').value
    document.body.style.backgroundPosition =
      document.getElementById('bgPosition').value
    document.body.style.backgroundAttachment =
      document.getElementById('bgAttachment').value
  }
}

function handleUpload(previewBg, bgRemoveBtn, bgController) {
  return function (event) {
    const file = event.target.files[0]
    const imgUrl = URL.createObjectURL(file)
    previewBg.style.backgroundImage = `url('${imgUrl}')`
    document.body.style.backgroundImage = `url('${imgUrl}')`
    bgRemoveBtn.style.display = 'inline'
    bgController.style.visibility = 'visible'
  }
}

function handleRemove(previewBg, bgRemoveBtn, bgController) {
  return function () {
    previewBg.style.backgroundImage = 'none'
    previewBg.style.backgroundColor = '#abcdef'
    document.body.style.backgroundImage = 'none'
    document.body.style.backgroundColor = '#ddd'
    bgRemoveBtn.style.display = 'none'
    bgUploadField.value = null
    bgController.style.visibility = 'hidden'
  }
}

// Dom related function

/***
 * The function take an color object and update the dom every where
 * @param {Object} color
 */

function updateToDom(decimalObj) {
  const hex = generateHEXcolor(decimalObj).toUpperCase()
  const rgb = generateRGB(decimalObj)

  document.getElementById('display').style.backgroundColor = hex
  document.getElementById('show-hex-code').value = hex.slice(1)
  document.getElementById('show-rgb-code').value = rgb
  document.getElementById('red-label').innerText = decimalObj.red
  document.getElementById('green-label').innerText = decimalObj.green
  document.getElementById('blue-label').innerText = decimalObj.blue
  document.getElementById('red').value = decimalObj.red
  document.getElementById('green').value = decimalObj.green
  document.getElementById('blue').value = decimalObj.blue
}

/**
 * The function take a string and it update the dom whit toast message
 * @param {String} msg
 */

function generateToastMessage(code, message = 'copied', bgColor = 'lightblue') {
  let p = document.createElement('p')
  p.innerText = `${code} ${message}!`
  p.style.backgroundColor = bgColor
  p.className = 'toast'

  let toastContainer = document.querySelector('.toast-container')
  toastContainer.appendChild(p)

  p.addEventListener('animationend', function () {
    p.remove()
  })
}

/**
 * generate p element and append it to paren
 * @param {Array} color
 */

function generatePaletteBox(color) {
  const p = document.createElement('p')
  p.className = 'preset-color-box'
  p.style.background = color
  p.setAttribute('data-color', color)

  return p
}
/**
 * the function take parent object and an color array and generate palette box by colors array an append the color to parent object
 * @param {Node} parent
 * @param {Array} colors
 */

function updatePaletteColor(parent, colors) {
  colors.forEach((color) => {
    const child = generatePaletteBox(color)
    parent.appendChild(child)
  })
}

// Utility

function playSound() {
  const copySound = new Audio('./copy-sound.wav')
  copySound.play()
  copySound.volume = 0.3
}

/**
 * The function Generate random number and return object of color decimal
 * @returns {Object} color
 */
function generateDecimal() {
  const red = Math.floor(Math.random() * 255)
  const green = Math.floor(Math.random() * 255)
  const blue = Math.floor(Math.random() * 255)

  return {
    red,
    green,
    blue,
  }
}

/**
 *
 * @param {Object} color
 * @returns {return} hex color code
 */
function generateHEXcolor({ red, green, blue }) {
  const getTwoCode = (value) => {
    const hex = value.toString(16)
    return hex.length === 1 ? `0${hex}` : hex
  }

  return `#${getTwoCode(red)}${getTwoCode(green)}${getTwoCode(blue)}`
}

/**
 *
 * @param {Object} color
 * @returns {String} rgb color code
 */
function generateRGB({ red, green, blue }) {
  return `rgb(${red}, ${green}, ${blue})`
}

/**
 * The function take a hex color code and return a rgb color code
 *@param {string} hex color code
 *@return {String} rgb color code
 */
function hexToRgb(hex) {
  const red = hex.slice(0, 2)
  const green = hex.slice(2, 4)
  const blue = hex.slice(4)

  return `rgb(${parseInt(red, 16)}, ${parseInt(green, 16)}, ${parseInt(
    blue,
    16
  )})`
}

/**
 * The function take a string and return a boolean
 * @param {string} color : ;
 * @return {boolean}
 */
function isValidHex(color) {
  if (color.length !== 6) return false
  return /^[0-9A-Fa-f]{6}$/i.test(color)
}

/**
 * The function take hex color code and return decimal color object
 * @param {String} hex
 */

function hexToDecimal(hex) {
  const red = hex.slice(0, 2)
  const green = hex.slice(2, 4)
  const blue = hex.slice(4)

  return {
    red: parseInt(red, 16),
    green: parseInt(green, 16),
    blue: parseInt(blue, 16),
  }
}

/**
 * the function take radio button and check which button is selected
 * @param {Node} node
 * @returns {boolean/null}
 */

function checkedRadioBtn(node) {
  let isCheckedRadio = null
  for (let i = 0; i < node.length; i++) {
    if (node[i].checked) {
      isCheckedRadio = `${node[i].value}`
    }
  }
  return isCheckedRadio
}

function presetCopyToClip(event) {
  const child = event.target
  if (child.classList.value === 'preset-color-box') {
    handleCopyToClipBoard()
  }
}
