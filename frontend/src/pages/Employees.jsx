import { useEffect, useState } from 'react'

function Employees({ openAddForm = false, setOpenAddForm }) {

    const [employees, setEmployees] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [showForm, setShowForm] = useState(false)

    const [editingId, setEditingId] = useState(null)

    // =========================================
    // SEARCH AND FILTER
    // =========================================

    const [searchTerm, setSearchTerm] = useState('')
    const [departmentFilter, setDepartmentFilter] = useState('')


    // =========================================
    // FORM DATA
    // =========================================

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        department: '',
        role: '',
        email: '',
        phone: '',
        salary: '',
        joiningDate: ''
    })


    // =========================================
    // GET ALL EMPLOYEES
    // =========================================

    const fetchEmployees = () => {

        setLoading(true)

        fetch('http://localhost:8080/api/employees')

            .then((response) => {

                if (!response.ok) {
                    throw new Error('Failed to fetch employees')
                }

                return response.json()
            })

            .then((data) => {

                setEmployees(data)

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
    // LOAD EMPLOYEES
    // =========================================

    useEffect(() => {

        fetchEmployees()

    }, [])


    // =========================================
    // OPEN FORM FROM DASHBOARD
    // =========================================

    useEffect(() => {
        if (openAddForm) {
            setEditingId(null)

            setFormData({
                firstName: '',
                lastName: '',
                department: '',
                role: '',
                email: '',
                phone: '',
                salary: '',
                joiningDate: ''
            })

            setShowForm(true)

            if (setOpenAddForm) {
                setOpenAddForm(false)
            }
        }
    }, [openAddForm, setOpenAddForm])


    // =========================================
    // HANDLE INPUT CHANGES
    // =========================================

    const handleChange = (event) => {

        const { name, value } = event.target

        setFormData({

            ...formData,

            [name]: value

        })
    }


    // =========================================
    // ADD / UPDATE EMPLOYEE
    // =========================================

    const handleSubmit = (event) => {

        event.preventDefault()

        const url = editingId

            ? `http://localhost:8080/api/employees/${editingId}`

            : 'http://localhost:8080/api/employees'


        const method = editingId ? 'PUT' : 'POST'


        fetch(url, {

            method: method,

            headers: {

                'Content-Type': 'application/json'

            },

            body: JSON.stringify({

                ...formData,

                salary: Number(formData.salary)

            })

        })

            .then((response) => {

                if (!response.ok) {

                    throw new Error(

                        editingId

                            ? 'Failed to update employee'

                            : 'Failed to add employee'

                    )

                }

                return response.json()

            })

            .then(() => {

                alert(

                    editingId

                        ? 'Employee updated successfully!'

                        : 'Employee added successfully!'

                )

                resetForm()

                fetchEmployees()

            })

            .catch((error) => {

                console.error(error)

                alert(

                    editingId

                        ? 'Failed to update employee'

                        : 'Failed to add employee'

                )

            })
    }


    // =========================================
    // EDIT EMPLOYEE
    // =========================================

    const handleEdit = (employee) => {

        setEditingId(employee.id)

        setFormData({

            firstName: employee.firstName || '',

            lastName: employee.lastName || '',

            department: employee.department || '',

            role: employee.role || '',

            email: employee.email || '',

            phone: employee.phone || '',

            salary: employee.salary || '',

            joiningDate: employee.joiningDate || ''

        })

        setShowForm(true)
    }


    // =========================================
    // DELETE EMPLOYEE
    // =========================================

    const handleDelete = (id) => {

        const confirmed = window.confirm(

            'Are you sure you want to delete this employee?'

        )

        if (!confirmed) {

            return

        }


        fetch(

            `http://hocalhost:8080/api/employees/${id}`,

            {

                method: 'DELETE'

            }

        )

            .then((response) => {

                if (!response.ok) {

                    throw new Error('Failed to delete employee')

                }

                return response.text()

            })

            .then(() => {

                alert('Employee deleted successfully!')

                fetchEmployees()

            })

            .catch((error) => {

                console.error(error)

                alert('Failed to delete employee')

            })
    }


    // =========================================
    // RESET FORM
    // =========================================

    const resetForm = () => {

        setFormData({

            firstName: '',
            lastName: '',
            department: '',
            role: '',
            email: '',
            phone: '',
            salary: '',
            joiningDate: ''

        })

        setEditingId(null)

        setShowForm(false)
    }


    // =========================================
    // GET UNIQUE DEPARTMENTS
    // =========================================

    const departments = [

        ...new Set(

            employees

                .map((employee) => employee.department)

                .filter((department) => department)

        )

    ]


    // =========================================
    // FILTER EMPLOYEES
    // =========================================

    const filteredEmployees = employees.filter((employee) => {

        const search = searchTerm.toLowerCase().trim()


        const matchesSearch =

            employee.firstName?.toLowerCase().includes(search) ||

            employee.lastName?.toLowerCase().includes(search) ||

            employee.email?.toLowerCase().includes(search) ||

            employee.role?.toLowerCase().includes(search)


        const matchesDepartment =

            departmentFilter === '' ||

            employee.department === departmentFilter


        return matchesSearch && matchesDepartment

    })


    // =========================================
    // RENDER
    // =========================================

    return (

        <div className="employee-page">


            {/* =================================
                HEADER
            ================================= */}

            <div className="employee-header">

                <div>

                    <h1>
                        Employees
                    </h1>

                    <p>
                        Manage employee information
                    </p>

                </div>


                <button

                    className="add-button"

                    onClick={() => {

                        if (
                            showForm &&
                            editingId === null
                        ) {

                            resetForm()

                        } else {

                            setEditingId(null)

                            setFormData({

                                firstName: '',
                                lastName: '',
                                department: '',
                                role: '',
                                email: '',
                                phone: '',
                                salary: '',
                                joiningDate: ''

                            })

                            setShowForm(true)

                        }

                    }}

                >

                    ➕ Add Employee

                </button>

            </div>


            {/* =================================
                ADD / EDIT FORM
            ================================= */}

            {showForm && (

                <div className="employee-form">

                    <h2>

                        {editingId

                            ? 'Edit Employee'

                            : 'Add New Employee'

                        }

                    </h2>


                    <form onSubmit={handleSubmit}>

                        <div className="form-grid">


                            {/* First Name */}

                            <div className="form-group">

                                <label>
                                    First Name
                                </label>

                                <input

                                    type="text"

                                    name="firstName"

                                    value={formData.firstName}

                                    onChange={handleChange}

                                    required

                                />

                            </div>


                            {/* Last Name */}

                            <div className="form-group">

                                <label>
                                    Last Name
                                </label>

                                <input

                                    type="text"

                                    name="lastName"

                                    value={formData.lastName}

                                    onChange={handleChange}

                                    required

                                />

                            </div>


                            {/* Department */}

                            <div className="form-group">

                                <label>
                                    Department
                                </label>

                                <input

                                    type="text"

                                    name="department"

                                    value={formData.department}

                                    onChange={handleChange}

                                    required

                                />

                            </div>


                            {/* Role */}

                            <div className="form-group">

                                <label>
                                    Role
                                </label>

                                <input

                                    type="text"

                                    name="role"

                                    value={formData.role}

                                    onChange={handleChange}

                                    required

                                />

                            </div>


                            {/* Email */}

                            <div className="form-group">

                                <label>
                                    Email
                                </label>

                                <input

                                    type="email"

                                    name="email"

                                    value={formData.email}

                                    onChange={handleChange}

                                    required

                                />

                            </div>


                            {/* Phone */}

                            <div className="form-group">

                                <label>
                                    Phone
                                </label>

                                <input

                                    type="text"

                                    name="phone"

                                    value={formData.phone}

                                    onChange={handleChange}

                                    required

                                />

                            </div>


                            {/* Salary */}

                            <div className="form-group">

                                <label>
                                    Salary
                                </label>

                                <input

                                    type="number"

                                    name="salary"

                                    value={formData.salary}

                                    onChange={handleChange}

                                    required

                                />

                            </div>


                            {/* Joining Date */}

                            <div className="form-group">

                                <label>
                                    Joining Date
                                </label>

                                <input

                                    type="date"

                                    name="joiningDate"

                                    value={formData.joiningDate}

                                    onChange={handleChange}

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

                                    ? ' Update Employee'

                                    : ' Save Employee'

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
                    Loading employees...
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
                SEARCH AND FILTER
            ================================= */}

            {!loading && !error && (

                <div
                    className="employee-filters"
                    style={{
                        display: 'flex',
                        gap: '15px',
                        marginBottom: '20px',
                        flexWrap: 'wrap'
                    }}
                >

                    {/* Search */}

                    <input

                        type="text"

                        placeholder="🔍 Search by name, email or role..."

                        value={searchTerm}

                        onChange={(event) =>
                            setSearchTerm(event.target.value)
                        }

                        style={{
                            flex: '1',
                            minWidth: '250px',
                            padding: '12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '8px'
                        }}

                    />


                    {/* Department Filter */}

                    <select

                        value={departmentFilter}

                        onChange={(event) =>
                            setDepartmentFilter(event.target.value)
                        }

                        style={{
                            minWidth: '200px',
                            padding: '12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '8px'
                        }}

                    >

                        <option value="">
                            All Departments
                        </option>


                        {departments.map((department) => (

                            <option
                                key={department}
                                value={department}
                            >
                                {department}
                            </option>

                        ))}

                    </select>


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
                        {filteredEmployees.length}
                    </strong>

                    {' '}of{' '}

                    <strong>
                        {employees.length}
                    </strong>

                    {' '}employees

                </p>

            )}


            {/* =================================
                EMPLOYEE TABLE
            ================================= */}

            {!loading && !error && (

                <div className="employee-table-container">

                    <table className="employee-table">


                        {/* Table Header */}

                        <thead>

                        <tr>

                            <th>ID</th>

                            <th>First Name</th>

                            <th>Last Name</th>

                            <th>Department</th>

                            <th>Role</th>

                            <th>Email</th>

                            <th>Phone</th>

                            <th>Salary</th>

                            <th>Joining Date</th>

                            <th>Action</th>

                        </tr>

                        </thead>


                        {/* Table Body */}

                        <tbody>

                        {filteredEmployees.length > 0 ? (

                            filteredEmployees.map((employee) => (

                                <tr key={employee.id}>


                                    <td>
                                        {employee.id}
                                    </td>


                                    <td>
                                        {employee.firstName}
                                    </td>


                                    <td>
                                        {employee.lastName}
                                    </td>


                                    <td>
                                        {employee.department}
                                    </td>


                                    <td>
                                        {employee.role}
                                    </td>


                                    <td>
                                        {employee.email}
                                    </td>


                                    <td>
                                        {employee.phone}
                                    </td>


                                    <td>
                                        ₹{employee.salary}
                                    </td>


                                    <td>
                                        {employee.joiningDate}
                                    </td>


                                    {/* Actions */}

                                    <td>

                                        <button

                                            className="edit-button"

                                            onClick={() =>
                                                handleEdit(employee)
                                            }

                                        >

                                            ✏️ Edit

                                        </button>


                                        <button

                                            className="delete-button"

                                            onClick={() =>
                                                handleDelete(employee.id)
                                            }

                                        >

                                            🗑️ Delete

                                        </button>

                                    </td>


                                </tr>

                            ))

                        ) : (

                            <tr>

                                <td
                                    colSpan="10"
                                    style={{
                                        textAlign: 'center',
                                        padding: '30px'
                                    }}
                                >

                                    No employees found.

                                </td>

                            </tr>

                        )}

                        </tbody>


                    </table>

                </div>

            )}


        </div>

    )
}


export default Employees