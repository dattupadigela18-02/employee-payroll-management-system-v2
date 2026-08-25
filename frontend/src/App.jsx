import { useEffect, useState } from 'react'
import './App.css'

import Employees from './pages/Employees'
import Attendance from './pages/Attendance'
import Leave from './pages/Leave'
import Payroll from './pages/Payroll'
import Payslips from './pages/Payslips'


function App() {

    // ==========================================
    // CURRENT PAGE
    // ==========================================

    const [page, setPage] = useState('dashboard')


    // ==========================================
    // DASHBOARD DATA
    // ==========================================

    const [dashboard, setDashboard] = useState({
        totalEmployees: 0,
        totalAttendance: 0,
        totalLeaveRequests: 0,
        totalPayroll: 0
    })


    // ==========================================
    // LOADING / ERROR
    // ==========================================

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')


    // ==========================================
    // LOAD DASHBOARD DATA
    // ==========================================

    useEffect(() => {

        if (page !== 'dashboard') {
            return
        }

        setLoading(true)
        setError('')

        fetch('http://localhost:8080/api/dashboard')

            .then((response) => {

                if (!response.ok) {
                    throw new Error(
                        'Failed to fetch dashboard data'
                    )
                }

                return response.json()
            })

            .then((data) => {

                setDashboard(data)
                setLoading(false)

            })

            .catch((error) => {

                console.error(error)

                setError(
                    'Unable to connect to backend'
                )

                setLoading(false)
            })

    }, [page])


    // ==========================================
    // NAVIGATION FUNCTION
    // ==========================================

    const navigateTo = (newPage) => {

        setPage(newPage)

        if (newPage === 'dashboard') {
            setLoading(true)
            setError('')
        }
    }


    // ==========================================
    // RETURN
    // ==========================================

    return (

        <div className="dashboard">

            {/* ======================================
          SIDEBAR
      ====================================== */}

            <aside className="sidebar">

                <h2>
                    Employee Payroll
                </h2>


                <nav>

                    {/* Dashboard */}

                    <a
                        href="#"
                        className={
                            page === 'dashboard'
                                ? 'active'
                                : ''
                        }
                        onClick={(e) => {

                            e.preventDefault()

                            navigateTo('dashboard')

                        }}
                    >
                        📊 Dashboard
                    </a>


                    {/* Employees */}

                    <a
                        href="#"
                        className={
                            page === 'employees'
                                ? 'active'
                                : ''
                        }
                        onClick={(e) => {

                            e.preventDefault()

                            navigateTo('employees')

                        }}
                    >
                        👨‍💼 Employees
                    </a>


                    {/* Attendance */}

                    <a
                        href="#"
                        className={
                            page === 'attendance'
                                ? 'active'
                                : ''
                        }
                        onClick={(e) => {

                            e.preventDefault()

                            navigateTo('attendance')

                        }}
                    >
                        🕐 Attendance
                    </a>


                    {/* Leave */}

                    <a
                        href="#"
                        className={
                            page === 'leave'
                                ? 'active'
                                : ''
                        }
                        onClick={(e) => {

                            e.preventDefault()

                            navigateTo('leave')

                        }}
                    >
                        📝 Leave
                    </a>


                    {/* Payroll */}

                    <a
                        href="#"
                        className={
                            page === 'payroll'
                                ? 'active'
                                : ''
                        }
                        onClick={(e) => {

                            e.preventDefault()

                            navigateTo('payroll')

                        }}
                    >
                        💰 Payroll
                    </a>


                    {/* Payslips */}

                    <a
                        href="#"
                        className={
                            page === 'payslips'
                                ? 'active'
                                : ''
                        }
                        onClick={(e) => {

                            e.preventDefault()

                            navigateTo('payslips')

                        }}
                    >
                        📄 Payslips
                    </a>


                    {/* Logout */}

                    <a
                        href="#"
                        className="logout-link"
                        onClick={(e) => {

                            e.preventDefault()

                            alert('Logout functionality will be added later.')

                        }}
                    >
                        🚪 Logout
                    </a>

                </nav>

            </aside>


            {/* ======================================
          MAIN CONTENT
      ====================================== */}

            <main className="main-content">


                {/* ====================================
            DASHBOARD
        ==================================== */}

                {page === 'dashboard' && (

                    <>

                        {/* Header */}

                        <header className="header">

                            <div>

                                <h1>
                                    Dashboard
                                </h1>

                                <p>
                                    Employee Payroll Management System
                                </p>

                            </div>

                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px'
                                }}
                            >

                                <button
                                    onClick={() => {
                                        setLoading(true)
                                        setError('')

                                        fetch('http://localhost:8080/api/dashboard')
                                            .then((response) => {

                                                if (!response.ok) {
                                                    throw new Error(
                                                        'Failed to refresh dashboard'
                                                    )
                                                }

                                                return response.json()
                                            })

                                            .then((data) => {

                                                setDashboard(data)
                                                setLoading(false)

                                            })

                                            .catch((error) => {

                                                console.error(error)

                                                setError(
                                                    'Unable to refresh dashboard'
                                                )

                                                setLoading(false)

                                            })
                                    }}
                                    disabled={loading}
                                >
                                    {loading
                                        ? '🔄 Refreshing...'
                                        : '🔄 Refresh Dashboard'}
                                </button>

                                <div className="user">
                                    👤 Admin
                                </div>

                            </div>

                        </header>




                        {/* Loading */}

                        {loading && (

                            <div className="welcome">

                                <h2>
                                    Loading dashboard...
                                </h2>

                            </div>

                        )}


                        {/* Error */}

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
                                    onClick={() =>
                                        navigateTo('dashboard')
                                    }
                                >
                                    🔄 Retry
                                </button>

                            </div>

                        )}


                        {/* =================================
                DASHBOARD CARDS
            ================================= */}

                        {!loading && !error && (

                            <section className="cards">


                                {/* =================================
                    EMPLOYEES CARD
                ================================= */}

                                <div
                                    className="card"
                                    onClick={() =>
                                        navigateTo('employees')
                                    }
                                    style={{
                                        cursor: 'pointer'
                                    }}
                                    title="Open Employee Management"
                                >

                                    <div className="card-icon">
                                        👨‍💼
                                    </div>

                                    <div>

                                        <p>
                                            Total Employees
                                        </p>

                                        <h2>
                                            {dashboard.totalEmployees}
                                        </h2>

                                    </div>

                                </div>


                                {/* =================================
                    ATTENDANCE CARD
                ================================= */}

                                <div
                                    className="card"
                                    onClick={() =>
                                        navigateTo('attendance')
                                    }
                                    style={{
                                        cursor: 'pointer'
                                    }}
                                    title="Open Attendance Management"
                                >

                                    <div className="card-icon">
                                        🕐
                                    </div>

                                    <div>

                                        <p>
                                            Attendance Records
                                        </p>

                                        <h2>
                                            {dashboard.totalAttendance}
                                        </h2>

                                    </div>

                                </div>


                                {/* =================================
                    LEAVE CARD
                ================================= */}

                                <div
                                    className="card"
                                    onClick={() =>
                                        navigateTo('leave')
                                    }
                                    style={{
                                        cursor: 'pointer'
                                    }}
                                    title="Open Leave Management"
                                >

                                    <div className="card-icon">
                                        🏖️
                                    </div>

                                    <div>

                                        <p>
                                            Leave Requests
                                        </p>

                                        <h2>
                                            {dashboard.totalLeaveRequests}
                                        </h2>

                                    </div>

                                </div>


                                {/* =================================
                    PAYROLL CARD
                ================================= */}

                                <div
                                    className="card"
                                    onClick={() =>
                                        navigateTo('payroll')
                                    }
                                    style={{
                                        cursor: 'pointer'
                                    }}
                                    title="Open Payroll Management"
                                >

                                    <div className="card-icon">
                                        💰
                                    </div>

                                    <div>

                                        <p>
                                            Total Payroll
                                        </p>

                                        <h2>
                                            ₹
                                            {Number(
                                                dashboard.totalPayroll || 0
                                            ).toLocaleString('en-IN')}
                                        </h2>

                                    </div>

                                </div>

                            </section>

                        )}


                        {/* =================================
                WELCOME SECTION
            ================================= */}

                        <section className="welcome">

                            <h2>
                                Welcome to Employee Payroll Management
                            </h2>

                            <p>
                                Manage employees, attendance, leave,
                                payroll and payslips from one place.
                            </p>

                        </section>


                        {/* =================================
                QUICK ACTIONS
            ================================= */}

                        <section className="quick-section">

                            <h2>
                                Quick Actions
                            </h2>


                            <div className="quick-actions">


                                {/* Add Employee */}

                                <button
                                    onClick={() =>
                                        navigateTo('employees')
                                    }
                                >
                                    ➕ Add Employee
                                </button>


                                {/* Mark Attendance */}

                                <button
                                    onClick={() =>
                                        navigateTo('attendance')
                                    }
                                >
                                    🕐 Mark Attendance
                                </button>


                                {/* Apply Leave */}

                                <button
                                    onClick={() =>
                                        navigateTo('leave')
                                    }
                                >
                                    🏖️ Apply Leave
                                </button>


                                {/* Manage Payroll */}

                                <button
                                    onClick={() =>
                                        navigateTo('payroll')
                                    }
                                >
                                    💰 Manage Payroll
                                </button>


                                {/* View Payslips */}

                                <button
                                    onClick={() =>
                                        navigateTo('payslips')
                                    }
                                >
                                    📄 View Payslips
                                </button>

                            </div>

                        </section>

                    </>

                )}


                {/* ======================================
            EMPLOYEES PAGE
        ====================================== */}

                {page === 'employees' && (

                    <Employees />

                )}


                {/* ======================================
            ATTENDANCE PAGE
        ====================================== */}

                {page === 'attendance' && (

                    <Attendance />

                )}


                {/* ======================================
            LEAVE PAGE
        ====================================== */}

                {page === 'leave' && (

                    <Leave />

                )}


                {/* ======================================
            PAYROLL PAGE
        ====================================== */}

                {page === 'payroll' && (

                    <Payroll />

                )}


                {/* ======================================
            PAYSLIPS PAGE
        ====================================== */}

                {page === 'payslips' && (

                    <Payslips />

                )}

            </main>

        </div>

    )
}


export default App