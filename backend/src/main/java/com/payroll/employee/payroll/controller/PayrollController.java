package com.payroll.employee.payroll.controller;

import com.payroll.employee.entity.Employee;
import com.payroll.employee.payroll.Payroll;
import com.payroll.employee.payroll.pdf.PayslipPdfService;
import com.payroll.employee.payroll.service.PayrollService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/payroll")
@CrossOrigin(origins = "http://localhost:5173")
public class PayrollController {

    private final PayrollService payrollService;
    private final PayslipPdfService payslipPdfService;

    public PayrollController(
            PayrollService payrollService,
            PayslipPdfService payslipPdfService) {

        this.payrollService = payrollService;
        this.payslipPdfService = payslipPdfService;
    }

    // Add payroll
    @PostMapping
    public Payroll addPayroll(@RequestBody Payroll payroll) {
        return payrollService.addPayroll(payroll);
    }

    // Get all payroll records
    @GetMapping
    public List<Payroll> getAllPayrolls() {
        return payrollService.getAllPayrolls();
    }

    // Get payroll by ID
    @GetMapping("/{id}")
    public Optional<Payroll> getPayrollById(
            @PathVariable Long id) {

        return payrollService.getPayrollById(id);
    }

    // Update payroll
    @PutMapping("/{id}")
    public Payroll updatePayroll(
            @PathVariable Long id,
            @RequestBody Payroll payroll) {

        return payrollService.updatePayroll(id, payroll);
    }

    // Delete payroll
    @DeleteMapping("/{id}")
    public String deletePayroll(
            @PathVariable Long id) {

        payrollService.deletePayroll(id);

        return "Payroll deleted successfully";
    }

    // Generate payslip PDF
    @GetMapping("/{id}/payslip")
    public ResponseEntity<byte[]> generatePayslip(
            @PathVariable Long id) {

        Payroll payroll = payrollService
                .getPayrollById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Payroll record not found"));

        Employee employee = payrollService
                .getEmployeeForPayroll(
                        payroll.getEmployeeId());

        byte[] pdf = payslipPdfService
                .generatePayslip(payroll, employee);

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=payslip-"
                                + id
                                + ".pdf"
                )
                .contentType(
                        MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}