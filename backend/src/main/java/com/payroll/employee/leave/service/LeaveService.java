package com.payroll.employee.leave.service;

import com.payroll.employee.leave.Leave;
import com.payroll.employee.leave.repository.LeaveRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LeaveService {

    private final LeaveRepository leaveRepository;

    public LeaveService(LeaveRepository leaveRepository) {
        this.leaveRepository = leaveRepository;
    }

    // Add leave
    public Leave addLeave(Leave leave) {
        return leaveRepository.save(leave);
    }

    // Get all leaves
    public List<Leave> getAllLeaves() {
        return leaveRepository.findAll();
    }

    // Get leave by ID
    public Optional<Leave> getLeaveById(Long id) {
        return leaveRepository.findById(id);
    }

    // Update leave
    public Leave updateLeave(Long id, Leave updatedLeave) {

        Leave existingLeave = leaveRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Leave record not found"));

        existingLeave.setEmployeeId(updatedLeave.getEmployeeId());
        existingLeave.setStartDate(updatedLeave.getStartDate());
        existingLeave.setEndDate(updatedLeave.getEndDate());
        existingLeave.setLeaveType(updatedLeave.getLeaveType());
        existingLeave.setStatus(updatedLeave.getStatus());
        existingLeave.setReason(updatedLeave.getReason());

        return leaveRepository.save(existingLeave);
    }

    // Delete leave
    public void deleteLeave(Long id) {
        leaveRepository.deleteById(id);
    }
}