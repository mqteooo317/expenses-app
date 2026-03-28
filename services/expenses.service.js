const fs = require('fs').promises
const path = require('path')

const FILE = path.join(__dirname, '..', 'expenses.json')

const readExpenses = async () => {
    try {
        const data = await fs.readFile(FILE, 'utf8')

        if (!data.trim()) {
            return []
        }

        return JSON.parse(data)
    } catch (err) {
        if (err.code === 'ENOENT') {
            await fs.writeFile(FILE, '[]', 'utf8')
            return []
        }

        console.error('[FILE] Error reading expenses.json:', err)
        throw err
    }
}

const writeExpenses = async (data) => {
    try {
        await fs.writeFile(FILE, JSON.stringify(data, null, 2), 'utf8')
    } catch (err) {
        console.error('[FILE] Error writing expenses.json:', err)
        throw err
    }
}

module.exports = {
    readExpenses,
    writeExpenses
}