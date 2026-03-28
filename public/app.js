const list = document.getElementById('list')
const totalEl = document.getElementById('total')

const modal = document.getElementById('modal')
const openModal = document.getElementById('openModal')
const closeModal = document.getElementById('closeModal')
const fab = document.getElementById('fab')
const form = document.getElementById('expenseForm')

const infoBtn = document.getElementById('infoBtn')
const infoPanel = document.getElementById('infoPanel')

function openExpenseModal() {
    modal.classList.remove('hidden')
}

function closeExpenseModal() {
    modal.classList.add('hidden')
}

openModal.addEventListener('click', openExpenseModal)
fab.addEventListener('click', openExpenseModal)
closeModal.addEventListener('click', closeExpenseModal)

modal.addEventListener('click', (e) => {
    if (e.target === modal) closeExpenseModal()
})

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeExpenseModal()
        infoPanel.classList.add('hidden')
    }
})

infoBtn.addEventListener('click', () => {
    infoPanel.classList.toggle('hidden')
})

async function loadExpenses() {
    try {
        const res = await fetch('/expenses')
        const data = await res.json()

        list.innerHTML = ''

        if (!Array.isArray(data) || data.length === 0) {
            list.innerHTML = `
                <li class="empty-state">
                    Aún no hay gastos cargados.
                </li>
            `
            return
        }

        data.forEach((exp, index) => {
            const li = document.createElement('li')
            li.className = 'expense-item'
            li.style.animationDelay = `${index * 25}ms`

            li.innerHTML = `
                <div class="expense-left">
                    <span class="expense-title">${escapeHtml(exp.title)}</span>
                    <span class="expense-category">${escapeHtml(exp.category)}</span>
                </div>

                <div class="expense-right">
                    <span class="expense-amount">$${Number(exp.amount).toLocaleString('es-AR')}</span>
                    <button class="delete-btn" onclick="deleteExpense(${exp.id})" aria-label="Eliminar gasto">
                        ×
                    </button>
                </div>
            `

            list.appendChild(li)
        })
    } catch (err) {
        console.error('[FRONTEND] Error loading expenses:', err)
        list.innerHTML = `
            <li class="empty-state">
                No se pudieron cargar los gastos.
            </li>
        `
    }
}

async function loadTotal() {
    try {
        const res = await fetch('/expenses/total')
        const data = await res.json()
        totalEl.textContent = '$' + Number(data.total).toLocaleString('es-AR')
    } catch (err) {
        console.error('[FRONTEND] Error loading total:', err)
        totalEl.textContent = '$0'
    }
}

form.addEventListener('submit', async (e) => {
    e.preventDefault()

    const expense = {
        title: document.getElementById('title').value.trim(),
        amount: Number(document.getElementById('amount').value),
        category: document.getElementById('category').value.trim()
    }

    try {
        await fetch('/expenses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(expense)
        })

        form.reset()
        closeExpenseModal()
        await loadExpenses()
        await loadTotal()
    } catch (err) {
        console.error('[FRONTEND] Error creating expense:', err)
    }
})

async function deleteExpense(id) {
    try {
        await fetch(`/expenses/${id}`, {
            method: 'DELETE'
        })

        await loadExpenses()
        await loadTotal()
    } catch (err) {
        console.error('[FRONTEND] Error deleting expense:', err)
    }
}

function escapeHtml(value) {
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;')
}

loadExpenses()
loadTotal()

window.deleteExpense = deleteExpense