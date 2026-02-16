package com.example.todolist.repository;

import com.example.todolist.dto.taskResponseDto;
import com.example.todolist.model.taskModel;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface taskRepository extends MongoRepository<taskModel,String> {
}
