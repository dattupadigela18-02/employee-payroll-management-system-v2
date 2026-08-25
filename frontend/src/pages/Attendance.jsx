import { useEffect, useState } from 'react'

function Attendance({ openAddForm = false, setOpenAddForm }) {

    const [attendance, setAttendance] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState(null)

    // =========================================
    // FORM DATA
    // =========================================

    const [formData, setFormData] = useState({
        employeeId: '',
        date: '',
        status: 'Present'
    })


    // =========================================
    // FILTER DATA
    // =========================================

    const [employeeFilter, setEmployeeFilter] = useState('')
    const [dateFilter, setDateFilter] = useState('')
    const [statusFilter, setStatusFilter] = useState('')


    // =========================================
    // GET ALL ATTENDANCE
    // =========================================

    const fetchAttendance = () => {

        setLoading(true)

        fetch('http://localhost:8080/api/attendance')

            .then((response) => {

                if (!response.ok) {
                    throw new Error('Failed to fetch attendance')
                }

                return response.json()
            })

            .then((data) => {

                setAttendance(data)

                setLoading(false)

                setError('')

            })

            .catch((error) => {

                console.error(error)

                setError('Unable to connect to backend')

                setLoading(false)

            })
    }


    // =========================================
    // LOAD ATTENDANCE
    // =========================================

    useEffect(() => {

        fetchAttendance()

    }, [])


    // =========================================
    // OPEN FORM FROM DASHBOARD
    // =========================================

    useEffect(() => {
        if (openAddForm) {
            setEditingId(null)

            setFormData({
                employeeId: '',
                date: '',
                status: 'Present'
            })

            setShowForm(true)

            if (setOpenAddForm) {
                setOpenAddForm(false)
            }
        }
    }, [openAddForm, setOpenAddForm])


    // =========================================
    // HANDLE INPUT
    // =========================================

    const handleChange = (event) => {

        const { name, value } = event.target

        setFormData({

            ...formData,

            [name]: value

        })

    }


    // =========================================
    // ADD / UPDATE ATTENDANCE
    // =========================================

    const handleSubmit = (event) => {

        event.preventDefault()

        const url = editingId

            ? `http://localhost:8080/api/attendance/${editingId}`

            : 'http://localhost:8080/api/attendance'


        const method = editingId ? 'PUT' : 'POST'


        fetch(url, {

            method: method,

            headers: {

                'Content-Type': 'application/json'

            },

            body: JSON.stringify({

                employeeId: Number(formData.employeeId),

                date: formData.date,

                status: formData.status

            })

        })

            .then((response) => {

                if (!response.ok) {

                    throw new Error(

                        editingId

                            ? 'Failed to update attendance'

                            : 'Failed to mark attendance'

                    )

                }

                return response.json()

            })

            .then(() => {

                alert(

                    editingId

                        ? 'Attendance updated successfully!'

                        : 'Attendance marked successfully!'

                )

                resetForm()

                fetchAttendance()

            })

            .catch((error) => {

                console.error(error)

                alert(

                    editingId

                        ? 'Failed to update attendance'

                        : 'Failed to mark attendance'

                )

            })

    }


    // =========================================
    // EDIT ATTENDANCE
    // =========================================

    const handleEdit = (record) => {

        setEditingId(record.id)

        setFormData({

            employeeId: record.employeeId || '',

            date: record.date || '',

            status: record.status || 'Present'

        })

        setShowForm(true)

    }


    // =========================================
    // DELETE ATTENDANCE
    // =========================================

    const handleDelete = (id) => {

        const confirmed = window.confirm(

            'Are you sure you want to delete this attendance record?'

        )

        if (!confirmed) {

            return

        }


        fetch(

            `http://localhost:8080/api/attendance/${id}`,

            {

                method: 'DELETE'

            }

        )

            .then((response) => {

                if (!response.ok) {

                    throw new Error('Failed to delete attendance')

                }

                return response.text()

            })

            .then(() => {

                alert('Attendance deleted successfully!')

                fetchAttendance()

            })

            .catch((error) => {

                console.error(error)

                alert('Failed to delete attendance')

            })

    }


    // =========================================
    // RESET FORM
    // =========================================

    const resetForm = () => {

        setFormData({

            employeeId: '',
            date: '',
            status: 'Present'

        })

        setEditingId(null)

        setShowForm(false)

    }


    // =========================================
    // CLEAR FILTERS
    // =========================================

    const clearFilters = () => {

        setEmployeeFilter('')

        setDateFilter('')

        setStatusFilter('')

    }


    // =========================================
    // FILTER ATTENDANCE
    // =========================================

    const filteredAttendance = attendance.filter((record) => {

        const matchesEmployee =

            employeeFilter === '' ||

            String(record.employeeId).includes(employeeFilter)


        const matchesDate =

            dateFilter === '' ||

            record.date === dateFilter


        const matchesStatus =

            statusFilter === '' ||

            record.status === statusFilter


        return (

            matchesEmployee &&

            matchesDate &&

            matchesStatus

        )

    })


    // =========================================
    // RENDER
    // =========================================

    return (

        <div className="attendance-page">


            {/* =================================
                HEADER
            ================================= */}

            <div className="employee-header">

                <div>

                    <h1>
                        Attendance
                    </h1>

                    <p>
                        Manage employee attendance records
                    </p>

                </div>


                <button

                    className="add-button"

                    onClick={() => {

                        if (showForm) {

                            resetForm()

                        } else {

                            setEditingId(null)

                            setFormData({

                                employeeId: '',
                                date: '',
                                status: 'Present'

                            })

                            setShowForm(true)

                        }

                    }}

                >

                    ➕ Mark Attendance

                </button>

            </div>


            {/* =================================
                ADD / EDIT FORM
            ================================= */}

            {showForm && (

                <div className="employee-form">

                    <h2>

                        {editingId

                            ? 'Edit Attendance'

                            : 'Mark Attendance'

                        }

                    </h2>


                    <form onSubmit={handleSubmit}>

                        <div className="form-grid">


                            {/* Employee ID */}

                            <div className="form-group">

                                <label>
                                    Employee ID
                                </label>

                                <input

                                    type="number"

                                    name="employeeId"

                                    value={formData.employeeId}

                                    onChange={handleChange}

                                    placeholder="Enter employee ID"

                                    required

                                />

                            </div>


                            {/* Date */}

                            <div className="form-group">

                                <label>
                                    Date
                                </label>

                                <input

                                    type="date"

                                    name="date"

                                    value={formData.date}

                                    onChange={handleChange}

                                    required

                                />

                            </div>


                            {/* Status */}

                            <div className="form-group">

                                <label>
                                    Status
                                </label>

                                <select

                                    name="status"

                                    value={formData.status}

                                    onChange={handleChange}

                                    required

                                >

                                    <option value="Present">
                                        Present
                                    </option>

                                    <option value="Absent">
                                        Absent
                                    </option>

                                    <option value="Leave">
                                        Leave
                                    </option>

                                </select>

                            </div>


                        </div>


                        {/* Form Buttons */}

                        <div className="form-buttons">

                            <button

                                type="submit"

                                className="save-button"

                            >

                                💾

                                {editingId

                                    ? ' Update Attendance'

                                    : ' Save Attendance'

                                }

                            </button>


                            <button

                                type="button"

                                className="cancel-button"

                                onClick={resetForm}

                            >

                                Cancel

                            </button>

                        </div>


                    </form>

                </div>

            )}


            {/* =================================
                LOADING
            ================================= */}

            {loading && (

                <p>
                    Loading attendance records...
                </p>

            )}


            {/* =================================
                ERROR
            ================================= */}

            {error && (

                <p>
                    {error}
                </p>

            )}


            {/* =================================
                FILTERS
            ================================= */}

            {!loading && !error && (

                <div

                    className="attendance-filters"

                    style={{

                        display: 'flex',

                        gap: '15px',

                        marginBottom: '20px',

                        flexWrap: 'wrap',

                        alignItems: 'center'

                    }}

                >


                    {/* Employee ID Filter */}

                    <input

                        type="number"

                        placeholder="🔍 Employee ID"

                        value={employeeFilter}

                        onChange={(event) =>

                            setEmployeeFilter(event.target.value)

                        }

                        style={{

                            padding: '12px',

                            minWidth: '160px',

                            border: '1px solid #d1d5db',

                            borderRadius: '8px'

                        }}

                    />


                    {/* Date Filter */}

                    <input

                        type="date"

                        value={dateFilter}

                        onChange={(event) =>

                            setDateFilter(event.target.value)

                        }

                        style={{

                            padding: '12px',

                            minWidth: '180px',

                            border: '1px solid #d1d5db',

                            borderRadius: '8px'

                        }}

                    />


                    {/* Status Filter */}

                    <select

                        value={statusFilter}

                        onChange={(event) =>

                            setStatusFilter(event.target.value)

                        }

                        style={{

                            padding: '12px',

                            minWidth: '160px',

                            border: '1px solid #d1d5db',

                            borderRadius: '8px'

                        }}

                    >

                        <option value="">
                            All Status
                        </option>

                        <option value="Present">
                            Present
                        </option>

                        <option value="Absent">
                            Absent
                        </option>

                        <option value="Leave">
                            Leave
                        </option>

                    </select>


                    {/* Clear Filters */}

                    <button

                        type="button"

                        onClick={clearFilters}

                        style={{

                            padding: '12px 18px',

                            border: 'none',

                            borderRadius: '8px',

                            cursor: 'pointer'

                        }}

                    >

                        ✖ Clear Filters

                    </button>


                </div>

            )}


            {/* =================================
                RESULT COUNT
            ================================= */}

            {!loading && !error && (

                <p

                    style={{

                        marginBottom: '15px',

                        color: '#6b7280'

                    }}

                >

                    Showing{' '}

                    <strong>
                        {filteredAttendance.length}
                    </strong>

                    {' '}of{' '}

                    <strong>
                        {attendance.length}
                    </strong>

                    {' '}attendance records

                </p>

            )}


            {/* =================================
                ATTENDANCE TABLE
            ================================= */}

            {!loading && !error && (

                <div className="employee-table-container">

                    <table className="employee-table">


                        {/* Table Header */}

                        <thead>

                        <tr>

                            <th>
                                ID
                            </th>

                            <th>
                                Employee ID
                            </th>

                            <th>
                                Date
                            </th>

                            <th>
                                Status
                            </th>

                            <th>
                                Action
                            </th>

                        </tr>

                        </thead>


                        {/* Table Body */}

                        <tbody>

                        {filteredAttendance.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="5"
                                    style={{
                                        textAlign: 'center',
                                        padding: '30px'
                                    }}
                                >

                                    No attendance records found.

                                </td>

                            </tr>

                        ) : (

                            filteredAttendance.map((record) => (

                                <tr key={record.id}>


                                    <td>
                                        {record.id}
                                    </td>


                                    <td>
                                        {record.employeeId}
                                    </td>


                                    <td>
                                        {record.date}
                                    </td>


                                    <td>
                                        {record.status}
                                    </td>


                                    <td>

                                        <button

                                            className="edit-button"

                                            onClick={() =>
                                                handleEdit(record)
                                            }

                                        >

                                            ✏️ Edit

                                        </button>


                                        <button

                                            className="delete-button"

                                            onClick={() =>
                                                handleDelete(record.id)
                                            }

                                        >

                                            🗑️ Delete

                                        </button>

                                    </td>


                                </tr>

                            ))

                        )}

                        </tbody>


                    </table>

                </div>

            )}


        </div>

    )

}


export default Attendance