package com.example.todolist.service;

import com.example.todolist.dto.taskRequestDto;
import com.example.todolist.dto.taskResponseDto;
import com.example.todolist.model.taskModel;
import com.example.todolist.repository.taskRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class taskService {
    private final taskRepository taskRepository;
    public taskService(taskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public taskResponseDto getTaskById(String id) {
        taskModel taskModel = taskRepository.findById(id).get();
        return new taskResponseDto(
                taskModel.getId(),
                taskModel.getName(),
                taskModel.getDescription(),
                taskModel.getStatus()
        );
    }
    public List<taskResponseDto> getAllTasks() {
        List<taskModel> taskModels = taskRepository.findAll();
        List<taskResponseDto> taskResponseDtos = new ArrayList<>();
        for (taskModel taskModel : taskModels) {
            taskResponseDtos.add(new taskResponseDto(
                    taskModel.getId(),
                    taskModel.getName(),
                    taskModel.getDescription(),
                    taskModel.getStatus()
            ));
        }
        return taskResponseDtos;
    }
    public taskResponseDto addTask(taskRequestDto taskRequestDto) {
        taskModel task = new taskModel();
        task.setName(taskRequestDto.getName());
        task.setDescription(taskRequestDto.getDescription());
        task.setStatus(taskRequestDto.getStatus());

        taskModel saved = taskRepository.save(task);

        return new taskResponseDto(
                saved.getId(),
                saved.getName(),
                saved.getDescription(),
                saved.getStatus()
        );

    }
    public taskResponseDto updateTask(String id,taskRequestDto taskRequestDto) {
        taskModel task = taskRepository.findById(id)
        .orElseThrow(()-> new RuntimeException("task not found"));
        task.setName(taskRequestDto.getName());
        task.setDescription(taskRequestDto.getDescription());
        task.setStatus(taskRequestDto.getStatus());
        taskModel saved = taskRepository.save(task);
        return new taskResponseDto(
                saved.getId(),
                saved.getName(),
                saved.getDescription(),
                saved.getStatus()


        );
    }
    public void deleteTask(String id) {
        taskModel  task = taskRepository.findById(id)
        .orElseThrow(()-> new RuntimeException("task not found"));
        taskRepository.delete(task);
    }


}
