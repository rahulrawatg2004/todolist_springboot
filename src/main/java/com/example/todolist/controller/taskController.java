package com.example.todolist.controller;

import com.example.todolist.dto.taskRequestDto;
import com.example.todolist.dto.taskResponseDto;
import com.example.todolist.service.taskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class taskController {
    @Autowired
    taskService taskService;

    @GetMapping
    public List<taskResponseDto> getAllTasks() {
        return taskService.getAllTasks();
    }
    @GetMapping("/{id}")
    public taskResponseDto getTaskById(@PathVariable String id) {
        return taskService.getTaskById(id);
    }
    @PostMapping
    public taskResponseDto addTask(@RequestBody taskRequestDto taskRequestDto) {
        return taskService.addTask(taskRequestDto);
    }
    @PutMapping("/{id}")
    public taskResponseDto updateTask(@RequestBody taskRequestDto taskRequestDto,@PathVariable String id) {
        return taskService.updateTask(id,taskRequestDto);
    }
    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable String id) {
         taskService.deleteTask(id);
    }

}
