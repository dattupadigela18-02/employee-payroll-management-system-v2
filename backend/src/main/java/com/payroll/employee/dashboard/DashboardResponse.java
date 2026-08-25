package com.payroll.employee.dashboard;

public class DashboardResponse {

    private long totalEmployees;
    private long totalAttendance;
    private long totalLeaveRequests;
    private double totalPayroll;

    public long getTotalEmployees() {
        return totalEmployees;
    }

    public void setTotalEmployees(long totalEmployees) {
        this.totalEmployees = totalEmployees;
    }

    public long getTotalAttendance() {
        return totalAttendance;
    }

    public void setTotalAttendance(long totalAttendance) {
        this.totalAttendance = totalAttendance;
    }

    public long getTotalLeaveRequests() {
        return totalLeaveRequests;
    }

    public void setTotalLeaveRequests(long totalLeaveRequests) {
        this.totalLeaveRequests = totalLeaveRequests;
    }

    public double getTotalPayroll() {
        return totalPayroll;
    }

    public void setTotalPayroll(double totalPayroll) {
        this.totalPayroll = totalPayroll;
    }
}