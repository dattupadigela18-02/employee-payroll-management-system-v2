import { useEffect, useState } from 'react'

function Payslips() {

    // =========================================
    // PAYROLL DATA
    // =========================================

    const [payrolls, setPayrolls] = useState([])

    // =========================================
    // LOADING / ERROR
    // =========================================

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    // =========================================
    // FILTERS
    // =========================================

    const [searchEmployee, setSearchEmployee] = useState('')
    const [monthFilter, setMonthFilter] = useState('')
    const [yearFilter, setYearFilter] = useState('')

    // =========================================
    // DOWNLOAD STATE
    // =========================================

    const [downloadingId, setDownloadingId] = useState(null)


    // =========================================
    // LOAD PAYROLL RECORDS
    // =========================================

    const fetchPayrolls = () => {

        setLoading(true)
        setError('')

        fetch('http://localhost:8080/api/payroll')

            .then((response) => {

                if (!response.ok) {
                    throw new Error(
                        'Failed to fetch payroll records'
                    )
                }

                return response.json()
            })

            .then((data) => {

                setPayrolls(data)
                setLoading(false)

            })

            .catch((error) => {

                console.error(error)

                setError(
                    'Unable to connect to backend'
                )

                setLoading(false)
            })
    }


    // =========================================
    // INITIAL LOAD
    // =========================================

    useEffect(() => {

        fetchPayrolls()

    }, [])


    // =========================================
    // DOWNLOAD PAYSLIP
    // =========================================

    const downloadPayslip = async (id) => {

        try {

            setDownloadingId(id)

            const response = await fetch(
                `http://localhost:8080/api/payroll/${id}/payslip`
            )

            if (!response.ok) {

                throw new Error(
                    'Failed to download payslip'
                )
            }

            const blob = await response.blob()

            const url =
                window.URL.createObjectURL(blob)

            const link =
                document.createElement('a')

            link.href = url

            link.download =
                `payslip-${id}.pdf`

            document.body.appendChild(link)

            link.click()

            link.remove()

            window.URL.revokeObjectURL(url)

        }
        catch (error) {

            console.error(error)

            alert(
                'Unable to download payslip'
            )

        }
        finally {

            setDownloadingId(null)

        }
    }


    // =========================================
    // FILTER PAYROLLS
    // =========================================

    const filteredPayrolls =
        payrolls.filter((payroll) => {

            const employeeMatch =
                searchEmployee === '' ||
                String(
                    payroll.employeeId
                ).includes(searchEmployee)

            const monthMatch =
                monthFilter === '' ||
                String(
                    payroll.month
                ) === monthFilter

            const yearMatch =
                yearFilter === '' ||
                String(
                    payroll.year
                ) === yearFilter

            return (
                employeeMatch &&
                monthMatch &&
                yearMatch
            )
        })


    // =========================================
    // CLEAR FILTERS
    // =========================================

    const clearFilters = () => {

        setSearchEmployee('')
        setMonthFilter('')
        setYearFilter('')
    }


    // =========================================
    // FORMAT MONEY
    // =========================================

    const formatMoney = (value) => {

        return `₹${Number(
            value || 0
        ).toLocaleString('en-IN')}`
    }


    // =========================================
    // RETURN UI
    // =========================================

    return (

        <div>

            {/* =====================================
                HEADER
            ===================================== */}

            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px'
                }}
            >

                <div>

                    <h1>
                        Payslip Management
                    </h1>

                    <p>
                        View and download employee payslips
                    </p>

                </div>

            </div>


            {/* =====================================
                FILTER SECTION
            ===================================== */}

            <div
                style={{
                    display: 'flex',
                    gap: '12px',
                    flexWrap: 'wrap',
                    marginBottom: '20px'
                }}
            >

                {/* Employee Search */}

                <input
                    type="text"
                    placeholder="Search Employee ID"
                    value={searchEmployee}
                    onChange={(e) =>
                        setSearchEmployee(
                            e.target.value
                        )
                    }
                    style={{
                        padding: '10px',
                        minWidth: '180px'
                    }}
                />


                {/* Month */}

                <select
                    value={monthFilter}
                    onChange={(e) =>
                        setMonthFilter(
                            e.target.value
                        )
                    }
                    style={{
                        padding: '10px'
                    }}
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


                {/* Year */}

                <input
                    type="number"
                    placeholder="Year"
                    value={yearFilter}
                    onChange={(e) =>
                        setYearFilter(
                            e.target.value
                        )
                    }
                    style={{
                        padding: '10px',
                        width: '120px'
                    }}
                />


                {/* Clear */}

                <button
                    onClick={clearFilters}
                >
                    Clear Filters
                </button>

            </div>


            {/* =====================================
                LOADING
            ===================================== */}

            {loading && (

                <div className="welcome">

                    <h2>
                        Loading payslips...
                    </h2>

                </div>

            )}


            {/* =====================================
                ERROR
            ===================================== */}

            {error && (

                <div className="welcome">

                    <h2>
                        {error}
                    </h2>

                    <p>
                        Make sure your Spring Boot
                        application is running.
                    </p>

                    <button
                        onClick={fetchPayrolls}
                    >
                        🔄 Retry
                    </button>

                </div>

            )}


            {/* =====================================
                PAYSLIP TABLE
            ===================================== */}

            {!loading &&
                !error && (

                    <div className="employee-table">

                        <table>

                            <thead>

                            <tr>

                                <th>
                                    ID
                                </th>

                                <th>
                                    Employee ID
                                </th>

                                <th>
                                    Month
                                </th>

                                <th>
                                    Year
                                </th>

                                <th>
                                    Basic Salary
                                </th>

                                <th>
                                    Deductions
                                </th>

                                <th>
                                    Net Salary
                                </th>

                                <th>
                                    Action
                                </th>

                            </tr>

                            </thead>


                            <tbody>

                            {filteredPayrolls.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="8"
                                        style={{
                                            textAlign:
                                                'center',
                                            padding:
                                                '20px'
                                        }}
                                    >
                                        No payslips found
                                    </td>

                                </tr>

                            ) : (

                                filteredPayrolls.map(
                                    (payroll) => (

                                        <tr
                                            key={
                                                payroll.id
                                            }
                                        >

                                            <td>
                                                {
                                                    payroll.id
                                                }
                                            </td>


                                            <td>
                                                {
                                                    payroll.employeeId
                                                }
                                            </td>


                                            <td>
                                                {
                                                    payroll.month
                                                }
                                            </td>


                                            <td>
                                                {
                                                    payroll.year
                                                }
                                            </td>


                                            <td>
                                                {formatMoney(
                                                    payroll.basicSalary
                                                )}
                                            </td>


                                            <td>
                                                {formatMoney(
                                                    payroll.deductions
                                                )}
                                            </td>


                                            <td>
                                                {formatMoney(
                                                    payroll.netSalary
                                                )}
                                            </td>


                                            <td>

                                                <button
                                                    onClick={() =>
                                                        downloadPayslip(
                                                            payroll.id
                                                        )
                                                    }
                                                    disabled={
                                                        downloadingId ===
                                                        payroll.id
                                                    }
                                                >

                                                    {downloadingId ===
                                                    payroll.id
                                                        ? 'Downloading...'
                                                        : '📄 Download'}

                                                </button>

                                            </td>

                                        </tr>

                                    )
                                )

                            )}

                            </tbody>

                        </table>

                    </div>

                )}

        </div>

    )
}

export default Payslips