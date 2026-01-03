import axios from "axios"

const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL

export const fetchAvailableWithdrawls = async () => {
    try {
        console.log('Fetching from:', `${BACKEND_URL}/api/available`)
        const { data } = await axios.get(`${BACKEND_URL}/api/available`)
        console.log('Available withdrawals:', data)
        return data;
    } catch (error) {
        console.error('Error fetching withdrawals:', error)
        throw error
    }
}

export const withdrawSingle = async ({ customer, index }) => {
    try {
        console.log('Single withdrawal request:', { customer, index })
        const { data } = await axios.post(`${BACKEND_URL}/api/single/withdrawl`, {
            customer,
            index
        }, {
            timeout: 60000, // 60 seconds - blockchain needs time
            headers: {
                'Content-Type': 'application/json'
            }
        })
        console.log('Single withdrawal response:', data)
        return data;
    } catch (error) {
        console.error('Error in single withdrawal:', error.response?.data || error.message)
        if (error.code === 'ECONNABORTED') {
            throw new Error('Request timeout - blockchain transaction took too long')
        }
        throw error
    }
}

export const batchWithdrawls = async ({ customer, indices }) => {
    try {
        console.log('Batch withdrawal request:', { customer, indices })
        const { data } = await axios.post(`${BACKEND_URL}/api/batch/withdrawl`, {
            customer,
            indices
        }, {
            timeout: 60000, // 60 second timeout for batch
            headers: {
                'Content-Type': 'application/json'
            }
        })
        console.log('Batch withdrawal response:', data)
        return data
    } catch (error) {
        console.error('Error in batch withdrawal:', error.response?.data || error.message)
        if (error.code === 'ECONNABORTED') {
            throw new Error('Request timeout - operation took too long')
        }
        throw error
    }
}