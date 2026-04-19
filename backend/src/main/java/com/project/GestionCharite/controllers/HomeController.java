package com.project.GestionCharite.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String home(Model model) {
        // This 'message' matches the ${message} in your HTML
        model.addAttribute("message", "Welcome to Thymeleaf!");
        
        // Return the name of the HTML file (without .html)
        return "index"; 
    }
}
