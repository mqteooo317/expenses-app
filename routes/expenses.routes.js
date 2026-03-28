const express = require('express')
const router = express.Router()

const {
    getExpenses,
    createExpense,
    deleteExpense,
    getTotal
} = require('../controllers/expenses.controller')

router.get('/total', getTotal)
router.get('/', getExpenses)
router.post('/', createExpense)
router.delete('/:id', deleteExpense)

module.exports = router