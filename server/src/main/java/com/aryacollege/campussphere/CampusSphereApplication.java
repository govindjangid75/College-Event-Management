package com.aryacollege.campussphere;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication
@EnableMongoRepositories
public class CampusSphereApplication {

    static {
        System.setProperty("java.net.preferIPv6Addresses", "true");
    }

    public static void main(String[] args) {
        System.setProperty("java.net.preferIPv6Addresses", "true");
        SpringApplication.run(CampusSphereApplication.class, args);
    }
}
