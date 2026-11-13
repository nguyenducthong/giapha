package com.giaphaviet.dto;

import java.util.UUID;

public class AuthResponse {
    private String token;
    private String refreshToken;
    private UUID userId;
    private String email;
    private String fullName;

    public AuthResponse() {}

    public AuthResponse(String token, String refreshToken, UUID userId, String email, String fullName) {
        this.token = token;
        this.refreshToken = refreshToken;
        this.userId = userId;
        this.email = email;
        this.fullName = fullName;
    }

    public String getToken() { return token; }
    public String getRefreshToken() { return refreshToken; }
    public UUID getUserId() { return userId; }
    public String getEmail() { return email; }
    public String getFullName() { return fullName; }
}
