package com.payroll.employee.dashboard.service;

import com.payroll.employee.attendance.Attendance;
import com.payroll.employee.dashboard.DashboardResponse;
import com.payroll.employee.leave.Leave;
import com.payroll.employee.payroll.Payroll;
import com.payroll.employee.repository.EmployeeRepository;
import com.payroll.employee.attendance.repository.AttendanceRepository;
import com.payroll.employee.leave.repository.LeaveRepository;
import com.payroll.employee.payroll.repository.PayrollRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DashboardService {

    private final EmployeeRepository employeeRepository;
    private final AttendanceRepository attendanceRepository;
    private final LeaveRepository leaveRepository;
    private final PayrollRepository payrollRepository;

    public DashboardService(
            EmployeeRepository employeeRepository,
            AttendanceRepository attendanceRepository,
            LeaveRepository leaveRepository,
            PayrollRepository payrollRepository) {

        this.employeeRepository = employeeRepository;
        this.attendanceRepository = attendanceRepository;
        this.leaveRepository = leaveRepository;
        this.payrollRepository = payrollRepository;
    }

    public DashboardResponse getDashboardData() {

        DashboardResponse response = new DashboardResponse();

        // Total employees
        long totalEmployees = employeeRepository.count();

        // Total attendance records
        long totalAttendance = attendanceRepository.count();

        // Total leave requests
        long totalLeaveRequests = leaveRepository.count();

        // Total payroll amount
        List<Payroll> payrollList = payrollRepository.findAll();

        double totalPayroll = 0;

        for (Payroll payroll : payrollList) {
            totalPayroll += payroll.getNetSalary();
        }

        response.setTotalEmployees(totalEmployees);
        response.setTotalAttendance(totalAttendance);
        response.setTotalLeaveRequests(totalLeaveRequests);
        response.setTotalPayroll(totalPayroll);

        return response;
    }
}