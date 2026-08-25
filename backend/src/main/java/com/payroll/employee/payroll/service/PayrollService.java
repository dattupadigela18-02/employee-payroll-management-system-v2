package com.payroll.employee.payroll.service;

import com.payroll.employee.entity.Employee;
import com.payroll.employee.payroll.Payroll;
import com.payroll.employee.payroll.repository.PayrollRepository;
import com.payroll.employee.repository.EmployeeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PayrollService {

    private final PayrollRepository payrollRepository;
    private final EmployeeRepository employeeRepository;

    public PayrollService(
            PayrollRepository payrollRepository,
            EmployeeRepository employeeRepository) {

        this.payrollRepository = payrollRepository;
        this.employeeRepository = employeeRepository;
    }

    // ==========================================
    // CALCULATE PAYROLL
    // ==========================================

    private void calculatePayroll(Payroll payroll) {

        int workingDays = payroll.getWorkingDays();
        int presentDays = payroll.getPresentDays();

        double basicSalary = payroll.getBasicSalary();
        double deductions = payroll.getDeductions();

        // Calculate leave days automatically
        int leaveDays = workingDays - presentDays;

        // Prevent negative leave days
        if (leaveDays < 0) {
            leaveDays = 0;
        }

        payroll.setLeaveDays(leaveDays);

        // Calculate payable salary based on attendance
        double payableSalary = basicSalary;

        if (workingDays > 0 && presentDays >= 0) {

            payableSalary =
                    (basicSalary / workingDays) * presentDays;
        }

        // Calculate final net salary
        double netSalary =
                payableSalary - deductions;

        // Prevent negative salary
        if (netSalary < 0) {
            netSalary = 0;
        }

        payroll.setNetSalary(netSalary);
    }


    // ==========================================
    // ADD PAYROLL
    // ==========================================

    public Payroll addPayroll(Payroll payroll) {

        // Check whether employee exists
        employeeRepository
                .findById(payroll.getEmployeeId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Employee not found"));

        // Validate working days
        if (payroll.getWorkingDays() < 0) {

            throw new RuntimeException(
                    "Working days cannot be negative");
        }

        // Validate present days
        if (payroll.getPresentDays() < 0) {

            throw new RuntimeException(
                    "Present days cannot be negative");
        }

        // Present days cannot exceed working days
        if (payroll.getPresentDays()
                > payroll.getWorkingDays()) {

            throw new RuntimeException(
                    "Present days cannot exceed working days");
        }

        // ==========================================
        // PREVENT DUPLICATE PAYROLL
        // ==========================================

        boolean payrollExists =
                payrollRepository.existsByEmployeeIdAndMonthAndYear(
                        payroll.getEmployeeId(),
                        payroll.getMonth(),
                        payroll.getYear()
                );

        if (payrollExists) {

            throw new RuntimeException(
                    "Payroll already exists for this employee for the selected month and year"
            );
        }

        // Calculate payroll
        calculatePayroll(payroll);

        // Save payroll
        return payrollRepository.save(payroll);
    }


    // ==========================================
    // GET ALL PAYROLL RECORDS
    // ==========================================

    public List<Payroll> getAllPayrolls() {

        return payrollRepository.findAll();
    }


    // ==========================================
    // GET PAYROLL BY ID
    // ==========================================

    public Optional<Payroll> getPayrollById(Long id) {

        return payrollRepository.findById(id);
    }


    // ==========================================
    // UPDATE PAYROLL
    // ==========================================

    public Payroll updatePayroll(
            Long id,
            Payroll updatedPayroll) {

        Payroll existingPayroll =
                payrollRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Payroll record not found"));

        // Check employee exists
        employeeRepository
                .findById(updatedPayroll.getEmployeeId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Employee not found"));

        // Validate working days
        if (updatedPayroll.getWorkingDays() < 0) {

            throw new RuntimeException(
                    "Working days cannot be negative");
        }

        // Validate present days
        if (updatedPayroll.getPresentDays() < 0) {

            throw new RuntimeException(
                    "Present days cannot be negative");
        }

        // Present days cannot exceed working days
        if (updatedPayroll.getPresentDays()
                > updatedPayroll.getWorkingDays()) {

            throw new RuntimeException(
                    "Present days cannot exceed working days");
        }

        // ==========================================
        // PREVENT DUPLICATE DURING UPDATE
        // ==========================================

        boolean payrollExists =
                payrollRepository.existsByEmployeeIdAndMonthAndYearAndIdNot(
                        updatedPayroll.getEmployeeId(),
                        updatedPayroll.getMonth(),
                        updatedPayroll.getYear(),
                        id
                );

        if (payrollExists) {

            throw new RuntimeException(
                    "Payroll already exists for this employee for the selected month and year"
            );
        }

        // Update fields
        existingPayroll.setEmployeeId(
                updatedPayroll.getEmployeeId());

        existingPayroll.setMonth(
                updatedPayroll.getMonth());

        existingPayroll.setYear(
                updatedPayroll.getYear());

        existingPayroll.setBasicSalary(
                updatedPayroll.getBasicSalary());

        existingPayroll.setWorkingDays(
                updatedPayroll.getWorkingDays());

        existingPayroll.setPresentDays(
                updatedPayroll.getPresentDays());

        existingPayroll.setDeductions(
                updatedPayroll.getDeductions());

        // Recalculate leave days and net salary
        calculatePayroll(existingPayroll);

        return payrollRepository.save(existingPayroll);
    }


    // ==========================================
    // DELETE PAYROLL
    // ==========================================

    public void deletePayroll(Long id) {

        if (!payrollRepository.existsById(id)) {

            throw new RuntimeException(
                    "Payroll record not found");
        }

        payrollRepository.deleteById(id);
    }


    // ==========================================
    // GET EMPLOYEE DETAILS
    // ==========================================

    public Employee getEmployeeForPayroll(
            Long employeeId) {

        return employeeRepository
                .findById(employeeId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Employee not found"));
    }
}