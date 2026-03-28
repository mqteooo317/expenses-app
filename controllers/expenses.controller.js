const { readExpenses, writeExpenses } = require('../services/expenses.service')

const getExpenses = async (req, res) => {
    try {
        console.log('[GET] /expenses - fetching all expenses')

        const data = await readExpenses()

        console.log(`[GET] /expenses - ${data.length} expense(s) found`)
        return res.status(200).json(data)
    } catch (err) {
        console.error('[GET] /expenses - error:', err)
        return res.status(500).json({
            message: 'Something went wrong while loading expenses.'
        })
    }
}

const createExpense = async (req, res) => {
    try {
        console.log('[POST] /expenses - creating new expense')

        const newExpense = req.body

        if (!newExpense || !newExpense.title || !newExpense.amount || !newExpense.category) {
            console.log('[POST] /expenses - invalid body received')
            return res.status(400).json({
                message: 'Invalid body. Required fields: title, amount, category.'
            })
        }

        const data = await readExpenses()
        const lastId = data.length > 0 ? Math.max(...data.map(exp => exp.id)) : 0

        const expenseToSave = {
            id: lastId + 1,
            title: String(newExpense.title).trim(),
            amount: Number(newExpense.amount),
            category: String(newExpense.category).trim(),
            date: Date.now()
        }

        data.push(expenseToSave)
        await writeExpenses(data)

        console.log(
            `[POST] /expenses - expense created successfully (id=${expenseToSave.id}, title="${expenseToSave.title}", amount=${expenseToSave.amount})`
        )

        return res.status(201).json({
            message: 'Expense created successfully.',
            expense: expenseToSave
        })
    } catch (err) {
        console.error('[POST] /expenses - error:', err)
        return res.status(500).json({
            message: 'Something went wrong while creating the expense.'
        })
    }
}

const deleteExpense = async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        console.log(`[DELETE] /expenses/${id} - deleting expense`)

        const data = await readExpenses()
        const index = data.findIndex(exp => exp.id === id)

        if (index === -1) {
            console.log(`[DELETE] /expenses/${id} - expense not found`)
            return res.status(404).json({
                message: 'Expense not found.'
            })
        }

        const deleted = data[index]
        data.splice(index, 1)
        await writeExpenses(data)

        console.log(
            `[DELETE] /expenses/${id} - deleted successfully (title="${deleted.title}", amount=${deleted.amount})`
        )

        return res.status(204).send()
    } catch (err) {
        console.error(`[DELETE] /expenses/${req.params.id} - error:`, err)
        return res.status(500).json({
            message: 'Something went wrong while deleting the expense.'
        })
    }
}

const getTotal = async (req, res) => {
    try {
        console.log('[GET] /expenses/total - calculating total')

        const data = await readExpenses()
        const total = data.reduce((acu, act) => acu + Number(act.amount), 0)

        console.log(`[GET] /expenses/total - total calculated: ${total}`)
        return res.status(200).json({ total })
    } catch (err) {
        console.error('[GET] /expenses/total - error:', err)
        return res.status(500).json({
            message: 'Something went wrong while calculating the total.'
        })
    }
}

module.exports = {
    getExpenses,
    createExpense,
    deleteExpense,
    getTotal
}