package com.example.todolist.dto;

import com.example.todolist.entity.TaskStatus;

public record taskResponseDto(String id, String name, String description, TaskStatus status) {
}
