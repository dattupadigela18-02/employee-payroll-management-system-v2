package com.payroll.employee.leave.controller;

import com.payroll.employee.leave.Leave;
import com.payroll.employee.leave.service.LeaveService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/leaves")
@CrossOrigin(origins = "http://localhost:5173")
public class LeaveController {

    private final LeaveService leaveService;

    public LeaveController(LeaveService leaveService) {
        this.leaveService = leaveService;
    }

    // Add leave
    @PostMapping
    public Leave addLeave(@RequestBody Leave leave) {
        return leaveService.addLeave(leave);
    }

    // Get all leaves
    @GetMapping
    public List<Leave> getAllLeaves() {
        return leaveService.getAllLeaves();
    }

    // Get leave by ID
    @GetMapping("/{id}")
    public Optional<Leave> getLeaveById(@PathVariable Long id) {
        return leaveService.getLeaveById(id);
    }

    // Update leave
    @PutMapping("/{id}")
    public Leave updateLeave(
            @PathVariable Long id,
            @RequestBody Leave leave) {

        return leaveService.updateLeave(id, leave);
    }

    // Delete leave
    @DeleteMapping("/{id}")
    public String deleteLeave(@PathVariable Long id) {
        leaveService.deleteLeave(id);
        return "Leave deleted successfully";
    }
}