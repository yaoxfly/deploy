import fs from 'fs'
import inquirer from 'inquirer'
import { resolve } from './utils'
import { config } from './config'
import { connect } from './connect'
export const backup = async () => {
  const { backup } = config || {}
  let dir=''
  try {
   dir = resolve(process.cwd(), backup.outputDir)
  } catch (error) {
    throw new Error('backup.outputDir in the yx.deploy.config is not configured!')
  }
  const file=[]
  try {
      const files = fs.readdirSync(dir);
      files.forEach(item => {
        file.unshift(item)
      });
  } catch (err) {
    throw new Error('The backup folder does not exist!')
  }
  file[0]=`${file[0]} latest`
  const param = [
    {
      type: 'list',
      message: '请选择一个版本还原',
      name: 'fileName',
      choices:file,
      filter:(val)=>{
        return val.split(' ')[0]
      }
    }
  ]
  const answers = await inquirer.prompt(param)
  const {fileName}=answers ||{}
  await connect(fileName)
}