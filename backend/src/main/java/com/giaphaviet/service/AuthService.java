package com.giaphaviet.service;

import com.giaphaviet.config.JwtUtil;
import com.giaphaviet.dto.AuthRequest;
import com.giaphaviet.dto.AuthResponse;
import com.giaphaviet.model.User;
import com.giaphaviet.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email hoặc mật khẩu không chính xác"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Email hoặc mật khẩu không chính xác");
        }

        String token = jwtUtil.generateToken(user.getId(), user.getEmail());
        String refreshToken = jwtUtil.generateRefreshToken(user.getId());

        return new AuthResponse(token, refreshToken, user.getId(), user.getEmail(), user.getFullName());
    }

    public AuthResponse register(String email, String password, String fullName) {
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email này đã được đăng ký tài khoản");
        }

        User user = new User(email, passwordEncoder.encode(password), fullName);
        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getId(), user.getEmail());
        String refreshToken = jwtUtil.generateRefreshToken(user.getId());

        return new AuthResponse(token, refreshToken, user.getId(), user.getEmail(), user.getFullName());
    }
}
