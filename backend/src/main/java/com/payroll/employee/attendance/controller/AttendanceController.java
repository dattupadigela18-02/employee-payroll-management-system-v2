package com.payroll.employee.attendance.controller;

import com.payroll.employee.attendance.Attendance;
import com.payroll.employee.attendance.service.AttendanceService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(origins = "http://localhost:5173")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    // Add attendance
    @PostMapping
    public Attendance addAttendance(@RequestBody Attendance attendance) {
        return attendanceService.addAttendance(attendance);
    }

    // Get all attendance records
    @GetMapping
    public List<Attendance> getAllAttendance() {
        return attendanceService.getAllAttendance();
    }

    // Get attendance by ID
    @GetMapping("/{id}")
    public Optional<Attendance> getAttendanceById(@PathVariable Long id) {
        return attendanceService.getAttendanceById(id);
    }

    // Update attendance
    @PutMapping("/{id}")
    public Attendance updateAttendance(
            @PathVariable Long id,
            @RequestBody Attendance attendance) {

        return attendanceService.updateAttendance(id, attendance);
    }

    // Delete attendance
    @DeleteMapping("/{id}")
    public String deleteAttendance(@PathVariable Long id) {
        attendanceService.deleteAttendance(id);
        return "Attendance deleted successfully";
    }
}