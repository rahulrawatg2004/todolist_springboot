package com.example.todolist.dto;

import com.example.todolist.entity.TaskStatus;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class taskRequestDto {
    @NotBlank(message= "name must be required")
    private String name;

    @NotBlank(message = "Description required")
    @Size(min = 1, max = 50, message = "Description can't exceed 50 characters")
    private String description;


    @NotNull(message = "Status is required")
    private TaskStatus status;
}
