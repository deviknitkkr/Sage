package com.devik.sage.controller;

import com.devik.sage.model.User;
import com.devik.sage.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @GetMapping("/login")
    public String loginPage() {
        return "login";
    }

    @GetMapping("/register")
    public String registerPage(Model model) {
        model.addAttribute("user", new User());
        return "register";
    }

    @PostMapping("/register")
    public String registerUser(@Valid @ModelAttribute("user") User user,
                               BindingResult result, Model model) {
        if (result.hasErrors()) {
            return "register";
        }

        // Check if username exists
        if (userService.isUsernameExists(user.getUsername())) {
            model.addAttribute("usernameError", "Username already exists");
            return "register";
        }

        // Check if email exists
        if (userService.isEmailExists(user.getEmail())) {
            model.addAttribute("emailError", "Email already exists");
            return "register";
        }

        userService.registerUser(user);
        return "redirect:/login?registered";
    }
}
