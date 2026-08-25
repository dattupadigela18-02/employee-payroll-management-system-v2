package com.payroll.employee.attendance.repository;

import com.payroll.employee.attendance.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
}
