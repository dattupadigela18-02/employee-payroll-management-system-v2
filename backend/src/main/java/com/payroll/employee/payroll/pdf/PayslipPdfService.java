package com.payroll.employee.payroll.pdf;

import com.payroll.employee.entity.Employee;
import com.payroll.employee.payroll.Payroll;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.UnitValue;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.Locale;

@Service
public class PayslipPdfService {

    public byte[] generatePayslip(Payroll payroll, Employee employee) {

        ByteArrayOutputStream outputStream =
                new ByteArrayOutputStream();

        PdfWriter writer =
                new PdfWriter(outputStream);

        PdfDocument pdfDocument =
                new PdfDocument(writer);

        Document document =
                new Document(pdfDocument);

        // ==========================================
        // TITLE
        // ==========================================

        Paragraph title =
                new Paragraph("EMPLOYEE PAYSLIP")
                        .simulateBold()
                        .setFontSize(20);

        document.add(title);

        document.add(new Paragraph(" "));


        // ==========================================
        // EMPLOYEE INFORMATION
        // ==========================================

        document.add(
                new Paragraph("EMPLOYEE INFORMATION")
                        .simulateBold()
                        .setFontSize(14)
        );

        document.add(
                new Paragraph(
                        "Employee ID: " + employee.getId()
                )
        );

        document.add(
                new Paragraph(
                        "Employee Name: "
                                + employee.getFirstName()
                                + " "
                                + employee.getLastName()
                )
        );

        document.add(
                new Paragraph(
                        "Department: " + employee.getDepartment()
                )
        );

        document.add(
                new Paragraph(
                        "Role: " + employee.getRole()
                )
        );

        document.add(
                new Paragraph(
                        "Email: " + employee.getEmail()
                )
        );

        document.add(new Paragraph(" "));


        // ==========================================
        // PAYROLL INFORMATION
        // ==========================================

        document.add(
                new Paragraph("PAYROLL INFORMATION")
                        .simulateBold()
                        .setFontSize(14)
        );

        document.add(
                new Paragraph(
                        "Month: "
                                + payroll.getMonth()
                                + " / "
                                + payroll.getYear()
                )
        );

        document.add(new Paragraph(" "));


        // ==========================================
        // SALARY AND ATTENDANCE TABLE
        // ==========================================

        Table table =
                new Table(
                        UnitValue.createPercentArray(
                                new float[]{50, 50}
                        )
                ).useAllAvailableWidth();


        table.addCell("Salary / Attendance");
        table.addCell("Value");


        // Basic Salary
        table.addCell("Basic Salary");

        table.addCell(
                formatCurrency(payroll.getBasicSalary())
        );


        // Working Days
        table.addCell("Working Days");

        table.addCell(
                String.valueOf(
                        payroll.getWorkingDays()
                )
        );


        // Present Days
        table.addCell("Present Days");

        table.addCell(
                String.valueOf(
                        payroll.getPresentDays()
                )
        );


        // Leave Days
        table.addCell("Leave Days");

        table.addCell(
                String.valueOf(
                        payroll.getLeaveDays()
                )
        );


        // Deductions
        table.addCell("Deductions");

        table.addCell(
                formatCurrency(
                        payroll.getDeductions()
                )
        );


        // Net Salary
        table.addCell("Net Salary");

        table.addCell(
                formatCurrency(
                        payroll.getNetSalary()
                )
        );


        document.add(table);

        document.add(new Paragraph(" "));


        // ==========================================
        // FINAL MESSAGE
        // ==========================================

        document.add(
                new Paragraph("Thank you.")
        );


        // Close PDF
        document.close();


        return outputStream.toByteArray();
    }


    // ==========================================
    // CURRENCY FORMATTER
    // ==========================================

    private String formatCurrency(double amount) {

        return String.format(
                Locale.US,
                "₹%,.2f",
                amount
        );
    }
}