package com.example.ibudgetproject.controllers.Investment;


import com.example.ibudgetproject.Response.ChatbotInvestApiResponse;
import com.example.ibudgetproject.Response.PromptBody;
import com.example.ibudgetproject.services.Investment.ChatbotService;
import com.stripe.net.ApiResource;
import io.swagger.v3.oas.models.responses.ApiResponse;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/ai/chat")
public class ChatbotController {

    private final ChatbotService chatbotService;

    public ChatbotController(ChatbotService chatbotService) {
        this.chatbotService = chatbotService;
    }

    @PostMapping
    public ResponseEntity<ChatbotInvestApiResponse> getCoinsDetails(@RequestBody PromptBody prompt) throws Exception {
        chatbotService.getCoinDetails(prompt.getPrompt());


        ChatbotInvestApiResponse response= chatbotService.getCoinDetails(prompt.getPrompt());
        return new ResponseEntity<>(response, HttpStatus.OK);

    }
    @PostMapping("/simple")
    public ResponseEntity<String> simpleChatHandler(@RequestBody PromptBody prompt) throws Exception {
        String response= chatbotService.simpleChat(prompt.getPrompt());


        //ChatbotInvestApiResponse response= new ChatbotInvestApiResponse();
        //response.setMessage(prompt.getPrompt());
        return new ResponseEntity<>(response, HttpStatus.OK);

    }

}
