package com.payroll.employee.payroll.repository;

import com.payroll.employee.payroll.Payroll;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PayrollRepository extends JpaRepository<Payroll, Long> {

    boolean existsByEmployeeIdAndMonthAndYear(
            Long employeeId,
            int month,
            int year
    );

    boolean existsByEmployeeIdAndMonthAndYearAndIdNot(
            Long employeeId,
            int month,
            int year,
            Long id
    );
}