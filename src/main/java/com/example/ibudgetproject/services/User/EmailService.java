package com.example.ibudgetproject.services.User;
import com.example.ibudgetproject.configurations.EmailTemplateName;
import com.example.ibudgetproject.entities.User.ConnexionInformation;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {
    private final JavaMailSender mailSender;
    private final  SpringTemplateEngine templateEngine;

    @Async
    public void sendEmail(String to
            , String userName ,
                          EmailTemplateName emailTemplate,
                          String receivedObject , ConnexionInformation cnxInfo,
                          String mapUrl,
                          String subject ) throws MessagingException {
        try {
            String templateName;
            if (emailTemplate == null){
                templateName="Confirm Email";
            }
            else{
                templateName=emailTemplate.name();
            }

            MimeMessage mimeMessage =mailSender.createMimeMessage();
            MimeMessageHelper helper =new MimeMessageHelper(
                    mimeMessage,
                    MimeMessageHelper.MULTIPART_MODE_MIXED,
                    StandardCharsets.UTF_8.name()
            );


            Map<String,Object> properties= new HashMap<>();
            properties.put("userName", userName);
            properties.put("receivedObject", receivedObject);
            properties.put("deviceName",cnxInfo.getDeviceName());
            properties.put("deviceType",cnxInfo.getDeviceType());
            properties.put("loginAttemptTime",cnxInfo.getCreatedDate());
            properties.put("location",cnxInfo.getCity());
            properties.put("mapUrl",mapUrl);

            Context context = new Context();
            context.setVariables(properties);

            helper.setFrom("contact@ibudget.com");
            helper.setTo(to);
            helper.setSubject(subject);

            String template = templateEngine.process(templateName, context);
            helper.setText(template, true);

            mailSender.send(mimeMessage);
            log.info("Email sent successfully to {}", to);
        } catch (MessagingException e) {
            log.error("MessagingException while sending email: {}", e.getMessage(), e);
        } catch (Exception e) {
            log.error("Unexpected error while sending email: {}", e.getMessage(), e);
        }

    }
}
