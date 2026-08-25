package com.payroll.employee.leave.repository;

import com.payroll.employee.leave.Leave;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LeaveRepository extends JpaRepository<Leave, Long> {
}