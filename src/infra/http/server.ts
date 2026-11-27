// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
import 'dotenv/config'
import app from './app'

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`)
})