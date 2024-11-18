// Listing.java
package com.wanderlust.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document
public class Listing {
    @Id
    private String id;
    private String title;
    private String description;
    private String image;
    private Double price;
    private String location;
    private String country;
    private List<Review> reviews;

    // Getters and Setters
}

// Review.java
package com.wanderlust.model;

public class Review {
    private String comment;
    private int rating;

    // Getters and Setters
}

// User.java
package com.wanderlust.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
public class User {
    @Id
    private String id;
    private String username;
    private String email;
    private String password;

    // Getters and Setters
}