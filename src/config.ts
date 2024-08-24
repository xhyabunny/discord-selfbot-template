require('dotenv').config({ path: '.env.local' })

const Objects = {
  token: process.env.TOKEN,
  prefix: "$",
  defaultCommandCooldown : 1,
  currentDirectory: './src/downloads',
  startDir: './src/downloads'
}

export default Objects;