console.log(tinycolor)
const hueStep = 2 // 色相阶梯
const saturationStep = 0.16 // 饱和度阶梯，浅色部分
const saturationStep2 = 0.05 // 饱和度阶梯，深色部分
const brightnessStep1 = 0.05 // 亮度阶梯，浅色部分
const brightnessStep2 = 0.15 // 亮度阶梯，深色部分
const lightColorCount = 5 // 浅色数量，主色上
const darkColorCount = 4 // 深色数量，主色下
// 暗色主题颜色映射关系表
const darkColorMap = [
  { index: 7, opacity: 0.15 },
  { index: 6, opacity: 0.25 },
  { index: 5, opacity: 0.3 },
  { index: 5, opacity: 0.45 },
  { index: 5, opacity: 0.65 },
  { index: 5, opacity: 0.85 },
  { index: 4, opacity: 0.9 },
  { index: 3, opacity: 0.95 },
  { index: 2, opacity: 0.97 },
  { index: 1, opacity: 0.98 },
]

function toHsv({ r, g, b }) {
  const hsv = tinycolor.rgbToHsv(r, g, b)
  return { h: hsv.h * 360, s: hsv.s, v: hsv.v }
}

function toHex({ r, g, b }) {
  return `#${tinycolor.rgbToHex(r, g, b, false)}`
}

function mix(rgb1, rgb2, amount) {
  const p = amount / 100
  const rgb = {
    r: (rgb2.r - rgb1.r) * p + rgb1.r,
    g: (rgb2.g - rgb1.g) * p + rgb1.g,
    b: (rgb2.b - rgb1.b) * p + rgb1.b,
  }
  return rgb
}
/* 获取色相渐变 */
function getHue(hsv, i, light) {
  let hue
  // 根据色相不同，色相转向不同
  if (Math.round(hsv.h) >= 60 && Math.round(hsv.h) <= 240)
    hue = light ? Math.round(hsv.h) - hueStep * i : Math.round(hsv.h) + hueStep * i

  else
    hue = light ? Math.round(hsv.h) + hueStep * i : Math.round(hsv.h) - hueStep * i

  if (hue < 0)
    hue += 360

  else if (hue >= 360)
    hue -= 360

  return hue
}
/* 获取饱和度渐变 */
function getSaturation(hsv, i, light) {
  // grey color don't change saturation
  if (hsv.h === 0 && hsv.s === 0)
    return hsv.s

  let saturation
  if (light)
    saturation = hsv.s - saturationStep * i

  else if (i === darkColorCount)
    saturation = hsv.s + saturationStep

  else
    saturation = hsv.s + saturationStep2 * i

  // 边界值修正
  if (saturation > 1)
    saturation = 1

  // 第一格的 s 限制在 0.06-0.1 之间
  if (light && i === lightColorCount && saturation > 0.1)
    saturation = 0.1

  if (saturation < 0.06)
    saturation = 0.06

  return Number(saturation.toFixed(2))
}
/* 获取明度渐变 */
function getValue(hsv, i, light) {
  let value
  if (light)
    value = hsv.v + brightnessStep1 * i

  else
    value = hsv.v - brightnessStep2 * i
    
  console.log('value',value)
  if (value > 1)
    value = 1

  return Number(value.toFixed(2))
}
/* opts:{
  theme:string
  backgroundColor:string
} */
function colorGenerate(color, opts = {}) {
  const patterns = []
  const pColor = tinycolor.inputToRGB(color)
  /* 生成5个明色 */
  for (let i = lightColorCount; i > 0; i -= 1) {
    const hsv = toHsv(pColor)
    const colorString = toHex(
      tinycolor.inputToRGB({
        h: getHue(hsv, i, true),
        s: getSaturation(hsv, i, true),
        v: getValue(hsv, i, true),
      }),
    )
    patterns.push(colorString)
  }
  /* 在5的位置塞入接受到的颜色(Hex) #xxxxxx */
  patterns.push(toHex(pColor))
  /* 生成4个暗色 */
  for (let i = 1; i <= darkColorCount; i += 1) {
    const hsv = toHsv(pColor)
    const colorString = toHex(
      tinycolor.inputToRGB({
        h: getHue(hsv, i),
        s: getSaturation(hsv, i),
        v: getValue(hsv, i),
      }),
    )
    patterns.push(colorString)
  }

  // 深色主题
  if (opts.theme === 'dark') {
    return darkColorMap.map(({ index, opacity }) => {
      const darkColorString = toHex(
        mix(tinycolor.inputToRGB(opts.backgroundColor || '#141414'), tinycolor.inputToRGB(patterns[index]), opacity * 100),
      )
      return darkColorString
    })
  }
  return patterns
}


