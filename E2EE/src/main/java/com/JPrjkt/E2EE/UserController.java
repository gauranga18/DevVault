package com.JPrjkt.E2EE;

import com.JPrjkt.E2EE.User;
import com.JPrjkt.E2EE.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return userService.saveUser(user);
    }

    @GetMapping("/{email}")
    public User getByEmail(@PathVariable String email) {
        return userService.getUserByEmail(email).orElse(null);
    }
}
