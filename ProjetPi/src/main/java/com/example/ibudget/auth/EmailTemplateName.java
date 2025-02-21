package com.example.ibudget.auth;

import lombok.Getter;

@Getter
public enum EmailTemplateName {
    ACTIVATE_ACCOUNT("activate_account"),
    ALERT_BLOCKED_ACCOUNT("alert_blocked_account"),
    RESTORE_ACCOUNT_ACCESS("restore_account_access"),
    RESET_PASSWORD("reset_password");

    private final String name;

    EmailTemplateName(String name) {
        this.name = name;
    }
}
