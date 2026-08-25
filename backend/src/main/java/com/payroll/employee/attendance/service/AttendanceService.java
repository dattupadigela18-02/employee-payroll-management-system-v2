package com.payroll.employee.attendance.service;

import com.payroll.employee.attendance.Attendance;
import com.payroll.employee.attendance.repository.AttendanceRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;

    public AttendanceService(AttendanceRepository attendanceRepository) {
        this.attendanceRepository = attendanceRepository;
    }

    // Add attendance
    public Attendance addAttendance(Attendance attendance) {
        return attendanceRepository.save(attendance);
    }

    // Get all attendance records
    public List<Attendance> getAllAttendance() {
        return attendanceRepository.findAll();
    }

    // Get attendance by ID
    public Optional<Attendance> getAttendanceById(Long id) {
        return attendanceRepository.findById(id);
    }

    // Update attendance
    public Attendance updateAttendance(Long id, Attendance updatedAttendance) {

        Attendance existingAttendance = attendanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Attendance record not found"));

        existingAttendance.setEmployeeId(updatedAttendance.getEmployeeId());
        existingAttendance.setDate(updatedAttendance.getDate());
        existingAttendance.setStatus(updatedAttendance.getStatus());

        return attendanceRepository.save(existingAttendance);
    }

    // Delete attendance
    public void deleteAttendance(Long id) {
        attendanceRepository.deleteById(id);
    }
}