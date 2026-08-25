package com.payroll.employee.service;

import com.payroll.employee.entity.Employee;
import com.payroll.employee.repository.EmployeeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    public EmployeeService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    // Add employee
    public Employee addEmployee(Employee employee) {
        return employeeRepository.save(employee);
    }

    // Get all employees
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    // Get employee by ID
    public Optional<Employee> getEmployeeById(Long id) {
        return employeeRepository.findById(id);
    }

    // Delete employee
    public void deleteEmployee(Long id) {
        employeeRepository.deleteById(id);
    }

    // Update employee
    public Employee updateEmployee(Long id, Employee updatedEmployee) {

        Employee existingEmployee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        existingEmployee.setFirstName(updatedEmployee.getFirstName());
        existingEmployee.setLastName(updatedEmployee.getLastName());
        existingEmployee.setEmail(updatedEmployee.getEmail());
        existingEmployee.setPhone(updatedEmployee.getPhone());
        existingEmployee.setDepartment(updatedEmployee.getDepartment());
        existingEmployee.setRole(updatedEmployee.getRole());
        existingEmployee.setSalary(updatedEmployee.getSalary());
        existingEmployee.setJoiningDate(updatedEmployee.getJoiningDate());

        return employeeRepository.save(existingEmployee);
    }

}