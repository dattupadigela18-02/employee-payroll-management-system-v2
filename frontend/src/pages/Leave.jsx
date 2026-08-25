import { useEffect, useState } from 'react'

function Leave({ openAddForm = false, setOpenAddForm }) {

    const [leaves, setLeaves] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState(null)

    // =========================================
    // FORM DATA
    // =========================================

    const [formData, setFormData] = useState({
        employeeId: '',
        startDate: '',
        endDate: '',
        leaveType: 'Casual',
        status: 'Pending',
        reason: ''
    })


    // =========================================
    // FILTER DATA
    // =========================================

    const [employeeFilter, setEmployeeFilter] = useState('')
    const [startDateFilter, setStartDateFilter] = useState('')
    const [endDateFilter, setEndDateFilter] = useState('')
    const [leaveTypeFilter, setLeaveTypeFilter] = useState('')
    const [statusFilter, setStatusFilter] = useState('')


    // =========================================
    // GET ALL LEAVES
    // =========================================

    const fetchLeaves = () => {

        setLoading(true)

        fetch('http://localhost:8080/api/leaves')

            .then((response) => {

                if (!response.ok) {
                    throw new Error('Failed to fetch leave records')
                }

                return response.json()
            })

            .then((data) => {

                setLeaves(data)
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
    // LOAD LEAVES
    // =========================================

    useEffect(() => {

        fetchLeaves()

    }, [])


    // =========================================
    // OPEN FORM FROM DASHBOARD
    // =========================================

    useEffect(() => {
        if (openAddForm) {
            setEditingId(null)

            setFormData({
                employeeId: '',
                startDate: '',
                endDate: '',
                leaveType: 'Casual',
                status: 'Pending',
                reason: ''
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
    // ADD / UPDATE LEAVE
    // =========================================

    const handleSubmit = (event) => {

        event.preventDefault()

        const url = editingId

            ? `http://localhost:8080
/api/leaves/${editingId}`

            : 'http://localhost:8080/api/leaves'


        const method = editingId ? 'PUT' : 'POST'


        fetch(url, {

            method: method,

            headers: {

                'Content-Type': 'application/json'

            },

            body: JSON.stringify({

                employeeId: Number(formData.employeeId),

                startDate: formData.startDate,

                endDate: formData.endDate,

                leaveType: formData.leaveType,

                status: formData.status,

                reason: formData.reason

            })

        })

            .then((response) => {

                if (!response.ok) {

                    throw new Error(

                        editingId

                            ? 'Failed to update leave'

                            : 'Failed to apply leave'

                    )

                }

                return response.json()

            })

            .then(() => {

                alert(

                    editingId

                        ? 'Leave updated successfully!'

                        : 'Leave applied successfully!'

                )

                resetForm()
                fetchLeaves()

            })

            .catch((error) => {

                console.error(error)

                alert(

                    editingId

                        ? 'Failed to update leave'

                        : 'Failed to apply leave'

                )

            })

    }


    // =========================================
    // EDIT LEAVE
    // =========================================

    const handleEdit = (leave) => {

        setEditingId(leave.id)

        setFormData({

            employeeId: leave.employeeId || '',
            startDate: leave.startDate || '',
            endDate: leave.endDate || '',
            leaveType: leave.leaveType || 'Casual',
            status: leave.status || 'Pending',
            reason: leave.reason || ''

        })

        setShowForm(true)

    }


    // =========================================
    // DELETE LEAVE
    // =========================================

    const handleDelete = (id) => {

        const confirmed = window.confirm(
            'Are you sure you want to delete this leave request?'
        )

        if (!confirmed) {
            return
        }


        fetch(

            `http://localhost:8080
/api/leaves/${id}`,

            {
                method: 'DELETE'
            }

        )

            .then((response) => {

                if (!response.ok) {

                    throw new Error('Failed to delete leave')

                }

                return response.text()

            })

            .then(() => {

                alert('Leave deleted successfully!')

                fetchLeaves()

            })

            .catch((error) => {

                console.error(error)

                alert('Failed to delete leave')

            })

    }


    // =========================================
    // RESET FORM
    // =========================================

    const resetForm = () => {

        setFormData({

            employeeId: '',
            startDate: '',
            endDate: '',
            leaveType: 'Casual',
            status: 'Pending',
            reason: ''

        })

        setEditingId(null)
        setShowForm(false)

    }


    // =========================================
    // CLEAR FILTERS
    // =========================================

    const clearFilters = () => {

        setEmployeeFilter('')
        setStartDateFilter('')
        setEndDateFilter('')
        setLeaveTypeFilter('')
        setStatusFilter('')

    }


    // =========================================
    // FILTER LEAVE RECORDS
    // =========================================

    const filteredLeaves = leaves.filter((leave) => {

        const matchesEmployee =

            employeeFilter === '' ||

            String(leave.employeeId).includes(employeeFilter)


        const matchesStartDate =

            startDateFilter === '' ||

            leave.startDate >= startDateFilter


        const matchesEndDate =

            endDateFilter === '' ||

            leave.endDate <= endDateFilter


        const matchesLeaveType =

            leaveTypeFilter === '' ||

            leave.leaveType === leaveTypeFilter


        const matchesStatus =

            statusFilter === '' ||

            leave.status === statusFilter


        return (

            matchesEmployee &&

            matchesStartDate &&

            matchesEndDate &&

            matchesLeaveType &&

            matchesStatus

        )

    })


    // =========================================
    // RENDER
    // =========================================

    return (

        <div className="leave-page">


            {/* =================================
                HEADER
            ================================= */}

            <div className="employee-header">

                <div>

                    <h1>
                        Leave Management
                    </h1>

                    <p>
                        Manage employee leave requests
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
                                startDate: '',
                                endDate: '',
                                leaveType: 'Casual',
                                status: 'Pending',
                                reason: ''

                            })

                            setShowForm(true)

                        }

                    }}

                >

                    ➕ Apply Leave

                </button>

            </div>


            {/* =================================
                ADD / EDIT FORM
            ================================= */}

            {showForm && (

                <div className="employee-form">

                    <h2>

                        {editingId
                            ? 'Edit Leave'
                            : 'Apply for Leave'}

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


                            {/* Start Date */}

                            <div className="form-group">

                                <label>
                                    Start Date
                                </label>

                                <input

                                    type="date"

                                    name="startDate"

                                    value={formData.startDate}

                                    onChange={handleChange}

                                    required

                                />

                            </div>


                            {/* End Date */}

                            <div className="form-group">

                                <label>
                                    End Date
                                </label>

                                <input

                                    type="date"

                                    name="endDate"

                                    value={formData.endDate}

                                    onChange={handleChange}

                                    required

                                />

                            </div>


                            {/* Leave Type */}

                            <div className="form-group">

                                <label>
                                    Leave Type
                                </label>

                                <select

                                    name="leaveType"

                                    value={formData.leaveType}

                                    onChange={handleChange}

                                    required

                                >

                                    <option value="Casual">
                                        Casual Leave
                                    </option>

                                    <option value="Sick">
                                        Sick Leave
                                    </option>

                                    <option value="Earned">
                                        Earned Leave
                                    </option>

                                    <option value="Other">
                                        Other
                                    </option>

                                </select>

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

                                    <option value="Pending">
                                        Pending
                                    </option>

                                    <option value="Approved">
                                        Approved
                                    </option>

                                    <option value="Rejected">
                                        Rejected
                                    </option>

                                </select>

                            </div>


                            {/* Reason */}

                            <div className="form-group">

                                <label>
                                    Reason
                                </label>

                                <textarea

                                    name="reason"

                                    value={formData.reason}

                                    onChange={handleChange}

                                    placeholder="Enter reason for leave"

                                    rows="4"

                                    required

                                />

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
                                    ? ' Update Leave'
                                    : ' Apply Leave'}

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
                    Loading leave records...
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

                    className="leave-filters"

                    style={{

                        display: 'flex',

                        gap: '15px',

                        marginBottom: '20px',

                        flexWrap: 'wrap',

                        alignItems: 'center'

                    }}

                >


                    {/* Employee ID */}

                    <input

                        type="number"

                        placeholder="🔍 Employee ID"

                        value={employeeFilter}

                        onChange={(event) =>

                            setEmployeeFilter(event.target.value)

                        }

                        style={{

                            padding: '12px',

                            minWidth: '150px',

                            border: '1px solid #d1d5db',

                            borderRadius: '8px'

                        }}

                    />


                    {/* Start Date */}

                    <input

                        type="date"

                        value={startDateFilter}

                        onChange={(event) =>

                            setStartDateFilter(event.target.value)

                        }

                        title="Filter by start date"

                        style={{

                            padding: '12px',

                            minWidth: '170px',

                            border: '1px solid #d1d5db',

                            borderRadius: '8px'

                        }}

                    />


                    {/* End Date */}

                    <input

                        type="date"

                        value={endDateFilter}

                        onChange={(event) =>

                            setEndDateFilter(event.target.value)

                        }

                        title="Filter by end date"

                        style={{

                            padding: '12px',

                            minWidth: '170px',

                            border: '1px solid #d1d5db',

                            borderRadius: '8px'

                        }}

                    />


                    {/* Leave Type */}

                    <select

                        value={leaveTypeFilter}

                        onChange={(event) =>

                            setLeaveTypeFilter(event.target.value)

                        }

                        style={{

                            padding: '12px',

                            minWidth: '160px',

                            border: '1px solid #d1d5db',

                            borderRadius: '8px'

                        }}

                    >

                        <option value="">
                            All Leave Types
                        </option>

                        <option value="Casual">
                            Casual Leave
                        </option>

                        <option value="Sick">
                            Sick Leave
                        </option>

                        <option value="Earned">
                            Earned Leave
                        </option>

                        <option value="Other">
                            Other
                        </option>

                    </select>


                    {/* Status */}

                    <select

                        value={statusFilter}

                        onChange={(event) =>

                            setStatusFilter(event.target.value)

                        }

                        style={{

                            padding: '12px',

                            minWidth: '150px',

                            border: '1px solid #d1d5db',

                            borderRadius: '8px'

                        }}

                    >

                        <option value="">
                            All Status
                        </option>

                        <option value="Pending">
                            Pending
                        </option>

                        <option value="Approved">
                            Approved
                        </option>

                        <option value="Rejected">
                            Rejected
                        </option>

                    </select>


                    {/* Clear */}

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
                        {filteredLeaves.length}
                    </strong>

                    {' '}of{' '}

                    <strong>
                        {leaves.length}
                    </strong>

                    {' '}leave records

                </p>

            )}


            {/* =================================
                LEAVE TABLE
            ================================= */}

            {!loading && !error && (

                <div className="employee-table-container">

                    <table className="employee-table">

                        <thead>

                        <tr>

                            <th>ID</th>

                            <th>Employee ID</th>

                            <th>Start Date</th>

                            <th>End Date</th>

                            <th>Leave Type</th>

                            <th>Status</th>

                            <th>Reason</th>

                            <th>Action</th>

                        </tr>

                        </thead>


                        <tbody>

                        {filteredLeaves.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="8"
                                    style={{
                                        textAlign: 'center',
                                        padding: '30px'
                                    }}
                                >

                                    No leave records found.

                                </td>

                            </tr>

                        ) : (

                            filteredLeaves.map((leave) => (

                                <tr key={leave.id}>

                                    <td>
                                        {leave.id}
                                    </td>

                                    <td>
                                        {leave.employeeId}
                                    </td>

                                    <td>
                                        {leave.startDate}
                                    </td>

                                    <td>
                                        {leave.endDate}
                                    </td>

                                    <td>
                                        {leave.leaveType}
                                    </td>

                                    <td>
                                        {leave.status}
                                    </td>

                                    <td>
                                        {leave.reason}
                                    </td>

                                    <td>

                                        <button

                                            className="edit-button"

                                            onClick={() =>
                                                handleEdit(leave)
                                            }

                                        >

                                            ✏️ Edit

                                        </button>


                                        <button

                                            className="delete-button"

                                            onClick={() =>
                                                handleDelete(leave.id)
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

export default Leave