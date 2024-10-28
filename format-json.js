// format json
// read file and format
import { readFileSync, writeFileSync } from 'node:fs'

const filePath = './openapi.json'

try {
  const jsonData = readFileSync(filePath, 'utf8')
  const obj = JSON.parse(jsonData)
  const formatted = JSON.stringify(obj, null, 2)
  writeFileSync(filePath, formatted)
  console.log('JSON 文件格式化成功')
}
catch (err) {
  console.error('格式化 JSON 文件时发生错误:', err)
}
