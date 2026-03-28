const express = require('express')
const app = express()

const expensesRoutes = require('./routes/expenses.routes')

const port = process.env.PORT || 3000

app.use(express.json())
app.use(express.static('public'))

app.use('/expenses', expensesRoutes)

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
})

app.listen(port, () => {
    console.log(`[SERVER] Expenses API running on http://localhost:${port}`)
})