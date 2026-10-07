package com.aryacollege.campussphere.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "venues")
public class Venue {

    @Id
    private String id;

    @Indexed(unique = true)
    private String code;

    private String name;
    private int capacity;
    private String location;
    private List<String> facilities;
    private boolean active;
}
