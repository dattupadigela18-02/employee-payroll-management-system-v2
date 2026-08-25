import { useEffect, useState } from 'react'

function Payroll() {

    const [payrolls, setPayrolls] = useState([])
    const [employees, setEmployees] = useState([])

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState(null)

    const [employeeId, setEmployeeId] = useState('')
    const [month, setMonth] = useState('')
    const [year, setYear] = useState('')
    const [basicSalary, setBasicSalary] = useState('')
    const [workingDays, setWorkingDays] = useState('')
    const [presentDays, setPresentDays] = useState('')
    const [deductions, setDeductions] = useState('')

    const [filterEmployee, setFilterEmployee] = useState('')
    const [filterMonth, setFilterMonth] = useState('')
    const [filterYear, setFilterYear] = useState('')

    // ==========================================
    // FETCH EMPLOYEES
    // ==========================================

    const fetchEmployees = async () => {

        try {

            const response = await fetch(
                'http://localhost:8080/api/employees'
            )

            if (!response.ok) {
                throw new Error('Failed to fetch employees')
            }

            const data = await response.json()

            setEmployees(data)

        } catch (error) {

            console.error(error)

        }
    }


    // ==========================================
    // FETCH PAYROLLS
    // ==========================================

    const fetchPayrolls = async () => {

        try {

            setLoading(true)

            const response = await fetch(
                'http://localhost:8080/api/payroll'
            )

            if (!response.ok) {
                throw new Error('Failed to fetch payroll records')
            }

            const data = await response.json()

            setPayrolls(data)
            setError('')

        } catch (error) {

            console.error(error)

            setError(
                'Unable to connect to backend. Make sure Spring Boot is running.'
            )

        } finally {

            setLoading(false)

        }
    }


    // ==========================================
    // INITIAL LOAD
    // ==========================================

    useEffect(() => {

        fetchEmployees()
        fetchPayrolls()

    }, [])


    // ==========================================
    // RESET FORM
    // ==========================================

    const resetForm = () => {

        setEmployeeId('')
        setMonth('')
        setYear('')
        setBasicSalary('')
        setWorkingDays('')
        setPresentDays('')
        setDeductions('')

        setEditingId(null)
        setShowForm(false)

    }


    // ==========================================
    // CALCULATIONS
    // ==========================================

    const working = Number(workingDays) || 0
    const present = Number(presentDays) || 0
    const salary = Number(basicSalary) || 0
    const deductionAmount = Number(deductions) || 0

    const leaveDays =
        working > 0 && present >= 0
            ? Math.max(working - present, 0)
            : 0

    const payableSalary =
        working > 0
            ? (salary / working) * present
            : 0

    const netSalary =
        Math.max(payableSalary - deductionAmount, 0)


    // ==========================================
    // VALIDATE FORM
    // ==========================================

    const validateForm = () => {

        if (!employeeId) {

            alert('Please select an employee.')

            return false
        }

        if (!month) {

            alert('Please select a month.')

            return false
        }

        if (!year) {

            alert('Please enter the year.')

            return false
        }

        if (!basicSalary || salary <= 0) {

            alert('Basic salary must be greater than 0.')

            return false
        }

        if (!workingDays || working <= 0) {

            alert('Working days must be greater than 0.')

            return false
        }

        if (presentDays === '' || present < 0) {

            alert('Present days cannot be negative.')

            return false
        }

        if (present > working) {

            alert(
                'Present days cannot be greater than working days.'
            )

            return false
        }

        if (deductions === '' || deductionAmount < 0) {

            alert('Deductions cannot be negative.')

            return false
        }

        if (deductionAmount > payableSalary) {

            alert(
                `Deductions cannot exceed the payable salary.\n\n` +
                `Payable Salary: ₹${payableSalary.toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                })}\n` +
                `Deductions: ₹${deductionAmount.toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                })}`
            )

            return false
        }

        return true
    }


    // ==========================================
    // ADD / UPDATE PAYROLL
    // ==========================================

    const handleSubmit = async (event) => {

        event.preventDefault()

        if (!validateForm()) {
            return
        }

        const payrollData = {

            employeeId: Number(employeeId),

            month: Number(month),

            year: Number(year),

            basicSalary: salary,

            workingDays: working,

            presentDays: present,

            leaveDays: leaveDays,

            deductions: deductionAmount,

            netSalary: netSalary

        }


        try {

            const url = editingId
                ? `http://localhost:8080/api/payroll/${editingId}`
                : 'http://localhost:8080/api/payroll'


            const method = editingId
                ? 'PUT'
                : 'POST'


            const response = await fetch(url, {

                method: method,

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify(payrollData)

            })


            if (!response.ok) {

                let message = 'Failed to save payroll'

                try {

                    const text = await response.text()

                    if (text) {
                        message = text
                    }

                } catch (error) {

                    console.error(error)

                }

                throw new Error(message)

            }


            alert(
                editingId
                    ? 'Payroll updated successfully!'
                    : 'Payroll added successfully!'
            )


            resetForm()

            fetchPayrolls()


        } catch (error) {

            console.error(error)

            alert(
                error.message || 'Failed to save payroll'
            )

        }

    }


    // ==========================================
    // EDIT PAYROLL
    // ==========================================

    const handleEdit = (payroll) => {

        setEditingId(payroll.id)

        setEmployeeId(String(payroll.employeeId))

        setMonth(String(payroll.month))

        setYear(String(payroll.year))

        setBasicSalary(String(payroll.basicSalary))

        setWorkingDays(String(payroll.workingDays))

        setPresentDays(String(payroll.presentDays))

        setDeductions(String(payroll.deductions))

        setShowForm(true)

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })

    }


    // ==========================================
    // DELETE PAYROLL
    // ==========================================

    const handleDelete = async (id) => {

        const confirmed = window.confirm(
            'Are you sure you want to delete this payroll record?'
        )

        if (!confirmed) {
            return
        }


        try {

            const response = await fetch(
                `http://localhost:8080/api/payroll/${id}`,
                {
                    method: 'DELETE'
                }
            )


            if (!response.ok) {

                throw new Error(
                    'Failed to delete payroll record'
                )

            }


            alert('Payroll deleted successfully!')

            fetchPayrolls()


        } catch (error) {

            console.error(error)

            alert(
                error.message ||
                'Unable to delete payroll record'
            )

        }

    }


    // ==========================================
    // FILTER PAYROLLS
    // ==========================================

    const filteredPayrolls = payrolls.filter((payroll) => {

        const employeeMatch =
            !filterEmployee ||
            String(payroll.employeeId)
                .includes(filterEmployee.trim())


        const monthMatch =
            !filterMonth ||
            String(payroll.month) === String(filterMonth)


        const yearMatch =
            !filterYear ||
            String(payroll.year).includes(
                filterYear.trim()
            )


        return (
            employeeMatch &&
            monthMatch &&
            yearMatch
        )

    })


    // ==========================================
    // EMPLOYEE NAME
    // ==========================================

    const getEmployeeName = (id) => {

        const employee = employees.find(
            (emp) => Number(emp.id) === Number(id)
        )

        if (!employee) {
            return `Employee ID: ${id}`
        }

        return (
            employee.name ||
            employee.firstName ||
            `${employee.firstName || ''} ${employee.lastName || ''}`.trim() ||
            `Employee ID: ${id}`
        )

    }


    // ==========================================
    // FORMAT CURRENCY
    // ==========================================

    const formatCurrency = (value) => {

        return `₹${Number(value || 0).toLocaleString(
            'en-IN',
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        )}`

    }


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <div className="welcome">

                <h2>Loading payroll records...</h2>

            </div>

        )

    }


    // ==========================================
    // MAIN UI
    // ==========================================

    return (

        <div>

            <h1>Payroll Management</h1>

            <p>Manage employee payroll records</p>


            {/* ==================================
                ADD PAYROLL BUTTON
            ================================== */}

            {!showForm && (

                <button
                    onClick={() => setShowForm(true)}
                >
                    ➕ Add Payroll
                </button>

            )}


            {/* ==================================
                PAYROLL FORM
            ================================== */}

            {showForm && (

                <div className="welcome">

                    <h2>
                        {editingId
                            ? 'Edit Payroll'
                            : 'Add Payroll'}
                    </h2>


                    <form onSubmit={handleSubmit}>

                        {/* Employee */}

                        <label>
                            Employee
                        </label>

                        <select
                            value={employeeId}
                            onChange={(e) =>
                                setEmployeeId(e.target.value)
                            }
                            required
                        >

                            <option value="">
                                Select Employee
                            </option>

                            {employees.map((employee) => (

                                <option
                                    key={employee.id}
                                    value={employee.id}
                                >
                                    {employee.name ||
                                        employee.firstName ||
                                        `Employee ${employee.id}`}
                                    {' '}
                                    (ID: {employee.id})
                                </option>

                            ))}

                        </select>


                        {/* Month */}

                        <label>
                            Month
                        </label>

                        <select
                            value={month}
                            onChange={(e) =>
                                setMonth(e.target.value)
                            }
                            required
                        >

                            <option value="">
                                Select Month
                            </option>

                            <option value="1">
                                January
                            </option>

                            <option value="2">
                                February
                            </option>

                            <option value="3">
                                March
                            </option>

                            <option value="4">
                                April
                            </option>

                            <option value="5">
                                May
                            </option>

                            <option value="6">
                                June
                            </option>

                            <option value="7">
                                July
                            </option>

                            <option value="8">
                                August
                            </option>

                            <option value="9">
                                September
                            </option>

                            <option value="10">
                                October
                            </option>

                            <option value="11">
                                November
                            </option>

                            <option value="12">
                                December
                            </option>

                        </select>


                        {/* Year */}

                        <label>
                            Year
                        </label>

                        <input
                            type="number"
                            value={year}
                            onChange={(e) =>
                                setYear(e.target.value)
                            }
                            min="2000"
                            max="2100"
                            required
                        />


                        {/* Basic Salary */}

                        <label>
                            Basic Salary
                        </label>

                        <input
                            type="number"
                            value={basicSalary}
                            onChange={(e) =>
                                setBasicSalary(e.target.value)
                            }
                            min="0"
                            step="0.01"
                            required
                        />


                        {/* Working Days */}

                        <label>
                            Working Days
                        </label>

                        <input
                            type="number"
                            value={workingDays}
                            onChange={(e) =>
                                setWorkingDays(e.target.value)
                            }
                            min="1"
                            max="31"
                            required
                        />


                        {/* Present Days */}

                        <label>
                            Present Days
                        </label>

                        <input
                            type="number"
                            value={presentDays}
                            onChange={(e) =>
                                setPresentDays(e.target.value)
                            }
                            min="0"
                            max={working || 31}
                            required
                        />


                        {/* Leave Days */}

                        <label>
                            Leave Days
                        </label>

                        <input
                            type="number"
                            value={leaveDays}
                            readOnly
                        />

                        <small>
                            Automatically calculated from
                            working days and present days.
                        </small>


                        {/* Deductions */}

                        <label>
                            Deductions
                        </label>

                        <input
                            type="number"
                            value={deductions}
                            onChange={(e) =>
                                setDeductions(e.target.value)
                            }
                            min="0"
                            max={payableSalary}
                            step="0.01"
                            required
                        />


                        {/* ==================================
                            SALARY PREVIEW
                        ================================== */}

                        <div className="welcome">

                            <h3>
                                Payroll Summary
                            </h3>

                            <p>
                                <strong>
                                    Leave Days:
                                </strong>{' '}
                                {leaveDays}
                            </p>

                            <p>
                                <strong>
                                    Payable Salary:
                                </strong>{' '}
                                {formatCurrency(payableSalary)}
                            </p>

                            <p>
                                <strong>
                                    Deductions:
                                </strong>{' '}
                                {formatCurrency(deductionAmount)}
                            </p>

                            <p>
                                <strong>
                                    Net Salary:
                                </strong>{' '}
                                {formatCurrency(netSalary)}
                            </p>

                            {deductionAmount > payableSalary && (

                                <p>

                                    ⚠️
                                    <strong>
                                        Deductions cannot exceed
                                        payable salary.
                                    </strong>

                                </p>

                            )}

                        </div>


                        {/* Buttons */}

                        <button type="submit">

                            💾
                            {editingId
                                ? ' Update Payroll'
                                : ' Add Payroll'}

                        </button>


                        <button
                            type="button"
                            onClick={resetForm}
                        >
                            Cancel
                        </button>

                    </form>

                </div>

            )}


            {/* ==================================
                ERROR
            ================================== */}

            {error && (

                <div className="welcome">

                    <h2>{error}</h2>

                </div>

            )}


            {/* ==================================
                FILTERS
            ================================== */}

            <div className="welcome">

                <h2>
                    🔎 Payroll Filters
                </h2>


                <input
                    type="text"
                    placeholder="Employee ID"
                    value={filterEmployee}
                    onChange={(e) =>
                        setFilterEmployee(e.target.value)
                    }
                />


                <select
                    value={filterMonth}
                    onChange={(e) =>
                        setFilterMonth(e.target.value)
                    }
                >

                    <option value="">
                        All Months
                    </option>

                    <option value="1">
                        January
                    </option>

                    <option value="2">
                        February
                    </option>

                    <option value="3">
                        March
                    </option>

                    <option value="4">
                        April
                    </option>

                    <option value="5">
                        May
                    </option>

                    <option value="6">
                        June
                    </option>

                    <option value="7">
                        July
                    </option>

                    <option value="8">
                        August
                    </option>

                    <option value="9">
                        September
                    </option>

                    <option value="10">
                        October
                    </option>

                    <option value="11">
                        November
                    </option>

                    <option value="12">
                        December
                    </option>

                </select>


                <input
                    type="text"
                    placeholder="Year"
                    value={filterYear}
                    onChange={(e) =>
                        setFilterYear(e.target.value)
                    }
                />


                <button
                    onClick={() => {

                        setFilterEmployee('')
                        setFilterMonth('')
                        setFilterYear('')

                    }}
                >
                    ❌ Clear Filters
                </button>

            </div>


            {/* ==================================
                PAYROLL TABLE
            ================================== */}

            <p>
                Showing {filteredPayrolls.length} of{' '}
                {payrolls.length} payroll records
            </p>


            {!error && filteredPayrolls.length === 0 ? (

                <div className="welcome">

                    <h2>
                        No payroll records found
                    </h2>

                    <p>
                        Add a payroll record or change
                        your filters.
                    </p>

                </div>

            ) : (

                <div className="employee-table">

                    <table>

                        <thead>

                        <tr>

                            <th>ID</th>

                            <th>Employee</th>

                            <th>Month</th>

                            <th>Year</th>

                            <th>Basic Salary</th>

                            <th>Deductions</th>

                            <th>Net Salary</th>

                            <th>Action</th>

                        </tr>

                        </thead>


                        <tbody>

                        {filteredPayrolls.map(
                            (payroll) => (

                                <tr key={payroll.id}>

                                    <td>
                                        {payroll.id}
                                    </td>


                                    <td>

                                        <strong>
                                            {getEmployeeName(
                                                payroll.employeeId
                                            )}
                                        </strong>

                                        <br />

                                        <small>
                                            ID: {payroll.employeeId}
                                        </small>

                                    </td>


                                    <td>
                                        {payroll.month}
                                    </td>


                                    <td>
                                        {payroll.year}
                                    </td>


                                    <td>
                                        {formatCurrency(
                                            payroll.basicSalary
                                        )}
                                    </td>


                                    <td>
                                        {formatCurrency(
                                            payroll.deductions
                                        )}
                                    </td>


                                    <td>
                                        {formatCurrency(
                                            payroll.netSalary
                                        )}
                                    </td>


                                    <td>

                                        <button
                                            onClick={() =>
                                                handleEdit(
                                                    payroll
                                                )
                                            }
                                        >
                                            ✏️ Edit
                                        </button>


                                        <button
                                            onClick={() =>
                                                handleDelete(
                                                    payroll.id
                                                )
                                            }
                                        >
                                            🗑️ Delete
                                        </button>


                                        <button
                                            onClick={() =>
                                                window.location.hash =
                                                    `/payslips`
                                            }
                                        >
                                            📄 Payslip
                                        </button>

                                    </td>

                                </tr>

                            )
                        )}

                        </tbody>

                    </table>

                </div>

            )}

        </div>

    )
}

export default Payroll