package com.eventbooking.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NotificationSettingsUpdate {
    private Boolean notificationEmail;
    private Boolean notificationPush;
    private Boolean notificationReminders;
}
